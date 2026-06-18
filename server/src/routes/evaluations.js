const express = require("express")
const {
  listEvaluations,
  createEvaluation
} = require("../controllers/evaluationController")

const router = express.Router()

router.get("/", listEvaluations)
router.post("/", createEvaluation)

module.exports = router
