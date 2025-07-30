'use client'

import { motion } from 'framer-motion'
import { Play, Clock, Eye, EyeOff, CheckCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate, getStatusColor } from '@/lib/utils'
import { PlaylistType } from '@/models/Playlist'

interface PlaylistCardProps {
  playlist: PlaylistType
  isSelected: boolean
  onSelect: (playlist: PlaylistType) => void
  onDelete: (playlistId: string) => void
}

export function PlaylistCard({ playlist, isSelected, onSelect, onDelete }: PlaylistCardProps) {
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
      whileHover={{ y: -4 }}
      className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
      }`}
      onClick={() => onSelect(playlist)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{playlist.name}</h3>
          <p className="text-sm text-gray-500">
            Created {formatDate(new Date(playlist.createdAt))}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            if (confirm('Are you sure you want to delete this playlist?')) {
              onDelete(playlist._id || '')
            }
          }}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Play className="h-5 w-5 text-blue-500" />
          <span className="text-lg font-semibold text-gray-900">{playlist.videos.length}</span>
          <span className="text-sm text-gray-500">videos</span>
        </div>

        {playlist.videos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3 text-yellow-500" />
              <span className="text-yellow-700">{statusCounts['to-watch']}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Eye className="h-3 w-3 text-blue-500" />
              <span className="text-blue-700">{statusCounts['watching']}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-green-700">{statusCounts['watched']}</span>
            </div>
          </div>
        )}

        {playlist.videos.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 via-blue-500 to-green-500 rounded-full"
                  style={{ 
                    width: `${(statusCounts['watched'] / playlist.videos.length) * 100}%` 
                  }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {Math.round((statusCounts['watched'] / playlist.videos.length) * 100)}% complete
              </span>
            </div>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      )}
    </motion.div>
  )
} 