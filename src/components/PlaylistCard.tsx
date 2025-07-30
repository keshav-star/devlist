'use client'

import { motion } from 'framer-motion'
import { Play, Clock, Eye, EyeOff, CheckCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loading } from '@/components/ui/loading'
import { formatDate, getStatusColor } from '@/lib/utils'
import { useDeletePlaylist } from '@/lib/api'
import { PlaylistType } from '@/models/Playlist'

interface PlaylistCardProps {
  playlist: PlaylistType
  isSelected: boolean
  onSelect: (playlist: PlaylistType) => void
  onDelete: (playlistId: string) => void
}

export function PlaylistCard({ playlist, isSelected, onSelect, onDelete }: PlaylistCardProps) {
  const deletePlaylistMutation = useDeletePlaylist()
  
  const getStatusCounts = () => {
    const counts = { 'to-watch': 0, 'watching': 0, 'watched': 0 }
    playlist.videos.forEach(video => {
      counts[video.status]++
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      try {
        await deletePlaylistMutation.mutateAsync(playlist._id || '')
        onDelete(playlist._id || '')
      } catch (error) {
        console.error('Failed to delete playlist:', error)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl' 
          : 'border-gray-200/50 hover:border-gray-300 bg-white/70 backdrop-blur-sm hover:shadow-lg'
      }`}
      onClick={() => onSelect(playlist)}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
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
            handleDelete()
          }}
          disabled={deletePlaylistMutation.isPending}
          className="text-red-500 hover:text-red-700 hover:bg-red-50/50 p-2 rounded-xl"
        >
          {deletePlaylistMutation.isPending ? (
            <Loading size="sm" variant="spinner" />
          ) : (
            <Trash2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Play className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold text-gray-900">{playlist.videos.length}</span>
            <span className="text-sm text-gray-600 ml-1">videos</span>
          </div>
        </div>

        {playlist.videos.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-sm bg-yellow-50/50 p-2 rounded-lg">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="font-semibold text-yellow-700">{statusCounts['to-watch']}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-blue-50/50 p-2 rounded-lg">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-700">{statusCounts['watching']}</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-green-50/50 p-2 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-700">{statusCounts['watched']}</span>
            </div>
          </div>
        )}

        {playlist.videos.length > 0 && (
          <div className="pt-4 border-t border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 via-blue-500 to-green-500 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(statusCounts['watched'] / playlist.videos.length) * 100}%` 
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {Math.round((statusCounts['watched'] / playlist.videos.length) * 100)}% complete
              </span>
            </div>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
        </div>
      )}
    </motion.div>
  )
} 