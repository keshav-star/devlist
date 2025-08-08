type PlaylistInterface = {
  _id: string;
  name: string;
  userId: string;
  videos: VIdeosInterface[];
  createdAt: Date;
  updatedAt: Date;
};

type VIdeosInterface = {
  _id: string;
  title: string;
  youtubeId: string;
  status: string;
  note: string;
};

export type { PlaylistInterface, VIdeosInterface };
