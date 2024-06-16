import { Suspense } from 'react'
import SeriesCard from '@/components/SeriesCard'
import { fetchAllSeries } from '@/lib/fetchData'

const Home = async () => {
  const seriesArray = await fetchAllSeries()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='flex flex-col space-y-4'>
        {seriesArray.map((series, index) => {
          return <SeriesCard key={index} {...series} />
        })}
      </div>
    </Suspense>
  )
}

export default Home
