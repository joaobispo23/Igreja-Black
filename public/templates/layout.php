<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Membros - Igreja</title>
    <link rel="stylesheet" href="../css/estilo-php.css">
</head>
<body>
    <header>
        <h1>Cadastro de Membros</h1>
        <div id="login-status">
            <span>Bem-vindo, <?php echo htmlspecialchars($_SESSION['usuario_nome']); ?></span>
            <a href="index.php?action=logout" class="btn-logout">Sair</a>
        </div>
    </header>

    <main>
        <?php if (isset($result['errors'])): ?>
            <div class="error-message">
                <?php foreach ($result['errors'] as $error): ?>
                    <p><?php echo htmlspecialchars($error); ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <?php if ($action === 'adicionar' || $action === 'editar'): ?>
            <section class="form-section">
                <h2><?php echo $action === 'adicionar' ? 'Novo Membro' : 'Editar Membro'; ?></h2>
                <form method="POST" action="index.php?action=<?php echo $action; ?>">
                    <?php if ($action === 'editar'): ?>
                        <input type="hidden" name="id" value="<?php echo $membroData['id']; ?>">
                    <?php endif; ?>
                    
                    <div class="form-group">
                        <label for="nome">Nome Completo*</label>
                        <input type="text" id="nome" name="nome" required 
                               value="<?php echo htmlspecialchars($membroData['nome'] ?? ''); ?>">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="data-nascimento">Data Nascimento</label>
                            <input type="date" id="data-nascimento" name="data_nascimento"
                                   value="<?php echo htmlspecialchars($membroData['data_nascimento'] ?? ''); ?>">
                        </div>
                        
                        <div class="form-group">
                            <label for="data-batismo">Data Batismo</label>
                            <input type="date" id="data-batismo" name="data_batismo"
                                   value="<?php echo htmlspecialchars($membroData['data_batismo'] ?? ''); ?>">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="telefone">Telefone</label>
                        <input type="tel" id="telefone" name="telefone"
                               value="<?php echo htmlspecialchars($membroData['telefone'] ?? ''); ?>">
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email"
                               value="<?php echo htmlspecialchars($membroData['email'] ?? ''); ?>">
                    </div>

                    <div class="form-group">
                        <label for="endereco">Endereço</label>
                        <textarea id="endereco" name="endereco" rows="3"><?php 
                            echo htmlspecialchars($membroData['endereco'] ?? ''); 
                        ?></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Salvar</button>
                        <a href="index.php" class="btn-secondary">Cancelar</a>
                    </div>
                </form>
            </section>
        <?php else: ?>
            <section class="list-section">
                <div class="section-header">
                    <h2>Lista de Membros</h2>
                    <a href="index.php?action=adicionar" class="btn-primary">+ Novo Membro</a>
                </div>
                
                <div class="search-box">
                    <input type="text" id="busca" placeholder="Buscar membros...">
                    <button id="btn-buscar">Buscar</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Email</th>
                                <th>Data Batismo</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($membros as $membro): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($membro['nome']); ?></td>
                                <td><?php echo htmlspecialchars($membro['telefone'] ?? '-'); ?></td>
                                <td><?php echo htmlspecialchars($membro['email'] ?? '-'); ?></td>
                                <td><?php echo $membro['data_batismo'] ? 
                                    date('d/m/Y', strtotime($membro['data_batismo'])) : '-'; ?></td>
                                <td class="actions">
                                    <a href="index.php?action=editar&id=<?php echo $membro['id']; ?>" 
                                       class="btn-primary btn-sm">Editar</a>
                                    <a href="index.php?action=excluir&id=<?php echo $membro['id']; ?>" 
                                       class="btn-danger btn-sm" 
                                       onclick="return confirm('Tem certeza que deseja excluir?')">Excluir</a>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </section>
        <?php endif; ?>
    </main>
</body>
</html>