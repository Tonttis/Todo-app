import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/todos/[id]/status - Update todo status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // In Next.js 15+, params is a Promise that needs to be awaited
  const { id } = await params

  console.log('Status update API called with ID:', id)
  console.log('Request URL:', request.url)
  console.log('Request method:', request.method)

  try {
    const body = await request.json()
    const { status } = body

    console.log('Updating todo status:', { id, status })

    if (!status || typeof status !== 'string') {
      console.error('Invalid status:', status)
      return NextResponse.json(
        { error: 'Status is required and must be a string' },
        { status: 400 }
      )
    }

    if (!['pending', 'completed'].includes(status)) {
      console.error('Invalid status value:', status)
      return NextResponse.json(
        { error: 'Status must be either "pending" or "completed"' },
        { status: 400 }
      )
    }

    console.log('Finding todo with id:', id)
    const todo = await db.todo.findUnique({
      where: { id },
    })

    if (!todo) {
      console.error('Todo not found with id:', id)
      return NextResponse.json(
        { error: 'Todo not found', id },
        { status: 404 }
      )
    }

    console.log('Todo found, updating status:', todo.id)
    const updatedTodo = await db.todo.update({
      where: { id },
      data: { status },
    })

    console.log('Status updated successfully:', updatedTodo.id)
    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Error updating todo status:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to update todo status', details: String(error) },
      { status: 500 }
    )
  }
}
