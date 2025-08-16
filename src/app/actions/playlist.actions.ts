"use server";

import dbConnect from "@/lib/db";
import { Playlist, PlaylistType } from "@/models/Playlist";
import { cookies } from "next/headers";
import { addVideoToPlaylist } from "./video.actions";
import { sanitizePlaylist } from "@/lib/helper";

async function retriveToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;
  await dbConnect();
  return token;
}

async function createPlaylist(data: { name: string }) {
  const token = await retriveToken();

  const { name } = data;

  if (!name || name.trim() === "") {
    return { status: false, message: "Playlist name is required" };
  }

  const playlist = new Playlist({ name: name.trim(), userId: token });
  const savedPlaylist = await playlist.save();

  return sanitizePlaylist(savedPlaylist);
}

async function getPlaylists(): Promise<{
  success: boolean;
  message: string;
  data: PlaylistType[];
}> {
  try {
    const token = await retriveToken();

    const playlists = await Playlist.find({ userId: token }).sort({
      createdAt: -1,
    });

    return {
      success: true,
      message: "Playlists fetched successfully",
      data: playlists,
    };
  } catch (err) {
    console.log(err);
    return { success: false, message: "An error occurred", data: [] };
  }
}

const deletePlaylist = async (id: string) => {
  try {
    const token = await retriveToken();

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return { success: false, message: "Playlist not found" };
    }

    if (playlist.userId !== token) {
      return { success: false, message: "Unauthorized" };
    }

    await Playlist.findByIdAndDelete(id);

    return { success: true, message: "Playlist deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export { createPlaylist, getPlaylists, addVideoToPlaylist, deletePlaylist };
