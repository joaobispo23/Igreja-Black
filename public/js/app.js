// Variáveis globais
let token = localStorage.getItem('token') || null;
let membros = [];

// Elementos DOM
const loginStatus = document.getElementById('login-status');
const btnLogin = document.getElementById('btn-login');
const secaoCadastro = document.getElementById('secao-cadastro');
const secaoLista = document.getElementById('secao-lista');
const formCadastro = document.getElementById('form-cadastro');
const btnNovo = document.getElementById('btn-novo');
const btnCancelar = document.getElementById('btn-cancelar');
const tabelaMembros = document.getElementById('tabela-membros');
const corpoTabela = document.getElementById('corpo-tabela');
const inputBusca = document.getElementById('busca');
const btnBuscar = document.getElementById('btn-buscar');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  verificarAutenticacao();
  carregarMembros();
  
  btnLogin.addEventListener('click', mostrarLogin);
  btnNovo.addEventListener('click', mostrarFormCadastro);
  btnCancelar.addEventListener('click', esconderFormCadastro);
  formCadastro.addEventListener('submit', salvarMembro);
  btnBuscar.addEventListener('click', buscarMembros);
  inputBusca.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarMembros();
  });
});

// Funções de Autenticação
function verificarAutenticacao() {
  if (token) {
    btnLogin.textContent = 'Logout';
    btnLogin.onclick = logout;
  } else {
    btnLogin.textContent = 'Login';
    btnLogin.onclick = mostrarLogin;
  }
}

function logout() {
  token = null;
  localStorage.removeItem('token');
  verificarAutenticacao();
  location.reload();
}


// Funções de Membros
function carregarMembros() {
  if (!token) return;
  
  fetch('/api/membros', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => response.json())
  .then(data => {
    membros = data;
    renderizarTabela();
  })
  .catch(err => console.error('Erro ao carregar membros:', err));
}

function renderizarTabela() {
  corpoTabela.innerHTML = '';
  
  membros.forEach(membro => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${membro.nome}</td>
      <td>${membro.telefone || '-'}</td>
      <td>${membro.email || '-'}</td>
      <td>${membro.data_batismo ? formatarData(membro.data_batismo) : '-'}</td>
      <td class="actions">
        <button class="btn-primary btn-sm" onclick="editarMembro(${membro.id})">Editar</button>
        <button class="btn-danger btn-sm" onclick="excluirMembro(${membro.id})">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(tr);
  });
}

function formatarData(dataString) {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dataString).toLocaleDateString('pt-BR', options);
}

function mostrarFormCadastro() {
  secaoLista.classList.add('hidden');
  secaoCadastro.classList.remove('hidden');
  formCadastro.reset();
}

function esconderFormCadastro() {
  secaoCadastro.classList.add('hidden');
  secaoLista.classList.remove('hidden');
}

function salvarMembro(e) {
  e.preventDefault();
  
  const membro = {
    nome: document.getElementById('nome').value,
    data_nascimento: document.getElementById('data-nascimento').value || null,
    telefone: document.getElementById('telefone').value || null,
    email: document.getElementById('email').value || null,
    endereco: document.getElementById('endereco').value || null,
    data_batismo: document.getElementById('data-batismo').value || null
  };

  fetch('/api/membros', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(membro)
  })
  .then(response => response.json())
  .then(data => {
    if (data.id) {
      alert('Membro cadastrado com sucesso!');
      esconderFormCadastro();
      carregarMembros();
    }
  })
  .catch(err => console.error('Erro ao salvar membro:', err));
}

function buscarMembros() {
  const termo = inputBusca.value.toLowerCase();
  
  if (!termo) {
    renderizarTabela();
    return;
  }

  const resultados = membros.filter(membro => 
    membro.nome.toLowerCase().includes(termo) ||
    (membro.email && membro.email.toLowerCase().includes(termo)) ||
    (membro.telefone && membro.telefone.includes(termo))
  );

  corpoTabela.innerHTML = '';
  resultados.forEach(membro => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${membro.nome}</td>
      <td>${membro.telefone || '-'}</td>
      <td>${membro.email || '-'}</td>
      <td>${membro.data_batismo ? formatarData(membro.data_batismo) : '-'}</td>
      <td class="actions">
        <button class="btn-primary btn-sm" onclick="editarMembro(${membro.id})">Editar</button>
        <button class="btn-danger btn-sm" onclick="excluirMembro(${membro.id})">Excluir</button>
      </td>
    `;
    corpoTabela.appendChild(tr);
  });
}

// Funções globais para os botões da tabela
window.editarMembro = function(id) {
  const membro = membros.find(m => m.id === id);
  if (!membro) return;
  
  // Preencher formulário com dados do membro
  document.getElementById('nome').value = membro.nome;
  document.getElementById('data-nascimento').value = membro.data_nascimento || '';
  document.getElementById('telefone').value = membro.telefone || '';
  document.getElementById('email').value = membro.email || '';
  document.getElementById('endereco').value = membro.endereco || '';
  document.getElementById('data-batismo').value = membro.data_batismo || '';
  
  mostrarFormCadastro();
};

window.excluirMembro = function(id) {
  if (!confirm('Tem certeza que deseja excluir este membro?')) return;
  
  fetch(`/api/membros/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => {
    if (response.ok) {
      alert('Membro excluído com sucesso!');
      carregarMembros();
    }
  })
  .catch(err => console.error('Erro ao excluir membro:', err));
};