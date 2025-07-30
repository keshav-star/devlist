import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlaylistType } from '@/models/Playlist'

// API endpoints
const API_BASE = '/api'

// Types
interface CreatePlaylistData {
  name: string
}

interface AddVideoData {
  title: string
  youtubeId: string
  note?: string
}

interface UpdateVideoData {
  status?: 'to-watch' | 'watching' | 'watched'
  note?: string
}

// API functions
const api = {
  // Playlists
  getPlaylists: async (): Promise<PlaylistType[]> => {
    const response = await fetch(`${API_BASE}/playlists`)
    if (!response.ok) throw new Error('Failed to fetch playlists')
    return response.json()
  },

  createPlaylist: async (data: CreatePlaylistData): Promise<PlaylistType> => {
    const response = await fetch(`${API_BASE}/playlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to create playlist')
    return response.json()
  },

  deletePlaylist: async (playlistId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/playlists/${playlistId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete playlist')
  },

  // Videos
  addVideo: async (playlistId: string, data: AddVideoData): Promise<void> => {
    const response = await fetch(`${API_BASE}/playlists/${playlistId}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to add video')
  },

  updateVideo: async (playlistId: string, videoId: string, data: UpdateVideoData): Promise<void> => {
    const response = await fetch(`${API_BASE}/playlists/${playlistId}/videos/${videoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update video')
  },

  deleteVideo: async (playlistId: string, videoId: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/playlists/${playlistId}/videos/${videoId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete video')
  }
}

// Query keys
export const queryKeys = {
  playlists: ['playlists'] as const,
  playlist: (id: string) => ['playlist', id] as const,
}

// Custom hooks
export const usePlaylists = () => {
  return useQuery({
    queryKey: queryKeys.playlists,
    queryFn: api.getPlaylists,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.createPlaylist,
    onSuccess: (newPlaylist) => {
      // Update the playlists cache
      queryClient.setQueryData(queryKeys.playlists, (old: PlaylistType[] | undefined) => {
        return old ? [newPlaylist, ...old] : [newPlaylist]
      })
    },
  })
}

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.deletePlaylist,
    onSuccess: (_, playlistId) => {
      // Remove from cache
      queryClient.setQueryData(queryKeys.playlists, (old: PlaylistType[] | undefined) => {
        return old ? old.filter(playlist => playlist._id !== playlistId) : []
      })
    },
  })
}

export const useAddVideo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ playlistId, data }: { playlistId: string; data: AddVideoData }) =>
      api.addVideo(playlistId, data),
    onSuccess: () => {
      // Invalidate and refetch playlists
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
    },
  })
}

export const useUpdateVideo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ playlistId, videoId, data }: { playlistId: string; videoId: string; data: UpdateVideoData }) =>
      api.updateVideo(playlistId, videoId, data),
    onSuccess: () => {
      // Invalidate and refetch playlists
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
    },
  })
}

export const useDeleteVideo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ playlistId, videoId }: { playlistId: string; videoId: string }) =>
      api.deleteVideo(playlistId, videoId),
    onSuccess: () => {
      // Invalidate and refetch playlists
      queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
    },
  })
} 