import { SignInButton } from "@clerk/nextjs"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Entre para gerenciar as suas tarefas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button>Entrar</Button>
          </SignInButton>
          <p className="text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link href="/register" className="underline">
              Cadastre-se
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
