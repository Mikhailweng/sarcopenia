const express = require("express")
const {
  listPatients,
  createPatient,
  updatePatient,
  deletePatient
} = require("../controllers/patientController")

const router = express.Router()

router.get("/", listPatients)
router.post("/", createPatient)
router.put("/:id", updatePatient)
router.delete("/:id", deletePatient)

module.exports = router
