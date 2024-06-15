import { fetchAllSeries, fetchSeries } from '@/lib/fetchData'
import EpisodeList from '@/components/EpisodeList'

export const dynamicParams = false

export async function generateStaticParams() {
  const seriesArray = await fetchAllSeries()

  return seriesArray.map((series) => ({ id: series.id }))
}

export default async function SeriesPage({
  params,
}: {
  params: { id: string }
}) {
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
