"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { notify } from "@/lib/notify"
import { taskSchema, type TaskData } from "@/lib/schemas"
import { AddTask, UpdateTask } from "../actions/task"

type UpsertTaskFormProps = {
  // Sem "task" o formulário cria uma tarefa; com "task" ele edita.
  task?: { id: number; title: string; description: string | null }
  onDone?: () => void
}

export function UpsertTaskForm({ task, onDone }: UpsertTaskFormProps) {
  // useId evita ids repetidos quando há vários formulários na mesma página.
  const formId = React.useId()

  const form = useForm<TaskData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
    },
  })

  async function onSubmit(data: TaskData) {
    const result = task ? await UpdateTask(task.id, data) : await AddTask(data)

    notify(result)

    if (result.success) {
      form.reset()
      onDone?.()
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${formId}-title`}>Título:</FieldLabel>
              <Input
                {...field}
                id={`${formId}-title`}
                aria-invalid={fieldState.invalid}
                placeholder="Ex.: Estudar Prisma"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={`${formId}-description`}>
                Descrição (opcional):
              </FieldLabel>
              <Textarea
                {...field}
                id={`${formId}-description`}
                aria-invalid={fieldState.invalid}
                placeholder="Detalhes da tarefa"
                rows={3}
              />
              <FieldDescription>Até 500 caracteres.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Salvando..."
              : task
                ? "Salvar"
                : "Adicionar tarefa"}
          </Button>
          {task && (
            <Button type="button" variant="outline" onClick={onDone}>
              Cancelar
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  )
}
