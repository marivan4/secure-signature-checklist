
<?php
// Cabeçalhos obrigatórios
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir arquivos de configuração
include_once './config/database.php';

// Obter dados enviados
$data = json_decode(file_get_contents("php://input"));

// Verificar se os dados estão completos
if (!empty($data->username) && !empty($data->password)) {
    
    // Obter conexão com o banco de dados
    $database = new Database();
    $db = $database->getConnection();
    
    // Verificar se o usuário existe
    $query = "SELECT id, username, password, role, parent_id, created_at FROM users WHERE username = :username LIMIT 0,1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $row['id'];
        $username = $row['username'];
        $password = $row['password'];
        $role = $row['role'];
        $parent_id = $row['parent_id'];
        $created_at = $row['created_at'];
        
        // Verificar senha
        // Para simplificar, estamos verificando diretamente neste exemplo
        // Em produção, você deve usar password_verify se estiver usando hash
        if ($data->password == $password) {
            
            // Criar array de resposta
            $response = array(
                "id" => $id,
                "username" => $username,
                "role" => $role,
                "parentId" => $parent_id,
                "createdAt" => $created_at
            );
            
            // Responder com sucesso
            http_response_code(200);
            echo json_encode($response);
        } else {
            // Senha incorreta
            http_response_code(401);
            echo json_encode(array("message" => "Credenciais inválidas"));
        }
    } else {
        // Usuário não encontrado
        http_response_code(401);
        echo json_encode(array("message" => "Credenciais inválidas"));
    }
} else {
    // Dados incompletos
    http_response_code(400);
    echo json_encode(array("message" => "Dados incompletos. Username e password são obrigatórios."));
}
?>
