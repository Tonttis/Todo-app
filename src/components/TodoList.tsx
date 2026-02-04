'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Edit2 } from 'lucide-react'

export interface Todo {
  id: string
  title: string
  description: string | null
  status: string
  createdAt: string
  updatedAt: string
}

interface TodoListProps {
  todos: Todo[]
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, title: string, description: string) => Promise<void>
  onToggleStatus: (id: string, status: string) => Promise<void>
  isLoading?: boolean
}

export function TodoList({ todos, onDelete, onUpdate, onToggleStatus, isLoading }: TodoListProps) {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
  }

  const handleUpdate = async () => {
    if (!editingTodo || !editTitle.trim()) return
    await onUpdate(editingTodo.id, editTitle, editDescription)
    setEditingTodo(null)
  }

  const handleCancelEdit = () => {
    setEditingTodo(null)
    setEditTitle('')
    setEditDescription('')
  }

  const pendingTodos = todos.filter((todo) => todo.status === 'pending')
  const completedTodos = todos.filter((todo) => todo.status === 'completed')

  return (
    <div className="space-y-6">
      {pendingTodos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>In Progress ({pendingTodos.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDelete}
                onEdit={handleEdit}
                onToggleStatus={onToggleStatus}
                isLoading={isLoading}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {completedTodos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed ({completedTodos.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={onDelete}
                onEdit={handleEdit}
                onToggleStatus={onToggleStatus}
                isLoading={isLoading}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {todos.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No tasks yet. Add your first task above!</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!editingTodo} onOpenChange={handleCancelEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <Input
                id="edit-title"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Enter task title..."
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter task description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!editTitle.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface TodoItemProps {
  todo: Todo
  onDelete: (id: string) => Promise<void>
  onEdit: (todo: Todo) => void
  onToggleStatus: (id: string, status: string) => Promise<void>
  isLoading?: boolean
}

function TodoItem({ todo, onDelete, onEdit, onToggleStatus, isLoading }: TodoItemProps) {
  const isCompleted = todo.status === 'completed'

  return (
    <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggleStatus(todo.id, isCompleted ? 'pending' : 'completed')}
        disabled={isLoading}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className={`text-sm mt-1 ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
            {todo.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={isCompleted ? 'default' : 'secondary'}>
            {isCompleted ? 'Completed' : 'In Progress'}
          </Badge>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(todo)}
          disabled={isLoading}
          className="h-8 w-8"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          disabled={isLoading}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
