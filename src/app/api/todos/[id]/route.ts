import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/todos/[id] - Update a todo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // In Next.js 15+, params is a Promise that needs to be awaited
  const { id } = await params

  console.log('Update API called with ID:', id)
  console.log('Request URL:', request.url)
  console.log('Request method:', request.method)

  try {
    const body = await request.json()
    const { title, description } = body

    console.log('Updating todo:', { id, title, description })

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

    const updatedTodo = await db.todo.update({
      where: { id },
      data: {
        title: title || todo.title,
        description: description !== undefined ? description : todo.description,
      },
    })

    console.log('Todo updated successfully:', updatedTodo.id)
    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Error updating todo:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to update todo', details: String(error) },
      { status: 500 }
    )
  }
}

// DELETE /api/todos/[id] - Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // In Next.js 15+, params is a Promise that needs to be awaited
  const { id } = await params

  console.log('Delete API called with ID:', id)
  console.log('Request URL:', request.url)
  console.log('Request method:', request.method)

  try {
    console.log('Deleting todo:', id)

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

    await db.todo.delete({
      where: { id },
    })

    console.log('Todo deleted successfully:', id)
    return NextResponse.json({ message: 'Todo deleted successfully', id })
  } catch (error) {
    console.error('Error deleting todo:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to delete todo', details: String(error) },
      { status: 500 }
    )
  }
}
