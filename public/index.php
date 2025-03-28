<?php
require_once __DIR__ . '/../php/config/database.php';
require_once __DIR__ . '/../php/classes/Membro.php';
require_once __DIR__ . '/../php/classes/Auth.php';

// Iniciar sessão
session_start();

// Rotas básicas
$action = $_GET['action'] ?? 'listar';

// Verificar autenticação para ações protegidas
$auth = new Auth();
$protectedActions = ['listar', 'adicionar', 'editar', 'excluir'];

if (in_array($action, $protectedActions) && !$auth->verificarAutenticacao()) {
    header('Location: login.php');
    exit;
}

// Processar ações
$membro = new Membro();
$result = [];

switch ($action) {
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $result = $auth->login($_POST['username'], $_POST['senha']);
            if ($result['success']) {
                header('Location: index.php');
                exit;
            }
        }
        break;
        
    case 'logout':
        $auth->logout();
        header('Location: login.php');
        exit;
        
    case 'adicionar':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $membro->nome = $_POST['nome'];
            $membro->data_nascimento = $_POST['data_nascimento'] ?? null;
            $membro->telefone = $_POST['telefone'] ?? null;
            $membro->email = $_POST['email'] ?? null;
            $membro->endereco = $_POST['endereco'] ?? null;
            $membro->data_batismo = $_POST['data_batismo'] ?? null;
            $membro->status = 'ativo';
            
            $result = $membro->criar();
            if ($result['success']) {
                header('Location: index.php');
                exit;
            }
        }
        break;
        
    case 'editar':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $membro->id = $_POST['id'];
            $membro->nome = $_POST['nome'];
            $membro->data_nascimento = $_POST['data_nascimento'] ?? null;
            $membro->telefone = $_POST['telefone'] ?? null;
            $membro->email = $_POST['email'] ?? null;
            $membro->endereco = $_POST['endereco'] ?? null;
            $membro->data_batismo = $_POST['data_batismo'] ?? null;
            $membro->status = $_POST['status'] ?? 'ativo';
            
            $result = $membro->atualizar();
            if ($result['success']) {
                header('Location: index.php');
                exit;
            }
        } else {
            $membroData = $membro->buscarPorId($_GET['id']);
        }
        break;
        
    case 'excluir':
        $result = $membro->excluir($_GET['id']);
        header('Location: index.php');
        exit;
}

// Obter lista de membros
$membros = $membro->listar();

// Incluir template apropriado
if ($action === 'login') {
    include 'templates/login.php';
} else {
    include 'templates/layout.php';
}
?>