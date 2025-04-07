
<?php
// Verify that React build files are correctly deployed
header('Content-Type: text/html; charset=UTF-8');

// Define required asset directories
$assetDirs = [
    'assets',
    'assets/js',
    'assets/css'
];

// Define required asset files
$requiredFiles = [
    'assets/index.js',
    'assets/index.css'
];

echo "<!DOCTYPE html>
<html lang='pt-BR'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Track'n'Me - Verificação de Build</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #5D3FD3;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        h2 {
            margin-top: 30px;
            color: #444;
        }
        .success {
            color: #27ae60;
        }
        .error {
            color: #e74c3c;
        }
        .item {
            margin-bottom: 5px;
        }
        .instructions {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #5D3FD3;
            margin-top: 20px;
        }
        pre {
            background-color: #f1f1f1;
            padding: 10px;
            overflow: auto;
        }
    </style>
</head>
<body>
    <h1>Track'n'Me - Verificação de Build</h1>";

// Check if asset directories exist, create if not
echo "<h2>Diretórios de Assets</h2>";
$allDirsExist = true;

foreach ($assetDirs as $dir) {
    $dirPath = __DIR__ . '/' . $dir;
    $exists = is_dir($dirPath);
    
    echo "<div class='" . ($exists ? 'success' : 'error') . "'>" . 
        ($exists ? '✓' : '✗') . " $dir - " . 
        ($exists ? 'Existe' : 'Não existe') . "</div>";
    
    if (!$exists) {
        $allDirsExist = false;
        // Try to create directory
        if (mkdir($dirPath, 0755, true)) {
            echo "<div class='success'>✓ Diretório $dir criado</div>";
        } else {
            echo "<div class='error'>✗ Falha ao criar diretório $dir</div>";
        }
    }
}

// Check if required files exist
echo "<h2>Arquivos de Build</h2>";
$allFilesExist = true;

foreach ($requiredFiles as $file) {
    $filePath = __DIR__ . '/' . $file;
    $exists = file_exists($filePath);
    
    echo "<div class='" . ($exists ? 'success' : 'error') . "'>" . 
        ($exists ? '✓' : '✗') . " $file - " . 
        ($exists ? 'Existe' : 'Não existe') . "</div>";
    
    if (!$exists) {
        $allFilesExist = false;
    }
}

// Instructions for deploying React build
echo "<div class='instructions'>";
echo "<h2>Como implementar os arquivos de build do React:</h2>";
echo "<ol>";
echo "<li>Execute <code>npm run build</code> no diretório raiz do projeto React</li>";
echo "<li>Copie os arquivos gerados na pasta <code>dist</code> para o diretório <code>/var/www/html/fatura/public</code></li>";
echo "<li>Verifique se os arquivos principais (JS e CSS) estão em <code>/var/www/html/fatura/public/assets/</code></li>";
echo "<li>Certifique-se de que o arquivo <code>index.html</code> no diretório raiz aponta corretamente para esses arquivos</li>";
echo "</ol>";

if (!$allFilesExist) {
    echo "<h3>Comando para copiar arquivos de build (exemplo):</h3>";
    echo "<pre>
# No diretório do projeto React:
npm run build

# Copiar arquivos para o servidor:
scp -r dist/* usuario@servidor:/var/www/html/fatura/public/

# OU manualmente:
1. Baixe os arquivos do build
2. Faça upload para o servidor via FTP
3. Certifique-se de que os arquivos estão nos locais corretos
</pre>";
}

echo "</div>";

// Link to system check
echo "<p><a href='/system-check.php' style='display: inline-block; padding: 10px 20px; background: #5D3FD3; color: white; text-decoration: none; border-radius: 4px; margin-top: 20px;'>Voltar para Verificação do Sistema</a></p>";

echo "</body></html>";
?>
