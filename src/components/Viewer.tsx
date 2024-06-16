'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { Episode, Page } from '@prisma/client'

type Props = {
  breakpointAspectRatio?: number
  pages: Page[]
} & Episode

const Viewer = ({ breakpointAspectRatio = 5 / 4, pages, title }: Props) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isSingleView, setSingleView] = useState<boolean>()
  const [isMenuVisible, setMenuVisibility] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const translateX = useMemo(() => {
    return (isSingleView ? currentPage : Math.floor(currentPage / 2)) * 100 * -1
  }, [isSingleView, currentPage])

  // 見開きレイアウトではcurrentPageの値として候補が2つあるが、そのうち小さい値を用いる
  if (!isSingleView && currentPage % 2 !== 0) {
    setCurrentPage(currentPage - 1)
  }

  const handler = {
    click: {
      prev: () => {
        setCurrentPage(Math.max(currentPage - (isSingleView ? 1 : 2), 0))
      },
      next: () => {
        setCurrentPage(
          Math.min(currentPage + (isSingleView ? 1 : 2), pages.length - 1),
        )
      },
      center: () => {
        setMenuVisibility(!isMenuVisible)
      },
    },
    input: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value)
      setCurrentPage(value)
    },
  }

  useEffect(() => {
    let width: number, height: number

    const handleResize = () => {
      width = containerRef.current?.clientWidth || 0
      height = containerRef.current?.clientHeight || 0

      setSingleView(height / width > breakpointAspectRatio)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [breakpointAspectRatio])

  return (
    <div className='w-full h-screen relative overflow-hidden bg-stone-700 text-stone-100'>
      {isMenuVisible && (
        <>
          <div className='w-full text-center z-20 p-2 absolute top-0 opacity-80 bg-stone-500'>
            <h3 className='font-normal'>{title}</h3>
          </div>
          <div className='w-full text-center z-20 p-2 absolute bottom-0 opacity-80 bg-stone-500'>
            <input
              className='w-full max-w-screen-2xl cursor-pointer accent-stone-700 bg-stone-300'
              type='range'
              value={currentPage}
              min={0}
              max={pages.length - 1}
              onChange={handler.input}
            />
            <div>{`${currentPage + 1} / ${pages.length} ページ`}</div>
          </div>
        </>
      )}
      <div className='h-full overflow-hidden' ref={containerRef}>
        <a
          className='absolute h-full w-[calc(100%/3)] left-0 z-10 cursor-pointer'
          onClick={handler.click.prev}
        ></a>
        <a
          className='absolute h-full w-[calc(100%/3)] right-0 z-10 cursor-pointer'
          onClick={handler.click.next}
        ></a>
        <a
          className='absolute h-full w-[calc(100%/3)] left-[calc(100%/3)] z-10'
          onClick={handler.click.center}
        ></a>
        <div
          className='flex h-full duration-300'
          style={{
            transform: `translateX(${translateX}%)`,
          }}
        >
          {pages.map((page, index) => (
            <div
              className={`${
                isSingleView ? 'flex-[0_0_100%]' : 'flex-[0_0_50%]'
              } relative`}
              key={index}
            >
              {isSingleView ? (
                <Image
                  className='object-contain'
                  draggable='false'
                  src={page.url}
                  alt={`page ${index}`}
                  fill
                  sizes='100%'
                />
              ) : (
                <Image
                  className={`object-contain ${index % 2 === 0 ? 'object-right' : 'object-left'}`}
                  draggable='false'
                  src={page.url}
                  alt={`page ${index}`}
                  fill
                  sizes='100%'
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Viewer
