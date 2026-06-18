const express = require("express")
const cors = require("cors")

const patientsRoutes = require("./routes/patients")
const evaluationsRoutes = require("./routes/evaluations")

const app = express()

app.use(
  cors({
    origin: true
  })
)
app.options("*", cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "SarcoSystem API rodando", version: "1.0.0" })
})

app.use("/patients", patientsRoutes)
app.use("/evaluations", evaluationsRoutes)

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" })
})

app.use((error, req, res, next) => {
  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Erro interno do servidor." })
  }

  next()
})

module.exports = app
