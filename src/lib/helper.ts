export const sanitizePlaylist = (playlist: any) => ({
  id: playlist._id.toString(),
  title: playlist.title,
  videos: playlist.videos.map((video: any) => ({
    title: video.title,
    youtubeId: video.youtubeId,
    note: video.note,
    status: video.status,
    addedAt: video.addedAt,
  })),
});
