import { program } from 'commander'
import * as fs from 'node:fs'
import * as crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'

program
    .requiredOption('--files <files...>')
    .requiredOption('--meta <file>')
    .parse()

const options = program.opts()
const salt = process.env.SALT
const prisma = new PrismaClient()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

type Meta = {
    author?: string
    seriesTitle: string
    episodeTitle: string
    episodeNumber: number
}

type Data = {
    seriesId: string
    episodeId: string
    images: {
        url: string
        imageId: string
    }[]
} & Meta

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

const upsertRecords = async (data: Data) => {
    await prisma.series.upsert({
        where: {
            id: data.seriesId,
        },
        create: {
            id: data.seriesId,
            title: data.seriesTitle,
        },
        update: {},
    })

    await prisma.episode.upsert({
        where: {
            id: data.episodeId,
        },
        create: {
            id: data.episodeId,
            title: data.episodeTitle,
            seriesId: data.seriesId,
            episodeNumber: data.episodeNumber,
        },
        update: {},
    })

    await Promise.all(
        data.images.map(async ({ url, imageId }, index) => {
            await prisma.page.upsert({
                where: {
                    id: imageId,
                },
                create: {
                    id: imageId,
                    url: url,
                    pageNumber: index,
                    episodeId: data.episodeId,
                },
                update: {},
            })
        }),
    )
}

const main = async () => {
    const files: string[] = options.files
    const meta: Meta = JSON.parse(fs.readFileSync(options.meta, 'utf-8'))
    const [seriesTitle, seriesId, episodeTitle, episodeId, episodeNumber] = [
        meta.seriesTitle,
        hash(meta.seriesTitle + salt),
        meta.episodeTitle,
        hash(meta.episodeTitle + salt),
        meta.episodeNumber,
    ]

    const images = await Promise.all(
        files.map(async (file) => {
            const imageHash = hash(fs.readFileSync(file))
            const imageUrl = await uploadImageToCloudinary(
                file,
                imageHash,
                episodeId,
            )

            return { url: imageUrl, imageId: imageHash }
        }),
    )

    upsertRecords({
        seriesId: seriesId,
        seriesTitle: seriesTitle,
        episodeId: episodeId,
        episodeTitle: episodeTitle,
        episodeNumber: episodeNumber,
        images: images,
    })
}

main()
