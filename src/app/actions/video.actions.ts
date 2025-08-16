"use server";

import dbConnect from "@/lib/db";
import { sanitizePlaylist } from "@/lib/helper";
import { Playlist } from "@/models/Playlist";
import { cookies } from "next/headers";

type VideoStatus = "to-watch" | "watching" | "watched";

async function retrivePlaylist(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;
  await dbConnect();
  const playlist = await Playlist.findById(id);

  if (!playlist) {
    return { success: false, message: "Playlist not found" };
  }

  if (playlist.userId !== token) {
    return { success: false, message: "Unauthorized" };
  }
  return playlist;
}

const addVideoToPlaylist = async (
  id: string,
  {
    title,
    youtubeId,
    note,
  }: { title: string; youtubeId: string; note?: string }
) => {
  try {
    const playlist = await retrivePlaylist(id);
    //check if video already exist
    const video = playlist.videos.find((v: any) => {
      console.log(youtubeId, v.youtubeId);
      return v.youtubeId === youtubeId;
    });
    if (video) {
      return { success: false, message: "Video already exist in playlist" };
    }

    const newVideo = {
      title,
      youtubeId,
      note: note || "Youtube Video",
      status: "to-watch" as const,
      addedAt: new Date(),
    };

    playlist.videos.push(newVideo);
    const savedPlaylist = await playlist.save();

    return {
      success: true,
      message: "Video added to playlist successfully",
      data: sanitizePlaylist(savedPlaylist),
    };
  } catch (error) {
    throw error;
  }
};

const deleteVideoFromPlaylist = async (id: string, videoId: string) => {
  try {
    const playlist = await retrivePlaylist(id);

    const initialLength = playlist.videos.length;
    playlist.videos = playlist.videos.filter(
      (video: any) => video._id?.toString() !== videoId
    );

    if (playlist.videos.length === initialLength) {
      return { success: false, message: "Video not found" };
    }

    const savedPlaylist = await playlist.save();

    return {
      success: true,
      message: "Video deleted successfully",
      data: sanitizePlaylist(savedPlaylist),
    };
  } catch (error) {
    throw error;
  }
};

const updateVideoInPlaylist = async (
  id: string,
  videoId: string,
  updates: { title?: string; note?: string }
) => {
  try {
    const playlist = await retrivePlaylist(id);

    const video = playlist.videos.id(videoId);
    if (!video) {
      return { success: false, message: "Video not found" };
    }

    if (typeof updates.title === "string") {
      video.title = updates.title;
    }
    if (typeof updates.note === "string") {
      video.note = updates.note;
    }

    const savedPlaylist = await playlist.save();

    return {
      success: true,
      message: "Video updated successfully",
      data: sanitizePlaylist(savedPlaylist),
    };
  } catch (error) {
    throw error;
  }
};

const updateVideoStatus = async (
  id: string,
  videoId: string,
  status: VideoStatus
) => {
  try {
    const playlist = await retrivePlaylist(id);

    const video = playlist.videos.id(videoId);
    if (!video) {
      return { success: false, message: "Video not found" };
    }

    video.status = status;
    const savedPlaylist = await playlist.save();

    return {
      success: true,
      message: "Video status updated successfully",
      data: sanitizePlaylist(savedPlaylist),
    };
  } catch (error) {
    throw error;
  }
};

export {
  addVideoToPlaylist,
  deleteVideoFromPlaylist,
  updateVideoInPlaylist,
  updateVideoStatus,
};
