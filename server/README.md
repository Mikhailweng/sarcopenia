# SarcoSystem API

Backend oficial do projeto, feito com Node, Express e MongoDB via Mongoose.

## Estrutura

- `src/app.js` - configuração do Express
- `src/server.js` - bootstrap da aplicação
- `src/config/db.js` - conexão com o MongoDB
- `src/models/` - schemas do Mongoose
- `src/controllers/` - regras de negócio
- `src/routes/` - rotas da API

## Variáveis de ambiente

Use um arquivo `.env` baseado em `.env.example`:

```bash
PORT=3002
MONGO_URI=mongodb://127.0.0.1:27017/sarcosystem
```

## Scripts

- `npm run dev`
- `npm start`
