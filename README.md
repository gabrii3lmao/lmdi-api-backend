# Let Me Do It - Backend (Projeto Integrador)

Este repositório contém o backend do **Let Me Do It**, um sistema automatizado de correção de provas e gestão escolar desenvolvido como parte da disciplina de **Projeto Integrador**.

## Objetivo do Projeto

O objetivo principal deste projeto é otimizar o tempo de docentes através da automação de processos repetitivos, utilizando Inteligência Artificial e processamento assíncrono.

## O Problema que Resolvemos

A correção manual de gabaritos (testes de múltipla escolha) é um dos processos mais exaustivos e suscetíveis a erros na rotina de um professor.

**Os principais desafios atacados são:**

1.  **Desperdício de Tempo:** Professores gastam horas conferindo gabarito por gabarito.
2.  **Erro Humano:** A fadiga leva a erros de contagem ou interpretação das marcações dos alunos.
3.  **Escalabilidade:** Corrigir provas para centenas de alunos de uma só vez é um gargalo operacional.
4.  **Falta de Centralização:** Dificuldade em manter um histórico organizado de notas por turma e exame.

## Tecnologias Utilizadas

Este projeto foi construído com uma stack moderna focada em performance e escalabilidade:

- **Node.js & TypeScript:** Runtime e linguagem para um ambiente tipado e seguro.
- **Express:** Framework web para construção da API REST.
- **MongoDB & Mongoose:** Banco de dados NoSQL para armazenamento flexível de exames, submissões e dados de usuários/turmas.
- **Redis & BullMQ:** Gestão de filas assíncronas para processamento pesado (IA), garantindo que a API nunca trave e mantendo a responsividade.
- **Google Gemini AI (@google/genai):** Utilizado para o processamento de OCR e análise semântica das imagens dos gabaritos.
- **Cloudinary:** Armazenamento e transformação de imagens na nuvem.
- **Zod:** Validação rigorosa de esquemas de dados, garantindo a integridade das informações.
- **Nodemailer:** Sistema de recuperação de senhas e notificações por e-mail.
- **Bcrypt & JWT (jsonwebtoken):** Para autenticação segura de usuários e proteção de rotas.
- **CORS (cors):** Gerenciamento de permissões de requisições cross-origin.
- **Express Rate Limit (express-rate-limit):** Proteção contra ataques de força bruta e uso excessivo da API.
- **Multer (multer, multer-storage-cloudinary):** Middleware para upload de arquivos, integrado com Cloudinary para armazenamento de imagens.
- **Vitest:** Framework de testes unitários.

## Arquitetura e Fluxo de Dados

Este backend implementa conceitos avançados de engenharia para garantir robustez e escalabilidade:

- **Estrutura Modular (Services e Repositories):** O código é organizado em módulos (`Classes`, `Exams`, `Submission`, `Users`), cada um com suas próprias camadas de serviço e repositório. Isso promove a separação de responsabilidades, facilita a manutenção, a testabilidade e a escalabilidade do projeto.
- **Processamento Assíncrono com Filas (Redis & BullMQ):** Ao enviar fotos das provas, o usuário não precisa esperar a resposta da IA. O trabalho é delegado para uma fila (gerenciada pelo Redis e BullMQ), processado em background e o status da correção é atualizado via banco de dados. Isso garante que a API principal permaneça responsiva, mesmo durante operações computacionalmente intensivas.
- **Pipeline de Imagem:** Antes de enviar as imagens para a IA, aplicamos filtros de contraste e escala de cinza via Cloudinary. Essa pré-otimização aumenta significativamente a precisão da leitura do OCR e da análise semântica realizada pela IA.
- **Segurança:** Implementação de autenticação robusta com hashes Bcrypt para senhas, tokens JWT para controle de acesso, `cookie-parser` para gerenciamento de sessões e middlewares de proteção de rotas e limitação de taxa (`express-rate-limit`) contra acessos indevidos.
- **Validação Rigorosa:** Utilização do Zod para validação de esquemas de dados de entrada e saída, garantindo que a aplicação opere com dados válidos e bem estruturados.

## Como Rodar o Projeto

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/gabrii3lmao/lmdi-backend.git
    cd lmdi-backend
    npm install
    ```

2.  **Configure as Variáveis de Ambiente:** Crie um arquivo `.env` na raiz do projeto, seguindo o modelo abaixo e preenchendo com suas próprias chaves e URLs:
```
    PORT=3000
    MONGO_URL=Sua string de conexão do MongoDB.
    REDIS_URL=URL do seu servidor Redis.
    GEMINI_API_KEY=Sua chave da API do Google Gemini.
    CLOUDINARY_URL=Configurações do Cloudinary (URL completa).
    EMAIL_USER=Seu e-mail para envio de notificações (ex: Gmail).
    EMAIL_PASS=Sua senha de aplicativo ou senha do e-mail.
    JWT_SECRET=Uma string secreta longa e aleatória para JWT.
    FRONTEND_URL=URL do frontend da aplicação
    REDIS_URL=Sua URL do Redis
    GOOGLE_CLIENT_ID=Seu Client ID do Google
