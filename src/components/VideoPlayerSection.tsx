"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loading } from "@/components/ui/loading";
import { getStatusColor, formatDate } from "@/lib/utils";
import { PlaylistType } from "@/models/Playlist";
import {
  deleteVideoFromPlaylist,
  updateVideoInPlaylist,
  updateVideoStatus,
} from "@/app/actions/video.actions";
import Image from "next/image";

interface VideoPlayerSectionProps {
  selectedPlaylist: PlaylistType | null;
  onVideoStatusUpdate: (
    videoId: string,
    status: "to-watch" | "watching" | "watched"
  ) => void;
  onVideoDelete: (videoId: string) => void;
  onVideoNoteUpdate: (videoId: string, note: string) => void;
}

export function VideoPlayerSection({
  selectedPlaylist,
  onVideoStatusUpdate,
  onVideoDelete,
  onVideoNoteUpdate,
}: VideoPlayerSectionProps) {
  const [currentVideoId, setCurrentVideoId] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string>("");
  const [editingNote, setEditingNote] = useState("");
  const [sortBy, setSortBy] = useState<"added" | "status">("added");

  if (!selectedPlaylist) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl p-12">
          <div className="text-center text-gray-500">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Play className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">
              No Playlist Selected
            </h3>
            <p className="text-lg text-gray-600">
              Select a playlist from above to start watching videos
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentVideo =
    selectedPlaylist.videos.find((v) => v._id === currentVideoId) ||
    selectedPlaylist.videos[0];

  const sortedVideos = [...selectedPlaylist.videos].sort((a, b) => {
    if (sortBy === "status") {
      const statusOrder = { "to-watch": 0, watching: 1, watched: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });

  const handleStatusUpdate = async (
    videoId: string,
    status: "to-watch" | "watching" | "watched"
  ) => {
    try {
      await updateVideoStatus(selectedPlaylist._id || "", videoId, status);
      onVideoStatusUpdate(videoId, status);
    } catch (error) {
      console.error("Failed to update video status:", error);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      await deleteVideoFromPlaylist(selectedPlaylist._id || "", videoId);
      onVideoDelete(videoId);
      if (currentVideoId === videoId) {
        setCurrentVideoId("");
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  const handleNoteUpdate = async (videoId: string) => {
    try {
      await updateVideoInPlaylist(selectedPlaylist._id || "", videoId, {
        note: editingNote,
      });
      onVideoNoteUpdate(videoId, editingNote);
      setEditingNoteId("");
      setEditingNote("");
    } catch (error) {
      console.error("Failed to update video note:", error);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-white/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {selectedPlaylist.name}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                {selectedPlaylist.videos.length} videos in this playlist
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={sortBy}
                onValueChange={(value: "added" | "status") => setSortBy(value)}
              >
                <SelectTrigger className="w-40 h-12 bg-white/80 border-gray-200/50 rounded-xl hover:bg-white transition-colors">
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-8">
          {/* Video Player */}
          <div className="xl:col-span-2">
            {currentVideo ? (
              <div className="space-y-6">
                <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/20">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
                    title={currentVideo.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {currentVideo.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                        currentVideo.status
                      )}`}
                    >
                      {currentVideo.status.replace("-", " ")}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(new Date(currentVideo.addedAt))}
                    </span>
                  </div>
                  {currentVideo.note && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100/50">
                      <p className="text-gray-700 font-medium">
                        {currentVideo.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-medium">
                    Select a video to start watching
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {sortedVideos.map((video, index) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  currentVideoId === video._id
                    ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg"
                    : "border-gray-200/50 hover:border-gray-300 bg-white/50 backdrop-blur-sm"
                }`}
                onClick={() => setCurrentVideoId(video._id || "")}
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    width={80}
                    height={56}
                    className="w-20 h-14 rounded-xl object-cover flex-shrink-0 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate mb-2">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          video.status
                        )}`}
                      >
                        {video.status.replace("-", " ")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(new Date(video.addedAt))}
                      </span>
                    </div>
                    {video.note && (
                      <p className="text-xs text-gray-600 truncate bg-gray-50/50 px-2 py-1 rounded-md">
                        {video.note}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Select
                      value={video.status}
                      onValueChange={(
                        status: "to-watch" | "watching" | "watched"
                      ) => handleStatusUpdate(video._id || "", status)}
                      // disabled={updateVideoMutation.isPending}
                    >
                      <SelectTrigger className="w-20 h-6 text-xs">
                        {false ? (
                          <Loading size="sm" variant="spinner" />
                        ) : (
                          <SelectValue />
                        )}
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
                        e.stopPropagation();
                        setEditingNoteId(video._id || "");
                        setEditingNote(video.note || "");
                      }}
                      // disabled={updateVideoMutation.isPending}
                      className="h-6 w-6 p-0"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(video._id || "");
                      }}
                      // disabled={deleteVideoMutation.isPending}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      {false ? (
                        <Loading size="sm" variant="spinner" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Note Editing Modal */}
      <AnimatePresence>
        {editingNoteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setEditingNoteId("")}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-8 w-full max-w-md mx-4 border border-white/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Edit Note
              </h3>
              <Input
                value={editingNote}
                onChange={(e) => setEditingNote(e.target.value)}
                placeholder="Enter note..."
                className="mb-6 h-12 bg-white/80 border-gray-200/50 rounded-xl"
              />
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setEditingNoteId("")}
                  // disabled={updateVideoMutation.isPending}
                  className="h-12 px-6 rounded-xl border-gray-200/50 hover:bg-gray-50/80"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleNoteUpdate(editingNoteId)}
                  // disabled={updateVideoMutation.isPending}
                  className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl"
                >
                  {false ? <Loading size="sm" variant="spinner" /> : "Save"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
