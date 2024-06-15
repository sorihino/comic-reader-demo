import { Episode, Page } from '@prisma/client'
import prisma from './db'

export const fetchAllSeries = async () => {
  const seriesArray = await prisma.series.findMany()

  if (seriesArray.length === 0) {
    throw new Error(`No series record exists on database`)
  }

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
    throw new Error(`Matched record(s) not found for series ID: ${seriesId}`)
  }

  return series
}

export const fetchAllEpisodes = async () => {
  const episodes = await prisma.episode.findMany()

  return episodes
}

export const fetchEpisodes = async (seriesId: string): Promise<Episode[]> => {
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

export const fetchEpisode = async (
  episodeId: string,
): Promise<Episode & { pages: Page[] }> => {
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

export const fetchSeriesTitleById = async (seriesId: string) => {
  const data = await prisma.series.findFirst({
    where: {
      id: seriesId,
    },
    select: {
      title: true,
    }
  })

  if (data === null) {
    throw new Error(`No matched record found for series ID: ${seriesId}`)
  }

  return data.title
}

export const fetchEpisodeTitleById = async (episodeId: string) => {
  const data = await prisma.episode.findFirst({
    where: {
      id: episodeId,
    },
    select: {
      title: true,
    }
  })

  if (data === null) {
    throw new Error(`No matched record found for episode ID: ${episodeId}`)
  }

  return data.title
}
