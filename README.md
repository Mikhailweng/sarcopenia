# SarcoSystem

Aplicação clínica para cadastro de pacientes, avaliações e relatórios de sarcopenia.

## Estrutura

- `src/` - frontend React + Vite
- `server/` - API Node + Express + MongoDB

## Como rodar

1. Inicie o MongoDB localmente ou configure sua `MONGO_URI`.
2. Copie `server/.env.example` para `server/.env` e ajuste os valores.
3. No backend, instale as dependências e rode a API.
4. No frontend, rode o Vite normalmente.

## API

O frontend usa a URL definida em `VITE_API_BASE_URL` ou, por padrão, `http://localhost:3002`.
