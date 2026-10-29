import * as z from "zod"

// Usado no formulário (navegador) e na server action (servidor).
export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "O título deve ter pelo menos 3 caracteres.")
    .max(100, "O título deve ter no máximo 100 caracteres."),
  description: z
    .string()
    .trim()
    .max(500, "A descrição deve ter no máximo 500 caracteres."),
})

export type TaskData = z.infer<typeof taskSchema>
