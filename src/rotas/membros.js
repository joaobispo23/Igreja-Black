const express = require('express')
const router = express.Router()
const db = require('../banco/database')

// Listar todos os membros
router.get('/', (req, res) => {
  db.all('SELECT * FROM membros WHERE status = "ativo"', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(rows)
  })
})

// Cadastrar novo membro
router.post('/', (req, res) => {
  const { nome, data_nascimento, telefone, email, endereco, data_batismo } = req.body
  db.run(
    'INSERT INTO membros (nome, data_nascimento, telefone, email, endereco, data_batismo) VALUES (?, ?, ?, ?, ?, ?)',
    [nome, data_nascimento, telefone, email, endereco, data_batismo],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      res.status(201).json({ id: this.lastID })
    }
  )
})

// Obter detalhes de um membro
router.get('/:id', (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM membros WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!row) {
      return res.status(404).json({ message: 'Membro não encontrado' })
    }
    res.json(row)
  })
})

// Atualizar membro
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { nome, data_nascimento, telefone, email, endereco, data_batismo, status } = req.body
  
  db.run(
    `UPDATE membros SET 
      nome = ?, 
      data_nascimento = ?, 
      telefone = ?, 
      email = ?, 
      endereco = ?, 
      data_batismo = ?,
      status = ?
    WHERE id = ?`,
    [nome, data_nascimento, telefone, email, endereco, data_batismo, status, id],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message })
      }
      res.json({ message: 'Membro atualizado com sucesso' })
    }
  )
})

module.exports = router