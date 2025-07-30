'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AddVideoForm } from '@/components/AddVideoForm'
import { VideoPlayerSection } from '@/components/VideoPlayerSection'
import { PlaylistCard } from '@/components/PlaylistCard'
import { LandingSection } from '@/components/LandingSection'
import { FloatingNavbar } from '@/components/FloatingNavbar'
import { PlaylistType } from '@/models/Playlist'

export default function Home() {
  const [playlists, setPlaylists] = useState<PlaylistType[]>([])
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const response = await fetch('/api/playlists')
      if (response.ok) {
        const data = await response.json()
        setPlaylists(data)
        if (data.length > 0 && !selectedPlaylist) {
          setSelectedPlaylist(data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch playlists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaylistCreated = (newPlaylist: PlaylistType) => {
    setPlaylists(prev => [newPlaylist, ...prev])
    setSelectedPlaylist(newPlaylist)
  }

  const handleVideoAdded = () => {
    fetchPlaylists()
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
      setPlaylists(prev => prev.map(playlist =>
        playlist._id === selectedPlaylist._id ? updatedPlaylist : playlist
      ))
    }
  }

  const handleVideoDelete = (videoId: string) => {
    if (selectedPlaylist) {
      const updatedPlaylist = {
        ...selectedPlaylist,
        videos: selectedPlaylist.videos.filter(video => video._id !== videoId)
      }
      setSelectedPlaylist(updatedPlaylist)
      setPlaylists(prev => prev.map(playlist =>
        playlist._id === selectedPlaylist._id ? updatedPlaylist : playlist
      ))
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
      setPlaylists(prev => prev.map(playlist =>
        playlist._id === selectedPlaylist._id ? updatedPlaylist : playlist
      ))
    }
  }

  const handlePlaylistDelete = async (playlistId: string) => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPlaylists(prev => prev.filter(playlist => playlist._id !== playlistId))
        if (selectedPlaylist?._id === playlistId) {
          setSelectedPlaylist(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete playlist:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading DevList...</p>
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
          onVideoAdded={handleVideoAdded}
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