```

3.  **Iniciar o Servidor em Modo de Desenvolvimento:**

    ```bash
    npm run dev
    ```

4.  **Para Construir e Iniciar em Produção:**
    ```bash
    npm run build
    npm start
    ```

## Executando com Docker / Podman Compose

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) ou [Podman](https://podman.io/) instalado
- Docker Compose (ou Podman Compose) habilitado

### Configuração

1. Crie o arquivo `.env` na raiz do projeto (veja `.env.example` para referência).

2. **Build e inicie todos os serviços:**

   ```bash
   docker compose up -d --build
   ```

   Isso irá construir a aplicação e iniciar três contêineres:
   - `lmdi-app` — API Node.js (porta `3000`)
   - `lmdi-mongo` — MongoDB 7 (porta `27017`)
   - `lmdi-redis` — Redis 7 (porta `6379`)

3. **Acompanhar os logs:**

   ```bash
   docker compose logs -f app
   ```

4. **Parar os serviços:**

   ```bash
   docker compose down
   ```

   Para remover também os volumes (dados do banco e Redis):

   ```bash
   docker compose down -v
   ```

### Variáveis de Ambiente

As variáveis que exigem valores reais (chaves de API, secrets) são lidas do seu arquivo `.env` local. As variáveis de infraestrutura (`MONGO_URL`, `REDIS_URL`) já são configuradas automaticamente pelo Compose para apontar para os serviços internos.

| Variável | Como preencher |
|---|---|
| `JWT_SECRET` | String aleatória segura (ex: `openssl rand -hex 32`) |
| `GEMINI_API_KEY` | Chave da API Google Gemini |
| `CLOUDINARY_*` | Credenciais da sua conta Cloudinary |
| `EMAIL_USER` / `EMAIL_PASS` | E-mail e senha de aplicativo para envio |
| `GOOGLE_CLIENT_ID` | Client ID do Google OAuth |
| `FRONTEND_URL` | URL do frontend (ex: `http://localhost:5173`) |

> **Nota:** O banco de dados e o Redis iniciam com dados voláteis se os volumes forem removidos. Para dados persistentes, mantenha os volumes definidos no `compose.yaml`.

## Executando os Testes

### Com npm (recomendado para desenvolvimento)

```bash
# Executar toda a suíte de testes
npm test

# Executar testes de um módulo específico
npm run test:submissions
npm run test:exams
npm run test:classes
```

### Com Docker (CI/CD ou ambiente isolado)

```bash
# Executar testes no contêiner da aplicação
docker compose run --rm app npm test

# Ou usando o builder stage para testes
docker build --target builder -t lmdi-tests . && docker run --rm lmdi-tests npm test
```

### Cobertura de Testes

Os testes estão organizados por módulo em `src/tests/`:

| Módulo | Arquivos | O que cobre |
|---|---|---|
| `Grade.service` | `Submissions/Grade.service.spec.ts` | Cálculo de nota, acertos, edge cases (NaN, zero) |
| `Submission.Service` | `Submissions/Submission.service.spec.ts` | Processamento de submissões, fila, consultas |
| `Submission.Controller` | `Submissions/Submission.controller.spec.ts` | Validação de entrada, erros de autenticação, respostas |
| `Submission.Repository` | `Submissions/Submission.repository.spec.ts` | Operações CRUD com Mongoose mockado |
| `User.Service` | `Users/User.service.spec.ts` | Registro, login, Google OAuth, refresh token, reset de senha |
| `User.Controller` | `Users/User.controller.spec.ts` | Cookies, validações, delegação ao service |
| `Exam.Service` | `Exams/Exam.service.spec.ts` | CRUD de exames, reavaliação em lote, autorização |
| `Exam.Controller` | `Exams/Exam.controller.spec.ts` | Autenticação, deleção em cascata |
| `Class.Service` | `Classes/Class.service.spec.ts` | CRUD de turmas, verificação de ownership |
| `Class.Controller` | `Classes/Class.controller.spec.ts` | Validação de rotas, chamadas ao service |

## Autor

Desenvolvido por Gabriel Luz como projeto de estudo e aplicação prática para a disciplina de Projeto Integrador.
