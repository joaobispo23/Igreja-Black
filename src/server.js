const express = require('express')
const cors = require('cors')
const app = express()

// Configurações básicas
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// Rotas
app.use('/api/membros', require('./rotas/membros'))
app.use('/api/auth', require('./rotas/auth'))

// Iniciar servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})