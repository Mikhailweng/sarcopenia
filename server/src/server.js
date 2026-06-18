require("dotenv").config()

const app = require("./app")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 3002
const MONGO_URI = process.env.MONGO_URI

async function start() {
  try {
    await connectDB(MONGO_URI)
    const server = app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`)
    })

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`A porta ${PORT} já está em uso. Pare o processo atual ou troque a PORT no .env.`)
        return
      }

      console.error("Erro ao iniciar a API:", error.message)
    })
  } catch (error) {
    console.error("Falha ao iniciar a API:", error.message)
    process.exit(1)
  }
}

start()
