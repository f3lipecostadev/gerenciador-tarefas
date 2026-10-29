 <div align="center">

# Gerenciador de Tarefas

**Aplicação web para organizar tarefas pessoais, com autenticação de usuários, persistência em PostgreSQL e controle de acesso por usuário.**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-000000?style=flat-square&logo=shadcnui&logoColor=white)

</div>

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Modelo de dados](#modelo-de-dados)
- [Segurança e autorização](#segurança-e-autorização)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Scripts disponíveis](#scripts-disponíveis)
- [Testes e validação](#testes-e-validação)
- [Autor](#autor)

## Sobre o projeto

O **Gerenciador de Tarefas** é uma aplicação web desenvolvida para permitir que usuários organizem suas atividades em um ambiente individual e autenticado.

Cada usuário pode criar uma conta, entrar na aplicação e gerenciar suas próprias tarefas, incluindo título, descrição opcional e estado de conclusão. As tarefas são armazenadas em um banco PostgreSQL, com acesso realizado por meio do Prisma ORM.

A aplicação utiliza o Next.js com App Router, combinando Server Components e Server Actions para separar a interface das operações executadas no servidor. A autenticação é feita pelo Clerk, enquanto os componentes visuais utilizam shadcn/ui.

O projeto foi desenvolvido como atividade acadêmica, com foco na integração entre autenticação, interface, validação de dados, persistência e controle de permissões.

## Funcionalidades

- Cadastro de usuários, login e logout com Clerk.
- Criação de tarefas com título obrigatório e descrição opcional.
- Listagem das tarefas do usuário autenticado, ordenadas da mais recente para a mais antiga.
- Marcação de tarefas como concluídas e possibilidade de reabri-las.
- Edição e exclusão de tarefas.
- Validação de formulários com Zod e React Hook Form.
- Mensagens de feedback para operações realizadas com sucesso ou com erro.
- Persistência das tarefas em PostgreSQL por meio do Prisma ORM.
- Associação de cada tarefa ao identificador do usuário autenticado.
- Verificação de permissões no servidor para impedir alterações e exclusões de tarefas pertencentes a outros usuários.
- Interface responsiva com componentes shadcn/ui.
- Banco de dados local executado em container Docker.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Framework web | [Next.js](https://nextjs.org/) com App Router |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| Interface | [React](https://react.dev/) |
| Componentes visuais | [shadcn/ui](https://ui.shadcn.com/) |
| Autenticação | [Clerk](https://clerk.com/) |
| ORM | [Prisma](https://www.prisma.io/) |
| Banco de dados | [PostgreSQL](https://www.postgresql.org/) |
| Formulários | [React Hook Form](https://react-hook-form.com/) |
| Validação | [Zod](https://zod.dev/) |
| Ambiente do banco | [Docker Compose](https://docs.docker.com/compose/) |
| Qualidade de código | ESLint e TypeScript |

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) compatível com a versão do Next.js e das dependências instaladas.
- npm.
- [Git](https://git-scm.com/).
- [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- Uma aplicação de desenvolvimento configurada no Clerk.

### Passo a passo

Clone o repositório e acesse a pasta do projeto:

```bash
git clone https://github.com/f3lipecostadev/gerenciador-tarefas.git
cd gerenciador-tarefas
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente conforme a seção abaixo. Utilize as chaves da sua própria aplicação Clerk e não publique credenciais.

Inicie o PostgreSQL:

```bash
docker compose up -d
```

Aplique as migrações e gere o Prisma Client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Se a migração inicial já existir e estiver aplicada, não é necessário criá-la novamente. Nesse caso, verifique o estado do banco com `npx prisma migrate status`.

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

[http://localhost:3000](http://localhost:3000)

### Banco de dados com Docker

O `docker-compose.yml` configura o PostgreSQL 17 para desenvolvimento local, utilizando a porta `5433` do computador e a porta `5432` do container.

Para verificar se o container está em execução:

```bash
docker ps
```

Para interromper o container:

```bash
docker compose stop
```

Para iniciá-lo novamente:

```bash
docker compose up -d
```

O volume persistente configurado no Docker Compose permite manter os dados entre reinicializações do container. Evite remover o volume caso queira preservar as tarefas cadastradas.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure as variáveis necessárias:

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | URL de conexão com o PostgreSQL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Chave pública da aplicação Clerk |
| `CLERK_SECRET_KEY` | Chave secreta utilizada pelo servidor para integração com o Clerk |

Exemplo de configuração local:

```dotenv
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5433/gerenciador_tarefas"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="SUA_CHAVE_PUBLICA"
CLERK_SECRET_KEY="SUA_CHAVE_SECRETA"
```

**Importante:** o exemplo pressupõe que o usuário, a senha e o nome do banco correspondam ao `docker-compose.yml` e à configuração do Prisma do projeto. Confira esses arquivos antes de executar a aplicação e ajuste os valores conforme necessário.

Não compartilhe o arquivo `.env` nem envie chaves secretas para o GitHub. As variáveis públicas e privadas devem ser configuradas separadamente nos ambientes de desenvolvimento e produção.

## Modelo de dados

A entidade principal é `Task`, responsável por armazenar as tarefas dos usuários.

```mermaid
erDiagram
    TASK {
        int id PK
        string title
        string description
        boolean completed
        string userId
        datetime createdAt
    }
```

| Campo | Descrição |
| --- | --- |
| `id` | Identificador da tarefa |
| `title` | Título da tarefa |
| `description` | Descrição opcional |
| `completed` | Indica se a tarefa foi concluída |
| `userId` | Identificador do usuário autenticado no Clerk |
| `createdAt` | Data e hora de criação |

O modelo é definido em `prisma/schema.prisma`. O identificador do usuário é obtido a partir da sessão autenticada no Clerk, permitindo associar cada tarefa ao seu proprietário.

## Segurança e autorização

A aplicação adota medidas para separar os dados de cada usuário:

- **Autenticação:** o Clerk gerencia cadastro, login e sessão.
- **Proteção de rotas:** o middleware configurado em `src/proxy.ts` protege o acesso ao dashboard.
- **Identificação no servidor:** as Server Actions consultam a sessão autenticada para obter o identificador do usuário.
- **Isolamento dos dados:** a listagem filtra as tarefas pelo usuário autenticado.
- **Autorização nas operações:** as ações de edição, conclusão e exclusão verificam o identificador da tarefa junto ao identificador do proprietário.
- **Validação de entrada:** os dados são validados antes de serem persistidos.

Essas verificações são realizadas no servidor, e não dependem apenas do comportamento da interface. Assim, alterar dados enviados pelo navegador não deve permitir que um usuário opere sobre tarefas de outra conta.

## Estrutura de pastas

```text
gerenciador-tarefas/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── actions/
│   │   │   └── task.ts
│   │   ├── forms/
│   │   │   └── upsert-task-form.tsx
│   │   ├── ui/
│   │   └── task-item.tsx
│   ├── generated/
│   │   └── prisma/
│   ├── lib/
│   │   ├── notify.ts
│   │   ├── prisma.ts
│   │   ├── schemas.ts
│   │   └── utils.ts
│   └── proxy.ts
├── docker-compose.yml
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

A estrutura organiza as responsabilidades da aplicação:

- `src/app/`: páginas e rotas da aplicação.
- `src/components/actions/`: operações de criação, edição, conclusão e exclusão.
- `src/components/forms/`: formulários de criação e edição.
- `src/components/ui/`: componentes de interface.
- `src/lib/`: configuração do Prisma, validação e utilitários.
- `src/generated/prisma/`: código gerado pelo Prisma Client.
- `prisma/`: modelo de dados e migrações do banco.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão de produção. |
| `npm run lint` | Executa as verificações de lint configuradas no projeto. |
| `npm run typecheck` | Verifica os tipos TypeScript, se configurado no `package.json`. |
| `npx prisma validate` | Valida o schema do Prisma. |
| `npx prisma generate` | Gera o Prisma Client. |
| `npx prisma migrate dev` | Cria e aplica migrações em desenvolvimento. |
| `npx prisma migrate status` | Consulta o estado das migrações. |

Os comandos npm dependem dos scripts definidos em `package.json`. Consulte esse arquivo caso algum deles não esteja configurado.

## Testes e validação

Antes da apresentação, recomenda-se verificar:

- Cadastro, login e logout com o Clerk.
- Criação, edição, conclusão, reabertura e exclusão de tarefas.
- Persistência dos dados após atualizar a página e reiniciar o servidor.
- Isolamento das tarefas entre duas contas diferentes.
- Validação dos campos obrigatórios e dos limites de caracteres.
- Funcionamento da interface em telas de celular e desktop.
- Validade do schema, estado das migrações, lint, TypeScript e build de produção.

Os testes de isolamento devem confirmar que uma conta não consegue visualizar ou modificar as tarefas de outra, inclusive por meio de operações executadas diretamente no servidor.

## Autor

**Felipe Kauã de Sousa Costa** — Desenvolvedor de Software

[![GitHub](https://img.shields.io/badge/GitHub-f3lipecostadev-181717?style=flat-square&logo=github)](https://github.com/f3lipecostadev)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-f3lipecosta-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/f3lipecosta/)
