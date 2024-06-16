import Image from 'next/image'
import Link from 'next/link'
import { Episode } from '@prisma/client'

type Prop = {
  episodes: Episode[]
}

const Card = ({ episodes }: Prop) => {
  return (
    <>
      <div className='flex flex-col space-y-4'>
        {episodes.map((episode: Episode, index) => {
          return (
            <>
              <Link
                key={index}
                href={`/episode/${episode.id}`}
                className='flex'
              >
                <div className='relative min-h-24 min-w-24'>
                  <Image
                    className='object-cover'
                    alt={episode.title.slice(0, 20)}
                    src={episode.cover as string}
                    fill
                  />
                </div>
                <div className='p-2 content-center'>
                  <p>{episode.title}</p>
                </div>
              </Link>
              <hr />
            </>
          )
        })}
      </div>
    </>
  )
}

export default Card
