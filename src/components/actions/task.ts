"use server"

import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { taskSchema, type TaskData } from "@/lib/schemas"

type ActionResult = {
  success: boolean
  message: string
}

const notAuthenticated: ActionResult = {
  success: false,
  message: "Você precisa estar logado.",
}

const notFound: ActionResult = {
  success: false,
  message: "Tarefa não encontrada.",
}

const unexpectedError: ActionResult = {
  success: false,
  message: "Algo deu errado, tente novamente mais tarde.",
}

// Toda action começa pegando o usuário logado no servidor (Clerk).
// O id vem do Clerk, nunca do formulário, então não dá para forjá-lo.
export async function AddTask(data: TaskData): Promise<ActionResult> {
  const { userId } = await auth()
  if (!userId) return notAuthenticated

  const parsed = taskSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        userId,
      },
    })
    revalidatePath("/dashboard")
    return { success: true, message: "Tarefa criada com sucesso." }
  } catch (erro) {
    console.log(erro)
    return unexpectedError
  }
}

// Nas operações abaixo o "where" sempre tem { id, userId }:
// se a tarefa for de outro usuário, nada é alterado (count = 0).
export async function UpdateTask(
  id: number,
  data: TaskData
): Promise<ActionResult> {
  const { userId } = await auth()
  if (!userId) return notAuthenticated

  const parsed = taskSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message }
  }

  try {
    const result = await prisma.task.updateMany({
      where: { id, userId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
      },
    })
    if (result.count === 0) return notFound
    revalidatePath("/dashboard")
    return { success: true, message: "Tarefa atualizada com sucesso." }
  } catch (erro) {
    console.log(erro)
    return unexpectedError
  }
}

export async function ToggleTask(
  id: number,
  completed: boolean
): Promise<ActionResult> {
  const { userId } = await auth()
  if (!userId) return notAuthenticated

  try {
    const result = await prisma.task.updateMany({
      where: { id, userId },
      data: { completed },
    })
    if (result.count === 0) return notFound
    revalidatePath("/dashboard")
    return {
      success: true,
      message: completed ? "Tarefa concluída." : "Tarefa reaberta.",
    }
  } catch (erro) {
    console.log(erro)
    return unexpectedError
  }
}

export async function DeleteTask(id: number): Promise<ActionResult> {
  const { userId } = await auth()
  if (!userId) return notAuthenticated

  try {
    const result = await prisma.task.deleteMany({
      where: { id, userId },
    })
    if (result.count === 0) return notFound
    revalidatePath("/dashboard")
    return { success: true, message: "Tarefa excluída com sucesso." }
  } catch (erro) {
    console.log(erro)
    return unexpectedError
  }
}
