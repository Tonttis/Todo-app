import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/todos - Get all todos
export async function GET() {
  console.log('GET /api/todos called')
  try {
    const todos = await db.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('Retrieved', todos.length, 'todos')
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  console.log('POST /api/todos called')

  try {
    const body = await request.json()
    const { title, description } = body

    console.log('Creating new todo:', { title, description })

    if (!title || typeof title !== 'string') {
      console.error('Invalid title:', title)
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      )
    }

    const todo = await db.todo.create({
      data: {
        title,
        description: description || null,
        status: 'pending',
      },
    })

    console.log('Todo created successfully:', todo.id)
    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Error creating todo:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to create todo', details: String(error) },
      { status: 500 }
    )
  }
}
