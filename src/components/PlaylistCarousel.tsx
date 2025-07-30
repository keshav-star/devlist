'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Clock, Eye, CheckCircle, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loading } from '@/components/ui/loading'
import { formatDate, getStatusColor } from '@/lib/utils'
import { useDeletePlaylist } from '@/lib/api'
import { PlaylistType } from '@/models/Playlist'
import { UseMutationResult } from '@tanstack/react-query'

interface PlaylistCarouselProps {
  playlists: PlaylistType[]
  selectedPlaylist: PlaylistType | null
  onSelect: (playlist: PlaylistType) => void
  onDelete: (playlistId: string) => void
}

export function PlaylistCarousel({ 
  playlists, 
  selectedPlaylist, 
  onSelect, 
  onDelete 
}: PlaylistCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const deletePlaylistMutation = useDeletePlaylist()

  // Filter playlists based on search query
  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return playlists
    
    return playlists.filter(playlist =>
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [playlists, searchQuery])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || filteredPlaylists.length <= 3) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredPlaylists.length - 2))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, filteredPlaylists.length])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Touch/Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const diff = startX - currentX
    const threshold = 50 // minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
    
    setIsDragging(false)
  }

  // Reset carousel index when search changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [searchQuery])

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchQuery('')
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  const getStatusCounts = (playlist: PlaylistType) => {
    const counts = { 'to-watch': 0, 'watching': 0, 'watched': 0 }
    playlist.videos.forEach(video => {
      counts[video.status]++
    })
    return counts
  }

  const handleDelete = async (playlist: PlaylistType) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      try {
        await deletePlaylistMutation.mutateAsync(playlist._id || '')
        onDelete(playlist._id || '')
      } catch (error) {
        console.error('Failed to delete playlist:', error)
      }
    }
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, filteredPlaylists.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, filteredPlaylists.length - 2)) % Math.max(1, filteredPlaylists.length - 2))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Play className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Playlists Yet</h3>
        <p className="text-gray-500">Create your first playlist to get started</p>
      </div>
    )
  }

  // Show no results message when search has no matches
  if (searchQuery.trim() && filteredPlaylists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Playlists Found</h3>
        <p className="text-gray-500 mb-4">No playlists match &quot;{searchQuery}&quot;</p>
        <Button
          onClick={clearSearch}
          variant="outline"
          className="bg-white/70 backdrop-blur-sm border-gray-200/50 hover:bg-white"
        >
          Clear Search
        </Button>
      </div>
    )
  }

  // For 3 or fewer playlists, show them all without carousel
  if (filteredPlaylists.length <= 3) {
    return (
      <div>
        {/* Search Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSearch}
              className="p-2 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white transition-all"
            >
              <Search className="h-4 w-4" />
            </Button>
            {isSearchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Input
                  ref={searchInputRef}
                  placeholder="Search playlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-10 bg-white/80 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </div>
          {searchQuery && (
            <span className="text-sm text-gray-500">
              {filteredPlaylists.length} of {playlists.length} playlists
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
              isSelected={selectedPlaylist?._id === playlist._id}
              onSelect={onSelect}
              onDelete={handleDelete}
              deleteMutation={deletePlaylistMutation}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Search Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSearch}
            className="p-2 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white transition-all"
          >
            <Search className="h-4 w-4" />
          </Button>
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Input
                  ref={searchInputRef}
                  placeholder="Search playlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 h-10 bg-white/80 border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {searchQuery && (
          <span className="text-sm text-gray-500">
            {filteredPlaylists.length} of {playlists.length} playlists
          </span>
        )}
      </div>

      {/* Carousel Container */}
      <div 
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="relative overflow-hidden rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            ref={carouselRef}
            className={`flex transition-transform duration-500 ease-out ${isDragging ? 'transition-none' : ''}`}
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`
            }}
          >
            {filteredPlaylists.map((playlist, index) => (
              <div 
                key={playlist._id}
                className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
              >
                <PlaylistCard
                  playlist={playlist}
                  isSelected={selectedPlaylist?._id === playlist._id}
                  onSelect={onSelect}
                  onDelete={handleDelete}
                  deleteMutation={deletePlaylistMutation}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <AnimatePresence>
          {filteredPlaylists.length > 3 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      {filteredPlaylists.length > 3 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.max(1, filteredPlaylists.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}

      {/* Playlist Counter */}
      <div className="text-center mt-4">
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {Math.max(1, filteredPlaylists.length - 2)} playlists
        </span>
        {filteredPlaylists.length > 3 && (
          <div className="mt-2 text-xs text-gray-400">
            Swipe or use arrows to navigate
          </div>
        )}
      </div>
    </div>
  )
}

// Individual Playlist Card Component
function PlaylistCard({ 
  playlist, 
  isSelected, 
  onSelect, 
  onDelete, 
  deleteMutation 
}: {
  playlist: PlaylistType
  isSelected: boolean
  onSelect: (playlist: PlaylistType) => void
  onDelete: (playlist: PlaylistType) => void
  deleteMutation: UseMutationResult<void, Error, string, unknown>
}) {
  const getStatusCounts = () => {
    const counts = { 'to-watch': 0, 'watching': 0, 'watched': 0 }
    playlist.videos.forEach(video => {
      counts[video.status]++
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer h-full ${
        isSelected 
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl' 
          : 'border-gray-200/50 hover:border-gray-300 bg-white/70 backdrop-blur-sm hover:shadow-lg'
      }`}
      onClick={() => onSelect(playlist)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            {playlist.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
            Created {formatDate(new Date(playlist.createdAt))}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(playlist)
          }}
          disabled={deleteMutation.isPending}
          className="text-red-500 hover:text-red-700 hover:bg-red-50/50 p-2 rounded-xl"
        >
          {deleteMutation.isPending ? (
            <Loading size="sm" variant="spinner" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Play className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">{playlist.videos.length}</span>
            <span className="text-sm text-gray-600 ml-1">videos</span>
          </div>
        </div>

        {playlist.videos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-1 text-xs bg-yellow-50/50 p-2 rounded-lg">
              <Clock className="h-3 w-3 text-yellow-600" />
              <span className="font-semibold text-yellow-700">{statusCounts['to-watch']}</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-blue-50/50 p-2 rounded-lg">
              <Eye className="h-3 w-3 text-blue-600" />
              <span className="font-semibold text-blue-700">{statusCounts['watching']}</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-green-50/50 p-2 rounded-lg">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="font-semibold text-green-700">{statusCounts['watched']}</span>
            </div>
          </div>
        )}

        {playlist.videos.length > 0 && (
          <div className="pt-2 border-t border-gray-200/50">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 via-blue-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(statusCounts['watched'] / playlist.videos.length) * 100}%` 
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {Math.round((statusCounts['watched'] / playlist.videos.length) * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-3 right-3">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
        </div>
      )}
    </motion.div>
  )
} 