'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Eye, EyeOff, Clock, Trash2, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getStatusColor, formatDate } from '@/lib/utils'
import { PlaylistType, VideoType } from '@/models/Playlist'

interface VideoPlayerSectionProps {
  selectedPlaylist: PlaylistType | null
  onVideoStatusUpdate: (videoId: string, status: 'to-watch' | 'watching' | 'watched') => void
  onVideoDelete: (videoId: string) => void
  onVideoNoteUpdate: (videoId: string, note: string) => void
}

export function VideoPlayerSection({
  selectedPlaylist,
  onVideoStatusUpdate,
  onVideoDelete,
  onVideoNoteUpdate
}: VideoPlayerSectionProps) {
  const [currentVideoId, setCurrentVideoId] = useState<string>('')
  const [editingNoteId, setEditingNoteId] = useState<string>('')
  const [editingNote, setEditingNote] = useState('')
  const [sortBy, setSortBy] = useState<'added' | 'status'>('added')

  if (!selectedPlaylist) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center text-gray-500">
          <Play className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No Playlist Selected</h3>
          <p>Select a playlist from above to start watching videos</p>
        </div>
      </div>
    )
  }

  const currentVideo = selectedPlaylist.videos.find(v => v._id === currentVideoId) || selectedPlaylist.videos[0]
  
  const sortedVideos = [...selectedPlaylist.videos].sort((a, b) => {
    if (sortBy === 'status') {
      const statusOrder = { 'to-watch': 0, 'watching': 1, 'watched': 2 }
      return statusOrder[a.status] - statusOrder[b.status]
    }
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  })

  const handleStatusUpdate = async (videoId: string, status: 'to-watch' | 'watching' | 'watched') => {
    try {
      const response = await fetch(`/api/playlists/${selectedPlaylist._id}/videos/${videoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        onVideoStatusUpdate(videoId, status)
      }
    } catch (error) {
      console.error('Failed to update video status:', error)
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch(`/api/playlists/${selectedPlaylist._id}/videos/${videoId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onVideoDelete(videoId)
        if (currentVideoId === videoId) {
          setCurrentVideoId('')
        }
      }
    } catch (error) {
      console.error('Failed to delete video:', error)
    }
  }

  const handleNoteUpdate = async (videoId: string) => {
    try {
      const response = await fetch(`/api/playlists/${selectedPlaylist._id}/videos/${videoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: editingNote })
      })

      if (response.ok) {
        onVideoNoteUpdate(videoId, editingNote)
        setEditingNoteId('')
        setEditingNote('')
      }
    } catch (error) {
      console.error('Failed to update video note:', error)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{selectedPlaylist.name}</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{selectedPlaylist.videos.length} videos</span>
            <Select value={sortBy} onValueChange={(value: 'added' | 'status') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="added">Date Added</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          {currentVideo ? (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
                  title={currentVideo.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentVideo.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(currentVideo.status)}`}>
                    {currentVideo.status.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(new Date(currentVideo.addedAt))}</span>
                </div>
                {currentVideo.note && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{currentVideo.note}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Play className="h-12 w-12 mx-auto mb-2" />
                <p>Select a video to start watching</p>
              </div>
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedVideos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                currentVideoId === video._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setCurrentVideoId(video._id || '')}
            >
              <div className="flex items-start gap-3">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-16 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{video.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(video.status)}`}>
                      {video.status.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(new Date(video.addedAt))}</span>
                  </div>
                  {video.note && (
                    <p className="text-xs text-gray-600 mt-1 truncate">{video.note}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Select
                    value={video.status}
                    onValueChange={(status: 'to-watch' | 'watching' | 'watched') => 
                      handleStatusUpdate(video._id || '', status)
                    }
                  >
                    <SelectTrigger className="w-20 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-watch">To Watch</SelectItem>
                      <SelectItem value="watching">Watching</SelectItem>
                      <SelectItem value="watched">Watched</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingNoteId(video._id || '')
                      setEditingNote(video.note || '')
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteVideo(video._id || '')
                    }}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Note Editing Modal */}
      <AnimatePresence>
        {editingNoteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setEditingNoteId('')}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Edit Note</h3>
              <Input
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
                placeholder="Enter note..."
                className="mb-4"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingNoteId('')}>
                  Cancel
                </Button>
                <Button onClick={() => handleNoteUpdate(editingNoteId)}>
                  Save
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 