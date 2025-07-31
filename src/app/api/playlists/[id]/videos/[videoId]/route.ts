import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Playlist, VideoType } from "@/models/Playlist";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; videoId: string }> }
) {
  const { id, videoId } = await params;
  try {
    await dbConnect();
    const { status, note } = await request.json();

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    const video = playlist.videos.id(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (status) {
      video.status = status;
    }

    if (note !== undefined) {
      video.note = note;
    }

    await playlist.save();
    return NextResponse.json(playlist);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
   { params }: { params: Promise<{ id: string; videoId: string }> }
) {
   const { id, videoId } = await params;
  try {
    await dbConnect();

    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    playlist.videos = playlist.videos.filter(
      (video: VideoType) => video._id?.toString() !== videoId
    );

    await playlist.save();
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
