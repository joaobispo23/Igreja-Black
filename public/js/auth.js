function mostrarLoginModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <div class="login-container">
        <h2>Login</h2>
        <form id="login-form" class="login-form">
          <div class="form-group">
            <label for="login-username">Usuário</label>
            <input type="text" id="login-username" required>
          </div>
          <div class="form-group">
            <label for="login-password">Senha</label>
            <input type="password" id="login-password" required>
          </div>
          <button type="submit">Entrar</button>
          <div id="login-error" class="error-message hidden"></div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'block';

  // Fechar modal
  modal.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.removeChild(modal);
  });

  // Submissão do formulário
  const loginForm = modal.querySelector('#login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fazerLogin(username, password)
      .then(() => {
        modal.style.display = 'none';
        document.body.removeChild(modal);
        window.location.reload();
      })
      .catch(err => {
        const errorElement = document.getElementById('login-error');
        errorElement.textContent = err.message;
        errorElement.classList.remove('hidden');
      });
  });
}

async function fazerLogin(username, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Credenciais inválidas');
    }

    localStorage.setItem('token', data.token);
    return data;
  } catch (error) {
    throw new Error('Falha no login: ' + error.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.reload();
}

// Adicionar estilos para o modal
const style = document.createElement('style');
style.textContent = `
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  width: 80%;
  max-width: 500px;
  border-radius: 8px;
  position: relative;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover {
  color: black;
}

.hidden {
  display: none;
}
`;
document.head.appendChild(style);

// Exportar funções para uso global
window.mostrarLoginModal = mostrarLoginModal;
window.logout = logout;