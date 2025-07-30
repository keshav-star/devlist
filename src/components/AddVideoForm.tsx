'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Play, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { extractYouTubeId } from '@/lib/utils'
import { PlaylistType } from '@/models/Playlist'

interface AddVideoFormProps {
  playlists: PlaylistType[]
  onPlaylistCreated: (playlist: PlaylistType) => void
  onVideoAdded: () => void
}

export function AddVideoForm({ playlists, onPlaylistCreated, onVideoAdded }: AddVideoFormProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoNote, setVideoNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPlaylistName.trim() })
      })

      if (response.ok) {
        const playlist = await response.json()
        onPlaylistCreated(playlist)
        setSelectedPlaylistId(playlist._id)
        setNewPlaylistName('')
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Failed to create playlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVideo = async () => {
    if (!selectedPlaylistId || !videoUrl.trim()) return

    const youtubeId = extractYouTubeId(videoUrl)
    if (!youtubeId) {
      alert('Please enter a valid YouTube URL')
      return
    }

    setIsLoading(true)
    try {
      // For demo purposes, we'll use a placeholder title
      // In a real app, you'd fetch the actual video title from YouTube API
      const videoTitle = `Video ${Date.now()}`

      const response = await fetch(`/api/playlists/${selectedPlaylistId}/videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle,
          youtubeId,
          note: videoNote.trim()
        })
      })

      if (response.ok) {
        setVideoUrl('')
        setVideoNote('')
        onVideoAdded()
      }
    } catch (error) {
      console.error('Failed to add video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6"
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DevList</h1>
        <p className="text-gray-600">Organize your YouTube videos with ease</p>
      </div>

      <div className="space-y-4">
        {/* Playlist Selection/Creation */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Playlist
            </label>
            <Select value={selectedPlaylistId} onValueChange={setSelectedPlaylistId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a playlist..." />
              </SelectTrigger>
              <SelectContent>
                {playlists.map((playlist) => (
                  <SelectItem key={playlist._id} value={playlist._id || ''}>
                    {playlist.name} ({playlist.videos.length} videos)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2"
            >
              {showCreateForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showCreateForm ? 'Cancel' : 'Create New'}
            </Button>
          </div>
        </div>

        {/* Create New Playlist Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-4"
            >
              <Input
                placeholder="Enter playlist name..."
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleCreatePlaylist}
                disabled={isLoading || !newPlaylistName.trim()}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video URL Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video URL
          </label>
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Add a note (optional)"
            value={videoNote}
            onChange={(e) => setVideoNote(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={handleAddVideo}
            disabled={isLoading || !selectedPlaylistId || !videoUrl.trim()}
            className="w-full flex items-center justify-center gap-2"
          >
            <Play className="h-4 w-4" />
            Add to Playlist
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 