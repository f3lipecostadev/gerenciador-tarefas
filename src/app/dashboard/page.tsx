import { SignOutButton, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { UpsertTaskForm } from "@/components/forms/upsert-task-form"
import { TaskItem } from "@/components/task-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  // Só busca as tarefas do usuário logado, da mais nova para a mais antiga.
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold">Minhas tarefas</h1>
        <div className="flex items-center gap-3">
          <UserButton />
          <SignOutButton>
            <Button variant="outline">Sair</Button>
          </SignOutButton>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Nova tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <UpsertTaskForm />
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Você ainda não tem tarefas. Adicione a primeira acima.
          </p>
        ) : (
          tasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </section>
    </main>
  )
}
