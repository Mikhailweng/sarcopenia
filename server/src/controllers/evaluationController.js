const Evaluation = require("../models/Evaluation")

async function listEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find().sort({ createdAt: -1 })
    res.json(evaluations)
  } catch (error) {
    next(error)
  }
}

async function createEvaluation(req, res, next) {
  try {
    const evaluationData = req.body
    const { patientCpf, date } = evaluationData

    if (!patientCpf || !date) {
      return res.status(400).json({
        error: "patientCpf e date são obrigatórios."
      })
    }

    const evaluation = await Evaluation.create({
      ...evaluationData,
      professional: evaluationData.professional || "Sistema",
      status: evaluationData.status || "Realizado"
    })

    res.status(201).json(evaluation)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listEvaluations,
  createEvaluation
}
