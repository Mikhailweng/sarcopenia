import { useEffect, useMemo, useState } from "react"
import PageHeader from "../components/PageHeader"
import StatCard from "../components/StatCard"
import SectionCard from "../components/SectionCard"
import DataTable from "../components/DataTable"

export default function Evaluation({
  patient,
  patients = [],
  evaluations = [],
  onCompleteEvaluation,
  onAddPatient
}) {
  const [step, setStep] = useState(0)
  const [showPatientList, setShowPatientList] = useState(false)
  const [showNewPatientForm, setShowNewPatientForm] = useState(false)

  const [newPatientForm, setNewPatientForm] = useState({
    name: "",
    cpf: "",
    age: "",
    gender: "female",
    weight: "",
    height: "",
    calf: ""
  })

  const [bmi, setBmi] = useState(null)
  const [isObese, setIsObese] = useState(false)
  const [answers, setAnswers] = useState({})
  const [grip, setGrip] = useState("")
  const [chairTime, setChairTime] = useState("")
  const [massa, setMassa] = useState("")
  const [result, setResult] = useState(null)
  const [currentPatient, setCurrentPatient] = useState(null)
  const [error, setError] = useState("")

  

  useEffect(() => {
    if (currentPatient && step === 1) {
      if (
        !currentPatient.weight ||
        !currentPatient.height ||
        !currentPatient.gender ||
        !currentPatient.calf
      ) {
        setError(
          "Dados clínicos incompletos. Peso, altura, sexo e panturrilha são obrigatórios."
        )
        setStep(0)
        return
      }

      const weight = Number(currentPatient.weight)
      const height = Number(currentPatient.height)

      const calculatedBmi = weight / (height * height)

      setBmi(calculatedBmi)
      setIsObese(calculatedBmi > 30)

      const timer = setTimeout(() => {
        setStep(2)
      }, 1200)

      return () => clearTimeout(timer)
    }
  }, [currentPatient, step])

  useEffect(() => {
  if (patient) {
    startEvaluation(patient)
  }
}, [patient])

  const stats = useMemo(() => {
    return [
      {
        label: "Avaliações Totais",
        value: evaluations.length
      },
      {
        label: "Pacientes Avaliados",
        value: new Set(evaluations.map((e) => e.patientCpf)).size
      },
      {
        label: "Realizadas Hoje",
        value: evaluations.filter(
          (e) =>
            e.date === new Date().toLocaleDateString("pt-BR")
        ).length
      }
    ]
  }, [evaluations])

  function resetEvaluationState() {
    setStep(0)
    setBmi(null)
    setIsObese(false)
    setAnswers({})
    setGrip("")
    setChairTime("")
    setMassa("")
    setResult(null)
    setCurrentPatient(null)
    setError("")
    setShowPatientList(false)
    setShowNewPatientForm(false)
    
  }

  function startEvaluation(patientToEvaluate) {
    if (!patientToEvaluate) {
      setError("Paciente inválido.")
      return
    }

    setCurrentPatient(patientToEvaluate)
    setAnswers({})
    setGrip("")
    setChairTime("")
    setMassa("")
    setResult(null)
    setBmi(null)
    setIsObese(false)
    setStep(1)
    setShowPatientList(false)
    setShowNewPatientForm(false)
    setError("")
  }

  function calculateSarcCalf() {
    const hasUndefinedAnswer = [
      answers.strength,
      answers.walking,
      answers.chair,
      answers.stairs,
      answers.falls
    ].some((answer) => answer === undefined)

    if (hasUndefinedAnswer) {
      setError(
        "Por favor, responda todas as perguntas."
      )
      return
    }

    const total =
      (answers.strength || 0) +
      (answers.walking || 0) +
      (answers.chair || 0) +
      (answers.stairs || 0) +
      (answers.falls || 0)

    let calfBonus = 0

    if (
      currentPatient.gender === "male" &&
      Number(currentPatient.calf) < 34
    ) {
      calfBonus = 10
    }

    if (
      currentPatient.gender === "female" &&
      Number(currentPatient.calf) < 33
    ) {
      calfBonus = 10
    }

    const finalScore = total + calfBonus

    if (finalScore >= 11) {
      setStep(3)
    } else {
      setResult("Sem Sarcopenia")
      setStep(6)
    }

    setError("")
  }

  function evaluateStrength() {
    if (grip === "" || chairTime === "") {
      setError(
        "Preencha todos os campos de força muscular."
      )
      return
    }

    const gripValue = Number(grip)
    const chairValue = Number(chairTime)

    if (gripValue < 0 || chairValue < 0) {
      setError("Valores não podem ser negativos.")
      return
    }

    let isWeak = false

    if (currentPatient.gender === "male") {
      isWeak = gripValue < 27 || chairValue > 15
    } else {
      isWeak = gripValue < 16 || chairValue > 15
    }

    if (!isWeak) {
      setResult("Sem Sarcopenia")
      setStep(6)
    } else {
      setResult("Fraqueza muscular detectada")
      setStep(4)
    }

    setError("")
  }

  function evaluateMass() {
    if (massa === "") {
      setError("Preencha a massa muscular.")
      return
    }

    const massaValue = Number(massa)

    let isLowMass = false

    if (
      currentPatient.gender === "male" &&
      massaValue < 7
    ) {
      isLowMass = true
    }

    if (
      currentPatient.gender === "female" &&
      massaValue < 5.5
    ) {
      isLowMass = true
    }

    setResult(
      isLowMass
        ? "Sarcopenia Confirmada"
        : "Provável Sarcopenia"
    )

    setStep(6)
    setError("")
  }

  function completeEvaluation() {
    if (!currentPatient) return

    const dateStr = new Date().toLocaleDateString("pt-BR")

    onCompleteEvaluation?.({
      patientName: currentPatient.name,
      patientCpf: currentPatient.cpf,
      diagnosis: result,
      date: dateStr,
      professional: "Sistema",
      status: "Realizado"
    })

    resetEvaluationState()
  }

  function handleNewPatientFormChange(event) {
    const { name, value } = event.target

    setNewPatientForm((current) => ({
      ...current,
      [name]: value
    }))

    setError("")
  }

  async function handleCreateTemporaryPatient(event) {
    event.preventDefault()

    const {
      name,
      cpf,
      age,
      gender,
      weight,
      height,
      calf
    } = newPatientForm

    if (
      !name ||
      !cpf ||
      !age ||
      !gender ||
      !weight ||
      !height ||
      !calf
    ) {
      setError(
        "Preencha todos os campos para continuar."
      )
      return
    }

    const patientData = {
      name,
      cpf,
      age: Number(age),
      gender,
      weight: Number(weight),
      height: Number(height),
      calf: Number(calf),
      phone: "",
      clinic: "",
      lastEvaluation: "Sem avaliação",
      updatedAt: new Date()
        .toISOString()
        .split("T")[0]
    }

    try {
      const createdPatient = await onAddPatient?.(
        patientData
      )

      setNewPatientForm({
        name: "",
        cpf: "",
        age: "",
        gender: "female",
        weight: "",
        height: "",
        calf: ""
      })

      startEvaluation(createdPatient)
    } catch (error) {
      setError(
        "Erro ao salvar paciente: " + error.message
      )
    }
  }

  const patientColumns = [
    { key: "name", label: "Nome" },
    { key: "cpf", label: "CPF / ID" },
    { key: "age", label: "Idade" },
    {
      key: "lastEvaluation",
      label: "Última Avaliação"
    },
    { key: "actions", label: "Ação" }
  ]

  const evaluationColumns = [
    { key: "patientName", label: "Paciente" },
    { key: "diagnosis", label: "Diagnóstico" },
    { key: "date", label: "Data" },
    { key: "professional", label: "Profissional" }
  ]

  return (
    <div>
      <PageHeader
        title="Painel de Avaliação Clínica"
        subtitle={
          step === 0
            ? "Selecione um paciente para iniciar uma avaliação"
            : `Avaliação de ${currentPatient?.name || ""}`
        }
        action={
          step === 0 && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowNewPatientForm(
                  (current) => !current
                )
                setShowPatientList(false)
                setError("")
              }}
            >
              + Nova Avaliação
            </button>
          )
        }
      />

      <div className="stat-grid">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {step === 0 && (
        <SectionCard title="Iniciar Avaliação">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "20px"
            }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--gray-600)"
              }}
            >
              Clique em Iniciar Avaliação para ver a lista completa de pacientes.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowPatientList(true)
                  setShowNewPatientForm(false)
                }}
              >
                Iniciar Avaliação
              </button>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowNewPatientForm(
                    (current) => !current
                  )
                  setShowPatientList(false)
                  setError("")
                }}
              >
                + Nova Avaliação
              </button>
            </div>
          </div>

          {showNewPatientForm && (
            <div style={{ marginBottom: "24px" }}>
              {error && (
                <div className="form-message error">
                  {error}
                </div>
              )}

              <form
                className="patient-form"
                onSubmit={
                  handleCreateTemporaryPatient
                }
              >
                <div className="form-row full">
                  <div className="form-group">
                    <label className="form-label">
                      Nome
                    </label>

                    <input
                      name="name"
                      value={newPatientForm.name}
                      onChange={
                        handleNewPatientFormChange
                      }
                      className="form-input"
                      placeholder="Nome completo"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      CPF / ID
                    </label>

                    <input
                      name="cpf"
                      value={newPatientForm.cpf}
                      onChange={
                        handleNewPatientFormChange
                      }
                      className="form-input"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Idade
                    </label>

                    <input
                      name="age"
                      type="number"
                      min="0"
                      value={newPatientForm.age}
                      onChange={
                        handleNewPatientFormChange
                      }
                      className="form-input"
                      placeholder="Ex: 65"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Sexo
                    </label>

                    <select
                      name="gender"
                      value={newPatientForm.gender}
                      onChange={
                        handleNewPatientFormChange
                      }
                      className="form-select"
                    >
                      <option value="female">
                        Feminino
                      </option>

                      <option value="male">
                        Masculino
                      </option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Peso (kg)
                    </label>

                    <input
                      name="weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={newPatientForm.weight}
                      onChange={
                        handleNewPatientFormChange
                      }
                      className="form-input"
                      placeholder="Ex: 70"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Altura (m)
                    </label>

                    <input
                      name="height"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPatientForm.height}
                      onChange={
                        handleNewPatientFormChange
                      }
                      className="form-input"
                      placeholder="Ex: 1.70"
                    />
                  </div>
                </div>

                <div className="form-row full">
                  <div className="form-group">
                    <label className="form-label">
                      Circunferência da Panturrilha (cm)
                    </label>

                    <input
                      name="calf"
                      type="number"
                      step="0.1"
                      min="0"
                      value={newPatientForm.calf}
                      onChange={
                        handleNewPatientFormChange
                      }
                      className="form-input"
                      placeholder="Ex: 33"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Continuar Avaliação
                </button>
              </form>
            </div>
          )}

          {showPatientList && (
            <DataTable
              columns={patientColumns}
              data={patients}
              renderRow={(patientRow) => (
                <tr key={patientRow.cpf}>
                  <td>{patientRow.name}</td>
                  <td>{patientRow.cpf}</td>
                  <td>{patientRow.age}</td>
                  <td>
                    {patientRow.lastEvaluation}
                  </td>

                  <td className="table-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        startEvaluation(patientRow)
                      }
                    >
                      Iniciar Avaliação
                    </button>
                  </td>
                </tr>
              )}
              noDataText="Nenhum paciente cadastrado."
            />
          )}
        </SectionCard>
      )}

      {step > 0 && currentPatient && (
        <SectionCard
          title={`Avaliação de ${currentPatient.name}`}
        >
          <div
            style={{
              marginBottom: "16px",
              padding: "16px",
              backgroundColor: "var(--gray-100)",
              borderRadius: "12px"
            }}
          >
            <p
              style={{
                margin: "8px 0",
                fontSize: "14px"
              }}
            >
              <strong>Paciente:</strong>{" "}
              {currentPatient.name}
            </p>

            <p
              style={{
                margin: "8px 0",
                fontSize: "14px"
              }}
            >
              <strong>Idade:</strong>{" "}
              {currentPatient.age} anos |{" "}
              <strong>Sexo:</strong>{" "}
              {currentPatient.gender === "male"
                ? "Masculino"
                : "Feminino"}
            </p>

            <p
              style={{
                margin: "8px 0",
                fontSize: "14px"
              }}
            >
              <strong>Peso:</strong>{" "}
              {currentPatient.weight}kg |{" "}
              <strong>Altura:</strong>{" "}
              {currentPatient.height}m
            </p>
          </div>

          {error && (
            <div className="form-message error">
              {error}
            </div>
          )}

          {step === 1 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0"
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  color: "var(--primary)",
                  marginBottom: "16px"
                }}
              >
                Calculando IMC...
              </h3>

              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border:
                    "3px solid var(--primary)",
                  borderTop:
                    "3px solid transparent",
                  borderRadius: "50%",
                  margin: "0 auto",
                  animation:
                    "spin 1s linear infinite"
                }}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "20px"
                }}
              >
                ETAPA 2: Questionário SARC-CalF
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "16px",
                  marginBottom: "24px",
                  padding: "16px",
                  backgroundColor:
                    "var(--gray-100)",
                  borderRadius: "12px"
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--gray-600)",
                      marginBottom: "4px"
                    }}
                  >
                    IMC
                  </p>

                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: "var(--primary)"
                    }}
                  >
                    {bmi?.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--gray-600)",
                      marginBottom: "4px"
                    }}
                  >
                    Status
                  </p>

                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: isObese
                        ? "#dc2626"
                        : "var(--gray-900)"
                    }}
                  >
                    {isObese
                      ? "Obesidade"
                      : "Normal"}
                  </p>
                </div>
              </div>

              {[
                {
                  key: "strength",
                  label:
                    "Você tem dificuldade para carregar 5kg?"
                },
                {
                  key: "walking",
                  label:
                    "Você tem dificuldade para caminhar?"
                },
                {
                  key: "chair",
                  label:
                    "Dificuldade para levantar da cadeira?"
                },
                {
                  key: "stairs",
                  label:
                    "Dificuldade para subir escadas?"
                }
              ].map((q) => (
                <div
                  key={q.key}
                  className="form-group"
                >
                  <label className="form-label">
                    {q.label}
                  </label>

                  <select
                    className="form-select"
                    value={
                      answers[q.key] !== undefined
                        ? answers[q.key]
                        : ""
                    }
                    onChange={(e) => {
                      if (
                        e.target.value !== ""
                      ) {
                        setAnswers({
                          ...answers,
                          [q.key]: Number(
                            e.target.value
                          )
                        })

                        setError("")
                      }
                    }}
                  >
                    <option value="">
                      Selecione...
                    </option>

                    <option value="0">
                      0 - Nenhuma
                    </option>

                    <option value="1">
                      1 - Alguma
                    </option>

                    <option value="2">
                      2 - Muita dificuldade
                    </option>
                  </select>
                </div>
              ))}

              <div className="form-group">
                <label className="form-label">
                  Quedas no último ano?
                </label>

                <select
                  className="form-select"
                  value={
                    answers.falls !== undefined
                      ? answers.falls
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setAnswers({
                        ...answers,
                        falls: Number(
                          e.target.value
                        )
                      })

                      setError("")
                    }
                  }}
                >
                  <option value="">
                    Selecione...
                  </option>

                  <option value="0">
                    0 - Nenhuma
                  </option>

                  <option value="1">
                    1 - 1 a 3
                  </option>

                  <option value="2">
                    2 - 4 ou mais
                  </option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                onClick={calculateSarcCalf}
                style={{ marginTop: "16px" }}
              >
                Continuar para Força Muscular
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "20px"
                }}
              >
                ETAPA 3: Força Muscular
              </h3>

              <div className="form-group">
                <label className="form-label">
                  Força de Preensão Manual (kg)
                </label>

                <input
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="Ex: 20"
                  value={grip}
                  onChange={(e) => {
                    setGrip(e.target.value)
                    setError("")
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Tempo para Levantar da Cadeira
                </label>

                <input
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="Ex: 18"
                  value={chairTime}
                  onChange={(e) => {
                    setChairTime(e.target.value)
                    setError("")
                  }}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={evaluateStrength}
                style={{ marginTop: "16px" }}
              >
                Avaliar Força
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "20px"
                }}
              >
                ETAPA 4: Massa Muscular
              </h3>

              <div className="form-group">
                <label className="form-label">
                  Índice de Massa Muscular
                </label>

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="form-input"
                  placeholder="Ex: 6.5"
                  value={massa}
                  onChange={(e) => {
                    setMassa(e.target.value)
                    setError("")
                  }}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={evaluateMass}
                style={{ marginTop: "16px" }}
              >
                Finalizar Avaliação
              </button>
            </div>
          )}

          {step === 6 && (
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "20px"
                }}
              >
                Resultado Final
              </h3>

              <div
                style={{
                  padding: "20px",
                  backgroundColor:
                    "var(--gray-100)",
                  borderRadius: "12px",
                  marginBottom: "20px"
                }}
              >
                <p style={{ margin: "8px 0" }}>
                  <strong>Diagnóstico:</strong>{" "}
                  <span
                    style={{
                      color:
                        result ===
                        "Sarcopenia Confirmada"
                          ? "#991b1b"
                          : result ===
                            "Provável Sarcopenia"
                          ? "#b45309"
                          : "#166534",
                      fontWeight: "bold",
                      fontSize: "16px"
                    }}
                  >
                    {result}
                  </span>
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={completeEvaluation}
                style={{ marginRight: "8px" }}
              >
                Salvar Avaliação
              </button>

              <button
                className="btn btn-secondary"
                onClick={resetEvaluationState}
              >
                Realizar Nova Avaliação
              </button>
            </div>
          )}
        </SectionCard>
      )}

      {evaluations.length > 0 && (
        <SectionCard title="Histórico de Avaliações">
          <DataTable
            columns={evaluationColumns}
            data={evaluations}
            renderRow={(e) => (
              <tr
                key={
                  e.id ||
                  `${e.patientCpf}-${e.date}`
                }
              >
                <td>{e.patientName}</td>
                <td>{e.diagnosis}</td>
                <td>{e.date}</td>
                <td>{e.professional}</td>
              </tr>
            )}
            noDataText="Nenhuma avaliação realizada."
          />
        </SectionCard>
      )}

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}