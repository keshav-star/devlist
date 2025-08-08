"use server";

import dbConnect from "@/lib/db";
import { Playlist, PlaylistType } from "@/models/Playlist";
import { cookies } from "next/headers";
import { addVideoToPlaylist } from "./video.actions";

async function createPlaylist(data: { name: string }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;

  if (!token) {
    throw new Error("You must be logged in");
  }

  await dbConnect();
  const { name } = data;

  if (!name || name.trim() === "") {
    return { status: false, message: "Playlist name is required" };
  }

  const playlist = new Playlist({ name: name.trim(), userId: token });
  await playlist.save();

  return playlist.toObject();
}

async function getPlaylists(): Promise<{
  success: boolean;
  message: string;
  data: PlaylistType[];
}> {
  try {
    await dbConnect();

    const playlists = await Playlist.find({}).sort({ createdAt: -1 }).lean();
    console.log(playlists);
    return {
      success: true,
      message: "Playlists fetched successfully",
      //ts-ignore
      data: playlists as unknown as PlaylistType[],
    };
  } catch (err) {
    console.log(err);
    return { success: false, message: "An error occurred", data: [] };
  }
}

// moved to video.actions.ts

const deletePlaylist = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || null;

    if (!token) {
      throw new Error("You must be logged in");
    }

    await dbConnect();

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
