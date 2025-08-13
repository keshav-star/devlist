import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["youtube", "link"],
    default: "youtube",
    required: true,
  },
  youtubeId: {
    type: String,
  },
  url: {
    type: String,
  },
  status: {
    type: String,
    enum: ["to-watch", "watching", "watched"],
    default: "to-watch",
  },
  note: {
    type: String,
    default: "",
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  videos: [VideoSchema],
});

export const Playlist =
  mongoose.models.Playlist || mongoose.model("Playlist", PlaylistSchema);
export const Video =
  mongoose.models.Video || mongoose.model("Video", VideoSchema);
export const User = mongoose.models.User || mongoose.model("User", UserSchema);

export type VideoType =
  | {
      _id?: string;
      type: "youtube";
      title: string;
      youtubeId: string;
      status: "to-watch" | "watching" | "watched";
      note?: string;
      addedAt: Date;
    }
  | {
      _id?: string;
      type: "link";
      title: string;
      url: string;
      status: "to-watch" | "watching" | "watched";
      note?: string;
      addedAt: Date;
    };

export type PlaylistType = {
  _id?: string;
  name: string;
  createdAt: Date;
  videos: VideoType[];
};

export type UserType = {
  _id?: string;
  name: string;
};
