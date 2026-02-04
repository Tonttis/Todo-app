'use client'

import { useEffect, useState } from 'react'
import { TodoForm } from '@/components/TodoForm'
import { TodoList, Todo } from '@/components/TodoList'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, Loader2 } from 'lucide-react'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAddTodo = async (title: string, description: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) throw new Error('Failed to add task')

      await fetchTodos()
      toast({
        title: 'Success',
        description: 'Task added successfully!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add task. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete task')

      await fetchTodos()
      toast({
        title: 'Success',
        description: 'Task deleted successfully!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateTodo = async (id: string, title: string, description: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) throw new Error('Failed to update task')

      await fetchTodos()
      toast({
        title: 'Success',
        description: 'Task updated successfully!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleToggleStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/todos/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error('Failed to update task status')

      await fetchTodos()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <PlusCircle className="w-8 h-8 text-primary" />
                Todo Application
              </CardTitle>
              <p className="text-muted-foreground">
                Organize your tasks and stay productive
              </p>
            </CardHeader>
          </Card>
        </header>

        <main className="space-y-6">
          <TodoForm onSubmit={handleAddTodo} isLoading={isSubmitting} />

          {isLoading ? (
            <Card>
              <CardContent className="py-12 flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading tasks...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <TodoList
              todos={todos}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </main>
      </div>
    </div>
  )
}
