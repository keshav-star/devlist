"use server";

import dbConnect from "@/lib/db";
import { Playlist } from "@/models/Playlist";

type VideoStatus = "to-watch" | "watching" | "watched";

const addVideoToPlaylist = async (
  id: string,
  {
    title,
    youtubeId,
    note,
  }: { title: string; youtubeId: string; note?: string }
) => {
  try {
    await dbConnect();
    const playlist = await Playlist.findOne({ _id: id });

    if (!playlist) {
      throw new Error("Playlist not found");
    }

    const newVideo = {
      title,
      youtubeId,
      note: note || "",
      status: "to-watch" as const,
      addedAt: new Date(),
    };

    playlist.videos.push(newVideo);
    await playlist.save();

    return {
      success: true,
      message: "Video added to playlist successfully",
      // keeping return shape consistent with existing implementation
      data: JSON.parse(JSON.stringify(playlist)),
    };
  } catch (error) {
    throw error;
  }
};

const deleteVideoFromPlaylist = async (id: string, videoId: string) => {
  try {
    await dbConnect();
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return { success: false, message: "Playlist not found" };
    }

    const initialLength = playlist.videos.length;
    playlist.videos = playlist.videos.filter(
      (video: any) => video._id?.toString() !== videoId
    );

    if (playlist.videos.length === initialLength) {
      return { success: false, message: "Video not found" };
    }

    await playlist.save();

    return {
      success: true,
      message: "Video deleted successfully",
      data: JSON.parse(JSON.stringify(playlist)),
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
    await dbConnect();
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return { success: false, message: "Playlist not found" };
    }

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

    await playlist.save();

    return {
      success: true,
      message: "Video updated successfully",
      data: JSON.parse(JSON.stringify(playlist)),
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
    await dbConnect();
    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return { success: false, message: "Playlist not found" };
    }

    const video = playlist.videos.id(videoId);
    if (!video) {
      return { success: false, message: "Video not found" };
    }

    video.status = status;
    await playlist.save();

    return {
      success: true,
      message: "Video status updated successfully",
      data: JSON.parse(JSON.stringify(playlist)),
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

