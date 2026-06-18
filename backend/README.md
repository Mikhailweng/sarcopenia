# SarcoSystem Backend (Express + db.json)

Esta é uma API backend simples para o sistema clínico SarcoSystem/Diagomed.

## Estrutura

backend/
├── server.js
├── db.json
└── routes/
    ├── patients.js
    └── evaluations.js

## Rotas disponíveis

### Pacientes
- `GET /patients` → lista todos os pacientes
- `POST /patients` → cadastra um paciente
- `PUT /patients/:id` → atualiza paciente
- `DELETE /patients/:id` → remove paciente

### Avaliações
- `GET /evaluations` → lista todas as avaliações
- `POST /evaluations` → salva uma avaliação clínica

## Como rodar

1. Abra o terminal na pasta `backend`
2. Execute `npm install`
3. Execute `npm run start`

A API ficará disponível em `http://localhost:3001`.

## Exemplo de integração com frontend React

Use `fetch` ou `axios` para acessar as rotas.

### Buscar pacientes
```js
const response = await fetch('http://localhost:3001/patients')
const patients = await response.json()
```

### Criar novo paciente
```js
await fetch('http://localhost:3001/patients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Carlos Santos',
    cpf: '111.222.333-44',
    birthDate: '1980-09-10',
    gender: 'M',
    phone: '(11) 97777-0000',
    clinic: 'Unidade C'
  })
})
```

### Buscar avaliações
```js
const response = await fetch('http://localhost:3001/evaluations')
const evaluations = await response.json()
```

### Salvar avaliação
```js
await fetch('http://localhost:3001/evaluations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientId: '1',
    date: '2026-05-08',
    score: 15,
    notes: 'Avaliação de controle',
    results: { strength: 4, gait: 4, chair: 3, stairs: 4 },
    clinician: 'Dr. Pedro'
  })
})
```

## Notas
- CORS e JSON parsing já estão habilitados.
- O armazenamento é feito em `db.json`, o que torna a solução simples e ideal para demonstrações acadêmicas.
