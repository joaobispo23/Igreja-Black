const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../banco/database')

// Cadastro de usuário admin (para primeiro acesso)
router.post('/register', async (req, res) => {
  try {
    const { username, senha } = req.body
    const hashedSenha = await bcrypt.hash(senha, 10)
    
    db.run(
      'INSERT INTO usuarios (username, senha) VALUES (?, ?)',
      [username, hashedSenha],
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Usuário já existe' })
        }
        res.status(201).json({ id: this.lastID })
      }
    )
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post('/login', (req, res) => {
  const { username, senha } = req.body
  
  db.get(
    'SELECT * FROM usuarios WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }

      const senhaValida = await bcrypt.compare(senha, user.senha)
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'segredo_igreja',
        { expiresIn: '8h' }
      )

      res.json({ token })
    }
  )
})

module.exports = router