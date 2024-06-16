import fs from 'fs'
import crypto from 'crypto'
import { v2 as cloudinary } from 'cloudinary'
import { PrismaClient, Series, Episode, Page } from '@prisma/client'
import assets, { Asset } from './assets'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const hash = (seed: string | Buffer) => {
    return crypto.createHash('md5').update(seed).digest('hex').slice(0, 20)
}

const uploadImageToCloudinary = async (
    file: string,
    hash: string,
    episodeId: string,
): Promise<string> => {
    const result = await cloudinary.uploader.upload(file, {
        public_id: `${episodeId}/${hash}`,
    })

    return result.secure_url
}

const upsertSeriesRecord = async (
    { ...params }: Series,
    client: PrismaClient,
) => {
    console.log('upsertSeriesRecord: ', params)

    try {
        await client.series.upsert({
            where: {
                id: params.id,
            },
            create: {
                id: params.id,
                author: params.author,
                title: params.title,
                cover: params.cover,
                description: params.description,
            },
            update: {},
        })
    } catch (error) {
        console.error(error)
    }
}

const upsertEpisodeRecord = async (
    { ...params }: Episode & { pages: Omit<Page, 'episodeId'>[] },
    client: PrismaClient,
) => {
    console.log('upsertEpisodeRecord: ', params)

    try {
        await client.episode.upsert({
            where: {
                id: params.id,
            },
            create: {
                id: params.id,
                title: params.title,
                seriesId: params.seriesId,
                episodeNumber: params.episodeNumber,
                cover: params.cover,
                pages: {
                    createMany: {
                        data: params.pages,
                    },
                },
            },
            update: {},
        })
    } catch (error) {
        console.error(error)
    }
}

const processAsset = async (asset: Asset, client: PrismaClient) => {
    const salt = process.env.SALT
    const seriesId = hash(asset.title + salt)

    for (const episode of asset.episodes) {
        const episodeTitle = `${asset.title} #${episode.episodeNumber}`
        const episodeId = hash(episodeTitle + salt)
        const images = await Promise.all(
            episode.pages.map(async (imagePath, index) => {
                const imageHash = hash(fs.readFileSync(imagePath))
                const imageUrl = await uploadImageToCloudinary(
                    imagePath,
                    imageHash,
                    episodeId,
                )

                return {
                    url: imageUrl,
                    id: imageHash,
                    pageNumber: index,
                }
            }),
        )

        if (episode.episodeNumber === 1) {
            await upsertSeriesRecord(
                {
                    id: seriesId,
                    author: asset.author,
                    title: asset.title,
                    description: asset.description,
                    cover: images[0].url,
                },
                client,
            )
        }
        
        await upsertEpisodeRecord(
            {
                id: episodeId,
                title: episodeTitle,
                seriesId: seriesId,
                cover: images[0].url,
                episodeNumber: episode.episodeNumber,
                pages: images,
            },
            client,
        )
    }
}

const main = async () => {
    const client = new PrismaClient()

    for (const asset of assets) {
        await processAsset(asset, client)
    }

    client.$disconnect()
}

main()
