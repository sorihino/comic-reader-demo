import Image from 'next/image'
import Link from 'next/link'
import { Series } from '@prisma/client'

const Card = ({ id, author, title, description, cover }: Series) => {
  return (
    <Link
      href={`/series/${id}`}
      className='flex flex-col bg-stone-300 border-2 border-stone-500'
    >
      <div className='relative min-h-32'>
        <Image
          className='object-cover'
          alt={title.slice(0, 20)}
          src={cover as string}
          fill
        />
      </div>
      <div className='p-2 border-t-2 border-stone-500'>
        <h3>{title}</h3>
        <span className='text-sm text-stone-500'>{author}</span>
        <p>{description}</p>
      </div>
    </Link>
  )
}

export default Card
