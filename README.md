# DevList 🎬

A powerful YouTube playlist manager to organize, track, and manage your video learning journey. Create playlists, add videos, and track your progress with ease.

## ✨ Features

- **🎯 Distraction-Free Viewing**: Clean, organized interface for focused learning
- **📚 Smart Organization**: Categorize videos into themed playlists
- **📊 Progress Tracking**: Mark videos as to-watch, watching, or watched
- **🔒 Privacy First**: No YouTube login required, your data stays private
- **📝 Notes & Tags**: Add personal notes to videos for better organization
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **⚡ Real-time Updates**: Instant feedback and smooth animations

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Database**: MongoDB with Mongoose
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Package Manager**: Bun

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DevList
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/DevList
   ```

4. **Set up MongoDB**
   - **Local**: Install and run MongoDB locally
   - **Cloud**: Use MongoDB Atlas or any cloud MongoDB service
   - **Docker**: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

5. **Seed sample data (optional)**
   ```bash
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Run the development server**
   ```bash
   bun dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Creating Playlists
1. Click "Create New" in the hero section
2. Enter a playlist name
3. Click "Create" to save

### Adding Videos
1. Select a playlist from the dropdown
2. Paste a YouTube URL in the video input
3. Add an optional note
4. Click "Add to Playlist"

### Managing Videos
- **Status Management**: Change video status (To Watch, Watching, Watched)
- **Notes**: Click the edit icon to add/edit notes
- **Delete**: Click the trash icon to remove videos
- **Sorting**: Sort by date added or status

### Playlist Management
- **View All**: Scroll down to see all your playlists
- **Select**: Click any playlist card to load it in the player
- **Delete**: Click the trash icon on playlist cards
- **Progress**: See completion percentage and status breakdown

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── playlists/     # Playlist CRUD operations
│   │   └── seed/          # Sample data seeding
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── AddVideoForm.tsx  # Hero section form
│   ├── VideoPlayerSection.tsx # Video player & list
│   ├── PlaylistCard.tsx  # Playlist display cards
│   └── LandingSection.tsx # Marketing section
├── lib/                  # Utilities
│   ├── db.ts            # Database connection
│   └── utils.ts         # Helper functions
└── models/              # MongoDB schemas
    └── Playlist.ts      # Playlist & Video models
```

## 🔧 API Endpoints

### Playlists
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create new playlist
- `GET /api/playlists/[id]` - Get specific playlist
- `PUT /api/playlists/[id]` - Update playlist
- `DELETE /api/playlists/[id]` - Delete playlist

### Videos
- `POST /api/playlists/[id]/videos` - Add video to playlist
- `PUT /api/playlists/[id]/videos/[videoId]` - Update video
- `DELETE /api/playlists/[id]/videos/[videoId]` - Delete video

### Data
- `POST /api/seed` - Seed sample data

## 🎨 Customization

### Styling
The app uses Tailwind CSS with a custom color scheme. Modify `tailwind.config.ts` and `globals.css` to customize the design.

### Components
All components are modular and reusable. Each component can be customized independently.

### Database Schema
The MongoDB schema is defined in `src/models/Playlist.ts`. You can extend it to add more fields or functionality.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Built by

**Keshav Sandhu** - A passionate developer who loves creating useful tools for learning and productivity.

---

⭐ **Star this repository if you found it helpful!**
