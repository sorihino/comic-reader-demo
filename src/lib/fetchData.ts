import { Episode, Page } from '@prisma/client'
import prisma from './db'

export async function fetchAllSeries() {
  const seriesArray = await prisma.series.findMany()

  return seriesArray
}

export const fetchSeries = async (seriesId: string) => {
  const series = await prisma.series.findUnique({
    where: {
      id: seriesId,
    },
    select: {
      id: true,
      title: true,
      cover: true,
      author: true,
      description: true,
      episodes: {
        select: {
          id: true,
          title: true,
          cover: true,
          seriesId: true,
          episodeNumber: true,
        },
      },
    },
  })

  if (series === null) {
    throw new Error('somehting sjad')
  }

  return series
}

export async function fetchAllEpisodes() {
  const episodes = await prisma.episode.findMany()

  return episodes
}

export async function fetchEpisodes(seriesId: string): Promise<Episode[]> {
  const episodes = await prisma.series.findUnique({
    where: {
      id: seriesId,
    },
    select: {
      episodes: true,
    },
  })

  if (!episodes) {
    throw new Error(`Matched record(s) not found for episode ID: ${seriesId}`)
  }

  return episodes.episodes
}

export async function fetchEpisode(
  episodeId: string,
): Promise<Episode & { pages: Page[] }> {
  const episode = await prisma.episode.findUnique({
    where: {
      id: episodeId,
    },
    include: {
      pages: {
        orderBy: {
          pageNumber: 'asc',
        },
      },
    },
  })

  if (episode === null) {
    throw new Error(`Matched record(s) not found for episode ID: ${episodeId}`)
  }

  return episode
}
