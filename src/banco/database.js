const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.resolve(__dirname, 'igreja.db')
const db = new sqlite3.Database(dbPath)

// Criar tabelas se não existirem
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS membros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      data_nascimento TEXT,
      telefone TEXT,
      email TEXT,
      endereco TEXT,
      data_batismo TEXT,
      status TEXT DEFAULT 'ativo',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      nivel_acesso TEXT DEFAULT 'admin'
    )
  `)
})

module.exports = db