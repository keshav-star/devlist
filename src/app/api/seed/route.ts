import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { Playlist } from '@/models/Playlist'

export async function POST() {
  try {
    await dbConnect()

    // Clear existing data
    await Playlist.deleteMany({})

    // Sample playlists with videos
    const samplePlaylists = [
      {
        name: "React Learning",
        videos: [
          {
            title: "React Tutorial for Beginners",
            youtubeId: "dGcsHMXbSOA",
            status: "watched" as const,
            note: "Great introduction to React basics",
            addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          },
          {
            title: "React Hooks Explained",
            youtubeId: "dpw9EHDh2bM",
            status: "watching" as const,
            note: "Need to finish this one",
            addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          },
          {
            title: "Advanced React Patterns",
            youtubeId: "KJP1E-Y-xyo",
            status: "to-watch" as const,
            note: "For advanced concepts",
            addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          }
        ]
      },
      {
        name: "Weekend Entertainment",
        videos: [
          {
            title: "Amazing Nature Documentary",
            youtubeId: "aETt1cFI2wA",
            status: "to-watch" as const,
            note: "Perfect for weekend relaxation",
            addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          },
          {
            title: "Cooking Masterclass",
            youtubeId: "8rSH8-pbHZ0",
            status: "to-watch" as const,
            note: "Learn new recipes",
            addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        name: "Programming Fundamentals",
        videos: [
          {
            title: "JavaScript Basics",
            youtubeId: "W6NZfCO5SIk",
            status: "watched" as const,
            note: "Essential JS concepts",
            addedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
          },
          {
            title: "Data Structures & Algorithms",
            youtubeId: "8hly31xKli0",
            status: "watching" as const,
            note: "Important for interviews",
            addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          },
          {
            title: "Git & GitHub Tutorial",
            youtubeId: "RGOj5yH7evk",
            status: "to-watch" as const,
            note: "Version control basics",
            addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    ]

    // Insert sample data
    const createdPlaylists = await Playlist.insertMany(samplePlaylists)

    return NextResponse.json({
      message: 'Sample data created successfully',
      count: createdPlaylists.length
    })
  } catch (error) {
    console.error('Failed to seed data:', error)
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    )
  }
} 