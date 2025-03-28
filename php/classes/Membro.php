<?php
require_once __DIR__ . '/../config/database.php';

class Membro {
    private $conn;
    private $table = 'membros';

    public $id;
    public $nome;
    public $data_nascimento;
    public $telefone;
    public $email;
    public $endereco;
    public $data_batismo;
    public $status;
    public $created_at;

    public function __construct() {
        $this->conn = getDBConnection();
    }

    public function validar() {
        $errors = [];
        
        if (empty($this->nome)) {
            $errors[] = 'Nome é obrigatório';
        }
        
        if (!empty($this->email) && !filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email inválido';
        }
        
        return $errors;
    }

    public function criar() {
        $errors = $this->validar();
        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        $query = "INSERT INTO " . $this->table . " 
                  SET nome=?, data_nascimento=?, telefone=?, email=?, 
                  endereco=?, data_batismo=?, status=?";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bind_param(
            "sssssss", 
            $this->nome,
            $this->data_nascimento,
            $this->telefone,
            $this->email,
            $this->endereco,
            $this->data_batismo,
            $this->status
        );
        
        if ($stmt->execute()) {
            $this->id = $this->conn->insert_id;
            return ['success' => true, 'id' => $this->id];
        }
        
        return ['success' => false, 'error' => $stmt->error];
    }

    public function listar() {
        $query = "SELECT * FROM " . $this->table . " WHERE status = 'ativo'";
        $result = $this->conn->query($query);
        
        $membros = [];
        while ($row = $result->fetch_assoc()) {
            $membros[] = $row;
        }
        
        return $membros;
    }

    public function buscarPorId($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function atualizar() {
        $query = "UPDATE " . $this->table . " 
                 SET nome=?, data_nascimento=?, telefone=?, email=?, 
                 endereco=?, data_batismo=?, status=?
                 WHERE id=?";
        
        $stmt = $this->conn->prepare($query);
        
        $stmt->bind_param(
            "sssssssi", 
            $this->nome,
            $this->data_nascimento,
            $this->telefone,
            $this->email,
            $this->endereco,
            $this->data_batismo,
            $this->status,
            $this->id
        );
        
        if ($stmt->execute()) {
            return ['success' => true];
        }
        
        return ['success' => false, 'error' => $stmt->error];
    }

    public function excluir($id) {
        $query = "UPDATE " . $this->table . " SET status = 'inativo' WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            return ['success' => true];
        }
        
        return ['success' => false, 'error' => $stmt->error];
    }
}
?>