'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Play, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loading } from '@/components/ui/loading'
import { extractYouTubeId } from '@/lib/utils'
import { useCreatePlaylist, useAddVideo } from '@/lib/api'
import { PlaylistType } from '@/models/Playlist'
import { addVideoToPlaylist, createPlaylist } from '@/app/actions/playlist.actions'

interface AddVideoFormProps {
  playlists: PlaylistType[]
  onPlaylistCreated: (playlist: PlaylistType) => void
}

export function AddVideoForm({ playlists, onPlaylistCreated }: AddVideoFormProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoNote, setVideoNote] = useState('')

  // React Query mutations
  const createPlaylistMutation = useCreatePlaylist()
  const addVideoMutation = useAddVideo()

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return

    try {
      // const playlist = await createPlaylistMutation.mutateAsync({ name: newPlaylistName.trim() })
      const playlist = await createPlaylist({ name: newPlaylistName.trim() })
      onPlaylistCreated(playlist)
      setSelectedPlaylistId(playlist._id || '')
      setNewPlaylistName('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create playlist:', error)
    }
  }

  const handleAddVideo = async () => {
    if (!selectedPlaylistId || !videoUrl.trim()) return

    const youtubeId = extractYouTubeId(videoUrl)
    if (!youtubeId) {
      alert('Please enter a valid YouTube URL')
      return
    }

    try {
      // For demo purposes, we'll use a placeholder title
      // In a real app, you'd fetch the actual video title from YouTube API
      const videoTitle = `Video ${Date.now()}`

      addVideoToPlaylist(selectedPlaylistId, { title: videoTitle, youtubeId, note: videoNote.trim() })
      // await addVideoMutation.mutateAsync({
      //   playlistId: selectedPlaylistId,
      //   data: {
      //     title: videoTitle,
      //     youtubeId,
      //     note: videoNote.trim()
      //   }
      // })

      // setVideoUrl('')
      // setVideoNote('')
    } catch (error) {
      console.error('Failed to add video:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-5xl mx-auto"
      id="home"
    >
      {/* Hero Section with Beautiful Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-gray-200/50 shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-glow"></div>
        <div className="absolute bottom-10 left-1/3 w-20 h-20 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-glow delay-2000"></div>
        
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-purple-500/5"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="relative p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4 shadow-lg"
            >
              <Play className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 animate-gradient"
            >
              DevList
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Organize your YouTube videos with ease and track your learning progress
            </motion.p>
          </div>

          {/* Form Container */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl p-6 lg:p-8">
            <div className="space-y-6">
              {/* Playlist Selection/Creation */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Playlist
                  </label>
                  <Select value={selectedPlaylistId} onValueChange={setSelectedPlaylistId}>
                    <SelectTrigger className="h-12 bg-white/80 border-gray-200/50 rounded-xl hover:bg-white transition-colors">
                      <SelectValue placeholder="Choose a playlist..." />
                    </SelectTrigger>
                    <SelectContent>
                      {playlists.length>0 && playlists.map((playlist) => (
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
                    className="flex items-center gap-2 h-12 px-6 rounded-xl border-gray-200/50 hover:bg-gray-50/80 transition-colors"
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
                      className="flex-1 h-12 bg-white/80 border-gray-200/50 rounded-xl hover:bg-white transition-colors"
                    />
                                  <Button
                onClick={handleCreatePlaylist}
                // disabled={createPlaylistMutation.isPending || !newPlaylistName.trim()}
                className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {createPlaylistMutation.isPending ? (
                  <Loading size="sm" variant="spinner" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {createPlaylistMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Video URL Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    YouTube Video URL
                  </label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="h-12 bg-white/80 border-gray-200/50 rounded-xl hover:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Note (Optional)
                  </label>
                  <Input
                    placeholder="Add a personal note about this video..."
                    value={videoNote}
                    onChange={(e) => setVideoNote(e.target.value)}
                    className="h-12 bg-white/80 border-gray-200/50 rounded-xl hover:bg-white transition-colors"
                  />
                </div>
                                  <Button
                    onClick={handleAddVideo}
                    disabled={addVideoMutation.isPending || !selectedPlaylistId || !videoUrl.trim()}
                    className="w-full h-14 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all text-white font-semibold text-lg"
                  >
                    {addVideoMutation.isPending ? (
                      <Loading size="sm" variant="spinner" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                    {addVideoMutation.isPending ? 'Adding...' : 'Add to Playlist'}
                  </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 