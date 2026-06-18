const express = require('express')
const fs = require('fs').promises
const path = require('path')

const router = express.Router()
const dbPath = path.join(__dirname, '..', 'db.json')

async function readDb() {
  const content = await fs.readFile(dbPath, 'utf8')
  return JSON.parse(content)
}

async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8')
}

function createId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function toNumber(value) {
  const num = Number(value)
  return Number.isNaN(num) ? undefined : num
}

router.get('/', async (req, res) => {
  const db = await readDb()
  res.json(db.patients || [])
})

router.post('/', async (req, res) => {
  const { name, cpf, birthDate, gender, phone, clinic } = req.body

  if (!name || !cpf) {
    return res.status(400).json({ error: 'Nome e CPF são obrigatórios.' })
  }

  const db = await readDb()
  const newPatient = {
    id: createId(),
    name,
    cpf,
    birthDate: birthDate || '',
    gender: gender || '',
    phone: phone || '',
    clinic: clinic || '',
    age: toNumber(req.body.age),
    weight: toNumber(req.body.weight),
    height: toNumber(req.body.height),
    calf: toNumber(req.body.calf),
    lastEvaluation: req.body.lastEvaluation || 'Sem avaliação',
    updatedAt: req.body.updatedAt || new Date().toISOString().split('T')[0]
  }

  db.patients.push(newPatient)
  await writeDb(db)
  res.status(201).json(newPatient)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const updates = req.body
  const db = await readDb()
  const patientIndex = db.patients.findIndex((patient) => patient.id === id)

  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Paciente não encontrado.' })
  }

  db.patients[patientIndex] = {
    ...db.patients[patientIndex],
    ...updates,
    id
  }

  await writeDb(db)
  res.json(db.patients[patientIndex])
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const db = await readDb()
  const filtered = db.patients.filter((patient) => patient.id !== id)

  if (filtered.length === db.patients.length) {
    return res.status(404).json({ error: 'Paciente não encontrado.' })
  }

  db.patients = filtered
  await writeDb(db)
  res.status(204).send()
})

module.exports = router
