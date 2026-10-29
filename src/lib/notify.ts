import { toast } from "@/components/ui/toast"

// Mostra o resultado de uma server action como toast de sucesso ou erro.
export function notify(result: { success: boolean; message: string }) {
  toast.add({
    title: result.success ? "Sucesso" : "Erro",
    description: result.message,
    type: result.success ? "success" : "error",
  })
}
