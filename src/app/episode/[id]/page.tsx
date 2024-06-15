import Viewer from '@/components/Viewer'
import { fetchEpisode, fetchAllEpisodes } from '@/lib/fetchData'

export const dynamicParams = false

export async function generateStaticParams() {
  const seriesArray = await fetchAllEpisodes()

  return seriesArray.map((series) => ({ id: series.id }))
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
    <div className='w-screen h-screen'>
      <Viewer {...episode} />
    </div>
  )
}

export default EpisodePage
