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

router.get('/', async (req, res) => {
  const db = await readDb()
  res.json(db.evaluations || [])
})

router.post('/', async (req, res) => {
  const evaluationData = req.body
  const { patientCpf, date } = evaluationData

  if (!patientCpf || !date) {
    return res.status(400).json({
      error: 'patientCpf e date são obrigatórios.'
    })
  }

  const db = await readDb()
  const newEvaluation = {
    id: createId(),
    ...evaluationData
  }

  db.evaluations.push(newEvaluation)
  await writeDb(db)
  res.status(201).json(newEvaluation)
})

module.exports = router
