"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { notify } from "@/lib/notify"
import { DeleteTask, ToggleTask } from "./actions/task"
import { UpsertTaskForm } from "./forms/upsert-task-form"

type TaskItemProps = {
  task: {
    id: number
    title: string
    description: string | null
    completed: boolean
    createdAt: Date
  }
}

// Fuso fixo para o servidor e o navegador mostrarem exatamente o mesmo texto.
const dateFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
})

export function TaskItem({ task }: TaskItemProps) {
  const [editing, setEditing] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  function handleToggle() {
    startTransition(async () => {
      notify(await ToggleTask(task.id, !task.completed))
    })
  }

  function handleDelete() {
    startTransition(async () => {
      notify(await DeleteTask(task.id))
    })
  }

  if (editing) {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle>Editar tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <UpsertTaskForm task={task} onDone={() => setEditing(false)} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle
          className={task.completed ? "text-muted-foreground line-through" : ""}
        >
          {task.title}
        </CardTitle>
        <CardDescription>
          {task.completed ? "Concluída" : "Pendente"} · criada em{" "}
          {dateFormat.format(task.createdAt)}
        </CardDescription>
      </CardHeader>
      {task.description && (
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{task.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleToggle}
          disabled={isPending}
        >
          {task.completed ? "Reabrir" : "Concluir"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditing(true)}
          disabled={isPending}
        >
          Editar
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          Excluir
        </Button>
      </CardFooter>
    </Card>
  )
}
