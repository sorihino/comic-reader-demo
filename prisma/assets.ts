import fs from 'fs'
import path from 'path'

type Meta = { author: string; title: string; description: string }
export type Asset = Meta & {
    cover: string
    episodes: { cover: string; episodeNumber: number; pages: string[] }[]
}

let assets: Asset[] = []

const basedir = path.resolve(__dirname, 'resource/comics')
const seriesDirents = fs
    .readdirSync(basedir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())

for (const seriesDirent of seriesDirents) {
    const metadataFilepath = path.join(basedir, seriesDirent.name, 'meta.json')

    try {
        const metadata: Meta = JSON.parse(
            fs.readFileSync(metadataFilepath, 'utf-8'),
        )

        const episodesDirents = fs
            .readdirSync(path.join(basedir, seriesDirent.name), {
                withFileTypes: true,
            })
            .filter((dirent) => dirent.isDirectory())

        const episodes = episodesDirents.map((episodeDirent, index) => {
            const pages = fs
                .readdirSync(
                    path.join(basedir, seriesDirent.name, episodeDirent.name),
                )
                .map((filename) =>
                    path.join(
                        basedir,
                        seriesDirent.name,
                        episodeDirent.name,
                        filename,
                    ),
                )

            return {
                cover: pages[0],
                episodeNumber: index + 1,
                pages: pages,
            }
        })

        assets.push({ ...metadata, cover: episodes[0].pages[0], episodes: episodes })
    } catch (error) {
        console.error(error)
    }
}

export default assets
