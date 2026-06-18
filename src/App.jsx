import { useEffect, useMemo, useState } from "react"

import "./App.css"
import "./styles/forms.css"
import "./styles/ui.css"
import MainLayout from "./layouts/MainLayout"
import Dashboard from "./pages/Dashboard"
import Patients from "./pages/Patients"
import Evaluation from "./pages/Evaluation"
import Reports from "./pages/Reports"
import Users from "./pages/Users"
import { initialReports } from "./data/clinicData"

const API_BASE = "http://localhost:3001"

function App() {
  const [page, setPage] = useState("dashboard")
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [evaluations, setEvaluations] = useState([])
  const [reports, setReports] = useState(initialReports)
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (page === "evaluation" && !selectedPatient && patients.length > 0) {
      setSelectedPatient(patients[0])
    }
  }, [page, selectedPatient, patients])

  const stats = useMemo(() => {
    return {
      totalPatients: patients.length,
      totalEvaluations: evaluations.length,
      pendingReports: reports.filter((item) => item.status === "warning").length
    }
  }, [patients, evaluations, reports])

  async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    })

    if (response.status === 204) return null
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Erro na requisição")
    }

    return data
  }

  async function loadData() {
    setIsLoading(true)
    setApiError("")

    try {
      const [patientsData, evaluationsData] = await Promise.all([fetchPatients(), fetchEvaluations()])
      setPatients(patientsData)
      setSelectedPatient(patientsData[0] || null)
      setEvaluations(evaluationsData)
    } catch (error) {
      setApiError("Não foi possível carregar os dados. Verifique o backend e tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchPatients() {
    return request("/patients")
  }

  async function fetchEvaluations() {
    return request("/evaluations")
  }

  async function handleAddPatient(newPatient) {
    setIsLoading(true)
    setApiError("")

    try {
      const createdPatient = await request("/patients", {
        method: "POST",
        body: JSON.stringify(newPatient)
      })
      setPatients((current) => [createdPatient, ...current])
      setSelectedPatient(createdPatient)
      setPage("patients")
    } catch (error) {
      setApiError("Não foi possível salvar o paciente. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddPatientForEvaluation(newPatient) {
    setIsLoading(true)
    setApiError("")

    try {
      const createdPatient = await request("/patients", {
        method: "POST",
        body: JSON.stringify(newPatient)
      })
      setPatients((current) => [createdPatient, ...current])
      setSelectedPatient(createdPatient)
      return createdPatient
    } catch (error) {
      setApiError("Não foi possível salvar o paciente. Tente novamente.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdatePatient(id, updates) {
    setIsLoading(true)
    setApiError("")

    try {
      const updatedPatient = await request(`/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates)
      })
      setPatients((current) => current.map((patient) => (patient.id === id ? updatedPatient : patient)))
      if (selectedPatient?.id === id) {
        setSelectedPatient(updatedPatient)
      }
      return updatedPatient
    } catch (error) {
      setApiError("Não foi possível atualizar o paciente.")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeletePatient(id) {
    setIsLoading(true)
    setApiError("")

    try {
      await request(`/patients/${id}`, {
        method: "DELETE"
      })
      setPatients((current) => current.filter((patient) => patient.id !== id))
      if (selectedPatient?.id === id) {
        setSelectedPatient(null)
      }
    } catch (error) {
      setApiError("Não foi possível remover o paciente.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCompleteEvaluation(record) {
    setIsLoading(true)
    setApiError("")

    try {
      const savedEvaluation = await request("/evaluations", {
        method: "POST",
        body: JSON.stringify(record)
      })

      setEvaluations((current) => [savedEvaluation, ...current])
      setReports((current) => [
        {
          id: current.length + 1,
          patient: record.patientName,
          diagnosis: record.diagnosis,
          date: record.date,
          professional: record.professional,
          status: record.status === "Realizado" ? "success" : "warning"
        },
        ...current
      ])

      const patientToUpdate = patients.find((patient) => patient.cpf === record.patientCpf)
      if (patientToUpdate?.id) {
        await handleUpdatePatient(patientToUpdate.id, {
          ...patientToUpdate,
          lastEvaluation: record.date,
          updatedAt: new Date().toISOString().split("T")[0]
        })
      } else {
        setPatients((current) =>
          current.map((patient) =>
            patient.cpf === record.patientCpf
              ? { ...patient, lastEvaluation: record.date, updatedAt: new Date().toISOString().split("T")[0] }
              : patient
          )
        )
      }
    } catch (error) {
      setApiError("Não foi possível salvar a avaliação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  function handleStartEvaluation(patient) {
    setSelectedPatient(patient)
    setPage("evaluation")
  }

 

  function handleSelectPatient(patient) {
    setSelectedPatient(patient)
  }

  function renderPage() {
    if (page === "dashboard") return <Dashboard patients={patients} evaluations={evaluations} reports={reports} />
    if (page === "patients")
      return (
        <Patients
          patients={patients}
          onAddPatient={handleAddPatient}
          onStartEvaluation={handleStartEvaluation}
          onSelectPatient={handleSelectPatient}
          selectedPatient={selectedPatient}
        />
      )
    if (page === "evaluation")
      return (
        <Evaluation
          patient={selectedPatient}
          patients={patients}
          evaluations={evaluations}
          onCompleteEvaluation={handleCompleteEvaluation}
          onAddPatient={handleAddPatientForEvaluation}
        />
      )
    if (page === "reports") return <Reports reports={reports} />
    if (page === "users") return <Users />
    return <Dashboard patients={patients} evaluations={evaluations} reports={reports} />
  }

  return (
    <MainLayout page={page} setPage={setPage}>
      {isLoading && <div className="form-message info">Carregando dados...</div>}
      {apiError && <div className="form-message error">{apiError}</div>}
      {renderPage()}
    </MainLayout>
  )
}

export default App