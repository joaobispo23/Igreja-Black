<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'igreja');

function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}

function createTables($conn) {
    $sql = [
        "CREATE TABLE IF NOT EXISTS membros (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            data_nascimento DATE,
            telefone VARCHAR(20),
            email VARCHAR(100),
            endereco TEXT,
            data_batismo DATE,
            status ENUM('ativo','inativo') DEFAULT 'ativo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )",
        
        "CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            senha VARCHAR(255) NOT NULL,
            nivel_acesso ENUM('admin','user') DEFAULT 'admin'
        )"
    ];

    foreach ($sql as $query) {
        if (!$conn->query($query)) {
            die("Error creating table: " . $conn->error);
        }
    }
}

// Criar conexão e tabelas se não existirem
$conn = getDBConnection();
createTables($conn);
?>