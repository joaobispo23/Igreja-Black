class Membro {
  constructor(dados) {
    this.id = dados.id || null
    this.nome = dados.nome || ''
    this.data_nascimento = dados.data_nascimento || null
    this.telefone = dados.telefone || ''
    this.email = dados.email || ''
    this.endereco = dados.endereco || ''
    this.data_batismo = dados.data_batismo || null
    this.status = dados.status || 'ativo'
    this.created_at = dados.created_at || new Date().toISOString()
  }

  validar() {
    const erros = []
    if (!this.nome) erros.push('Nome é obrigatório')
    if (this.nome && this.nome.length < 3) erros.push('Nome muito curto')
    if (this.email && !this.email.includes('@')) erros.push('Email inválido')
    if (this.telefone && this.telefone.length < 10) erros.push('Telefone inválido')
    
    return erros.length ? erros : null
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      data_nascimento: this.data_nascimento,
      telefone: this.telefone,
      email: this.email,
      endereco: this.endereco,
      data_batismo: this.data_batismo,
      status: this.status,
      created_at: this.created_at
    }
  }
}

module.exports = Membro