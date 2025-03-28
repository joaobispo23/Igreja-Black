<?php
require_once __DIR__ . '/../config/database.php';

class Auth {
    private $conn;
    private $table = 'usuarios';

    public function __construct() {
        $this->conn = getDBConnection();
    }

    public function registrar($username, $senha) {
        // Verificar se usuário já existe
        $query = "SELECT id FROM " . $this->table . " WHERE username = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            return ['success' => false, 'error' => 'Usuário já existe'];
        }

        // Criar hash da senha
        $senhaHash = password_hash($senha, PASSWORD_BCRYPT);

        // Inserir novo usuário
        $query = "INSERT INTO " . $this->table . " (username, senha) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $username, $senhaHash);
        
        if ($stmt->execute()) {
            return ['success' => true, 'id' => $this->conn->insert_id];
        }
        
        return ['success' => false, 'error' => $stmt->error];
    }

    public function login($username, $senha) {
        $query = "SELECT id, username, senha FROM " . $this->table . " WHERE username = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $usuario = $result->fetch_assoc();
        
        if (!$usuario || !password_verify($senha, $usuario['senha'])) {
            return ['success' => false, 'error' => 'Credenciais inválidas'];
        }
        
        // Iniciar sessão (simplificado)
        session_start();
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nome'] = $usuario['username'];
        
        return ['success' => true];
    }

    public function verificarAutenticacao() {
        session_start();
        return isset($_SESSION['usuario_id']);
    }

    public function logout() {
        session_start();
        session_unset();
        session_destroy();
    }
}
?>