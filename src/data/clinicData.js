export const initialPatients = [
  {
    name: "Maria Silva",
    age: 69,
    gender: "female",
    weight: 62,
    height: 1.58,
    calf: 33,
    cpf: "123.456.789-00",
    lastEvaluation: "12/04/2026",
    updatedAt: "2026-04-12"
  },
  {
    name: "João Santos",
    age: 72,
    gender: "male",
    weight: 78,
    height: 1.69,
    calf: 32,
    cpf: "987.654.321-11",
    lastEvaluation: "10/04/2026",
    updatedAt: "2026-04-10"
  }
]

export const initialEvaluations = [
  {
    id: 1,
    patientName: "Maria Silva",
    patientCpf: "123.456.789-00",
    diagnosis: "Sem Sarcopenia",
    date: "12/04/2026",
    professional: "Dra. Ana Lima",
    status: "Realizado"
  },
  {
    id: 2,
    patientName: "João Santos",
    patientCpf: "987.654.321-11",
    diagnosis: "Provável Sarcopenia",
    date: "10/04/2026",
    professional: "Dr. Lucas Ribeiro",
    status: "Pendende"
  }
]

export const initialReports = [
  {
    id: 1,
    patient: "Maria Silva",
    diagnosis: "Sem Sarcopenia",
    date: "12/04/2026",
    professional: "Dra. Ana Lima",
    status: "success"
  },
  {
    id: 2,
    patient: "João Santos",
    diagnosis: "Provável Sarcopenia",
    date: "10/04/2026",
    professional: "Dr. Lucas Ribeiro",
    status: "warning"
  }
]
