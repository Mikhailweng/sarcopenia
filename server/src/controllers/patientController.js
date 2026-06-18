const Patient = require("../models/Patient")

function normalizeDate(value) {
  return value || new Date().toISOString().split("T")[0]
}

function toNumber(value) {
  if (value === "" || value === undefined || value === null) return null
  const numberValue = Number(value)
  return Number.isNaN(numberValue) ? null : numberValue
}

async function listPatients(req, res, next) {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 })
    res.json(patients)
  } catch (error) {
    next(error)
  }
}

async function createPatient(req, res, next) {
  try {
    const { name, cpf, birthDate, gender, phone, clinic } = req.body

    if (!name || !cpf) {
      return res.status(400).json({ error: "Nome e CPF são obrigatórios." })
    }

    const existingPatient = await Patient.findOne({ cpf })
    if (existingPatient) {
      return res.status(409).json({ error: "Já existe um paciente com esse CPF." })
    }

    const patient = await Patient.create({
      name,
      cpf,
      birthDate: birthDate || "",
      gender: gender || "",
      phone: phone || "",
      clinic: clinic || "",
      age: toNumber(req.body.age),
      weight: toNumber(req.body.weight),
      height: toNumber(req.body.height),
      calf: toNumber(req.body.calf),
      lastEvaluation: req.body.lastEvaluation || "Sem avaliação",
      updatedAt: normalizeDate(req.body.updatedAt)
    })

    res.status(201).json(patient)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Já existe um paciente com esse CPF." })
    }
    next(error)
  }
}

async function updatePatient(req, res, next) {
  try {
    const { id } = req.params
    const update = {
      ...req.body,
      age: toNumber(req.body.age),
      weight: toNumber(req.body.weight),
      height: toNumber(req.body.height),
      calf: toNumber(req.body.calf)
    }

    const patient = await Patient.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true
    })

    if (!patient) {
      return res.status(404).json({ error: "Paciente não encontrado." })
    }

    res.json(patient)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de paciente inválido." })
    }
    next(error)
  }
}

async function deletePatient(req, res, next) {
  try {
    const { id } = req.params
    const patient = await Patient.findByIdAndDelete(id)

    if (!patient) {
      return res.status(404).json({ error: "Paciente não encontrado." })
    }

    res.status(204).send()
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "ID de paciente inválido." })
    }
    next(error)
  }
}

module.exports = {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient
}
