'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AddVideoForm } from '@/components/AddVideoForm'
import { VideoPlayerSection } from '@/components/VideoPlayerSection'
import { PlaylistCard } from '@/components/PlaylistCard'
import { LandingSection } from '@/components/LandingSection'
import { FloatingNavbar } from '@/components/FloatingNavbar'
import { Loading } from '@/components/ui/loading'
import { usePlaylists } from '@/lib/api'
import { PlaylistType } from '@/models/Playlist'

export default function Home() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(null)
  
  // React Query hooks
  const { data: playlists = [], isLoading, error } = usePlaylists()

  // Set first playlist as selected when data loads
  if (playlists.length > 0 && !selectedPlaylist) {
    setSelectedPlaylist(playlists[0])
  }

  const handlePlaylistCreated = (newPlaylist: PlaylistType) => {
    setSelectedPlaylist(newPlaylist)
  }

  const handleVideoStatusUpdate = (videoId: string, status: 'to-watch' | 'watching' | 'watched') => {
    if (selectedPlaylist) {
      const updatedPlaylist = {
        ...selectedPlaylist,
        videos: selectedPlaylist.videos.map(video =>
          video._id === videoId ? { ...video, status } : video
        )
      }
      setSelectedPlaylist(updatedPlaylist)
    }
  }

  const handleVideoDelete = (videoId: string) => {
    if (selectedPlaylist) {
      const updatedPlaylist = {
        ...selectedPlaylist,
        videos: selectedPlaylist.videos.filter(video => video._id !== videoId)
      }
      setSelectedPlaylist(updatedPlaylist)
    }
  }

  const handleVideoNoteUpdate = (videoId: string, note: string) => {
    if (selectedPlaylist) {
      const updatedPlaylist = {
        ...selectedPlaylist,
        videos: selectedPlaylist.videos.map(video =>
          video._id === videoId ? { ...video, note } : video
        )
      }
      setSelectedPlaylist(updatedPlaylist)
    }
  }

  const handlePlaylistDelete = (playlistId: string) => {
    if (selectedPlaylist?._id === playlistId) {
      setSelectedPlaylist(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loading size="lg" text="Loading DevList..." variant="dots" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-semibold">Error loading playlists</p>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Floating Navbar */}
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <AddVideoForm
          playlists={playlists}
          onPlaylistCreated={handlePlaylistCreated}
        />
      </section>

      {/* Video Player Section */}
      <section id="player" className="py-12 px-4">
        <VideoPlayerSection
          selectedPlaylist={selectedPlaylist}
          onVideoStatusUpdate={handleVideoStatusUpdate}
          onVideoDelete={handleVideoDelete}
          onVideoNoteUpdate={handleVideoNoteUpdate}
        />
      </section>

      {/* All Playlists Section */}
      {playlists.length > 0 && (
        <section id="playlists" className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                All Playlists
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Manage and organize your video collections with ease
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {playlists.map((playlist, index) => (
                <PlaylistCard
                  key={playlist._id}
                  playlist={playlist}
                  isSelected={selectedPlaylist?._id === playlist._id}
                  onSelect={setSelectedPlaylist}
                  onDelete={handlePlaylistDelete}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Landing Section */}
      <LandingSection />
    </div>
  )
}
