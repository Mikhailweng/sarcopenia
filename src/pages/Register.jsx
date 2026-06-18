import { useState } from "react"

export default function Register({ setPage, setPatient }){
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "male",
    weight: "",
    height: "",
    race: "0",
    calf: ""
  })

  const [error, setError] = useState("")

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError("")
  }

  function handleSubmit(e) {
    e.preventDefault()

    // Validações básicas
    if (!formData.name || !formData.age || !formData.weight || !formData.height || !formData.calf) {
      setError("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setPatient(formData)   
    setPage("evaluation")  
  }

  return (
    <div>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "600",
          color: "var(--gray-900)",
          marginBottom: "8px"
        }}>Novo Paciente</h1>
        <p style={{
          fontSize: "14px",
          color: "var(--gray-600)"
        }}>Cadastre um novo paciente no sistema</p>
      </div>

      <div className="form-container">
        {error && <div className="form-message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">Nome Completo</label>
            <input 
              type="text"
              name="name" 
              className="form-input"
              placeholder="Digite o nome completo" 
              value={formData.name}
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Idade</label>
              <input 
                type="number" 
                name="age" 
                className="form-input"
                placeholder="Ex: 65" 
                value={formData.age}
                onChange={handleChange}
                min="0"
                max="150"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Gênero</label>
              <select 
                name="gender" 
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Peso (kg)</label>
              <input 
                type="number" 
                name="weight" 
                className="form-input"
                placeholder="Ex: 75.5" 
                value={formData.weight}
                onChange={handleChange}
                step="0.1"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Altura (m)</label>
              <input 
                type="number" 
                name="height" 
                className="form-input"
                placeholder="Ex: 1.70" 
                value={formData.height}
                onChange={(e) => {
                  setFormData({ ...formData, height: e.target.value })
                  setError("")
                }}
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Etnia</label>
              <select 
                name="race" 
                className="form-select"
                value={formData.race}
                onChange={handleChange}
              >
                <option value="0">Branca</option>
                <option value="1.1">Preta</option>
                <option value="-1.2">Asiática</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Perímetro da Panturrilha (cm)</label>
              <input 
                type="number" 
                name="calf" 
                className="form-input"
                placeholder="Ex: 31" 
                value={formData.calf}
                onChange={handleChange}
                step="0.1"
                min="0"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Cadastrar Paciente</button>
        </form>
      </div>
    </div>
  )
}