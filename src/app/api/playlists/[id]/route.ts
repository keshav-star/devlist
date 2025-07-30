import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { Playlist } from '@/models/Playlist'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    const playlist = await Playlist.findById(context.params.id)

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    return NextResponse.json(playlist)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch playlist' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { name } = await request.json()

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Playlist name is required' }, { status: 400 })
    }

    const playlist = await Playlist.findByIdAndUpdate(
      context.params.id,
      { name: name.trim() },
      { new: true }
    )

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    return NextResponse.json(playlist)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update playlist' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await dbConnect()
    const playlist = await Playlist.findByIdAndDelete(context.params.id)

    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Playlist deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete playlist' }, { status: 500 })
  }
}
