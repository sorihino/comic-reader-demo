import type { Metadata } from 'next'
import Viewer from '@/components/Viewer'
import { fetchEpisode, fetchAllEpisodes, fetchEpisodeTitleById } from '@/lib/fetchData'

export const dynamicParams = false

export const generateStaticParams = async () => {
  const seriesArray = await fetchAllEpisodes()

  return seriesArray.map((series) => ({ id: series.id }))
}

export const generateMetadata = async ({ params }: { params: { id: string }}): Promise<Metadata> => {
  const title = await fetchEpisodeTitleById(params.id)

  return {
    title: title
  }
}

type Props = {
  params: {
    id: string
  }
}

const EpisodePage = async ({ params }: Props) => {
  const episodeId = params.id
  const episode = await fetchEpisode(episodeId)

  return (
    <div className='w-screen h-dvh'>
      <Viewer {...episode} />
    </div>
  )
}

export default EpisodePage
