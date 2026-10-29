import { SignUpButton } from "@clerk/nextjs"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            Crie sua conta para começar a organizar suas tarefas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpButton forceRedirectUrl="/dashboard">
            <Button>Criar conta</Button>
          </SignUpButton>
          <p className="text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="underline">
              Faça login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
