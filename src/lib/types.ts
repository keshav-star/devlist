type VideoStatus = 'to-watch' | 'watching' | 'watched'

type VideosInterface =
  | {
      _id: string
      type: 'youtube'
      title: string
      youtubeId: string
      status: VideoStatus
      note: string
      addedAt?: Date
    }
  | {
      _id: string
      type: 'link'
      title: string
      url: string
      status: VideoStatus
      note: string
      addedAt?: Date
    }

type PlaylistInterface = {
  _id: string
  name: string
  userId: string
  videos: VideosInterface[]
  createdAt: Date
  updatedAt: Date
}

export type { PlaylistInterface, VideosInterface };
