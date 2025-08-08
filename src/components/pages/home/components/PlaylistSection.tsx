"use client";

import { AddVideoForm } from "@/components/AddVideoForm";
import { PlaylistCarousel } from "@/components/PlaylistCarousel";
import { VideoPlayerSection } from "@/components/VideoPlayerSection";
import { PlaylistType } from "@/models/Playlist";
import React, { useState } from "react";

const PlaylistSection = ({ playlists }: { playlists: PlaylistType[] }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    playlists.length > 0 ? playlists[0] : null
  );
  const handlePlaylistCreated = (newPlaylist: PlaylistType) => {
    setSelectedPlaylist(newPlaylist);
  };

  const handleVideoStatusUpdate = (
    videoId: string,
    status: "to-watch" | "watching" | "watched"
  ) => {
    if (!selectedPlaylist) return;

    const updatedPlaylist = {
      ...selectedPlaylist,
      videos: selectedPlaylist.videos.map((video) =>
        video._id === videoId ? { ...video, status } : video
      ),
    };

    setSelectedPlaylist(updatedPlaylist);
  };

  const handleVideoDelete = (videoId: string) => {
    if (!selectedPlaylist) return;

    const updatedPlaylist = {
      ...selectedPlaylist,
      videos: selectedPlaylist.videos.filter((v) => v._id !== videoId),
    };

    setSelectedPlaylist(updatedPlaylist);
  };

  const handleVideoNoteUpdate = (videoId: string, note: string) => {
    if (!selectedPlaylist) return;

    const updatedPlaylist = {
      ...selectedPlaylist,
      videos: selectedPlaylist.videos.map((v) =>
        v._id === videoId ? { ...v, note } : v
      ),
    };

    setSelectedPlaylist(updatedPlaylist);
  };

  const handlePlaylistDelete = (playlistId: string) => {
    if (selectedPlaylist?._id === playlistId) {
      setSelectedPlaylist(null);
    }
  };
  return (
    <div>
      <section className="pt-24 pb-12 px-4">
        <AddVideoForm
          playlists={playlists}
          onPlaylistCreated={handlePlaylistCreated}
        />
      </section>

      <section id="player" className="py-12 px-4">
        <VideoPlayerSection
          selectedPlaylist={selectedPlaylist}
          onVideoStatusUpdate={handleVideoStatusUpdate}
          onVideoDelete={handleVideoDelete}
          onVideoNoteUpdate={handleVideoNoteUpdate}
        />
      </section>

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

            <PlaylistCarousel
              playlists={playlists}
              selectedPlaylist={selectedPlaylist}
              onSelect={setSelectedPlaylist}
              onDelete={handlePlaylistDelete}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default PlaylistSection;
