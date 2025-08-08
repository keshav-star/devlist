import { getPlaylists } from "@/app/actions/playlist.actions";
import { LandingSection } from "@/components/LandingSection";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { PlaylistType } from "@/models/Playlist";
import PlaylistSection from "./components/PlaylistSection";

async function LandingPage() {
  const playlists = await getPlaylists();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-glow"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-glow delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <FloatingNavbar />

        <PlaylistSection
          playlists={
            JSON.parse(JSON.stringify(playlists.data)) as PlaylistType[]
          }
        />

        <LandingSection />
      </div>
    </div>
  );
}

export default LandingPage;
