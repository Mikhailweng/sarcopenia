const express = require('express')
const cors = require('cors')
const patientsRoutes = require('./routes/patients')
const evaluationsRoutes = require('./routes/evaluations')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'SarcoSystem Backend rodando', version: '0.1.0' })
})

app.use('/patients', patientsRoutes)
app.use('/evaluations', evaluationsRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`)
})
