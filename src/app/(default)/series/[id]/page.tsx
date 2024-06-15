import type { Metadata } from 'next'
import { fetchAllSeries, fetchSeries, fetchSeriesTitleById } from '@/lib/fetchData'
import EpisodeList from '@/components/EpisodeList'

export const dynamicParams = false

export const generateStaticParams = async () => {
  const seriesArray = await fetchAllSeries()

  return seriesArray.map((series) => ({ id: series.id }))
}

export const generateMetadata = async ({ params }: { params: { id: string }}): Promise<Metadata> => {
  const title = await fetchSeriesTitleById(params.id)

  return {
    title: title
  }
}

const SeriesPage = async ({
  params,
}: {
  params: { id: string }
}) => {
  const seriesId = params.id
  const series = await fetchSeries(seriesId)

  return (
    <div className='flex flex-col md:flex-row md:space-x-4'>
      <div className='md:w-48 mb-4 md:mb-0'>
        <h3 className='text-xl font-semibold'>{series.title}</h3>
        <span className='text-sm text-stone-500'>{series.author}</span>
        <p>{series.description}</p>
      </div>
      <div className='flex-auto'>
        <EpisodeList episodes={series.episodes} />
      </div>
    </div>
  )
}

export default SeriesPage
