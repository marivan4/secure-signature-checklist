
<?php
// Cabeçalhos obrigatórios
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Incluir arquivos de configuração
include_once '../config/database.php';

// Obter conexão com o banco de dados
$database = new Database();
$db = $database->getConnection();

// Verificar tipo de usuário (opcional, via parâmetro)
$role = isset($_GET['role']) ? $_GET['role'] : '';
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : '';

// Construir a consulta
$query = "SELECT * FROM checklists";

// Se for um cliente, filtrar apenas os checklists desse usuário
if ($role === 'client' && !empty($user_id)) {
    $query .= " WHERE user_id = :user_id";
}

$query .= " ORDER BY created_at DESC";

// Preparar declaração
$stmt = $db->prepare($query);

// Bind de parâmetros se necessário
if ($role === 'client' && !empty($user_id)) {
    $stmt->bindParam(':user_id', $user_id);
}

// Executar a consulta
$stmt->execute();

// Verificar se há registros
if ($stmt->rowCount() > 0) {
    // Array de checklists
    $checklists_arr = array();
    
    // Recuperar os registros
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $checklist_item = array(
            "id" => $row['id'],
            "userId" => $row['user_id'],
            "cpfCnpj" => $row['cpf_cnpj'],
            "name" => $row['name'],
            "email" => $row['email'],
            "vehicleModel" => $row['vehicle_model'],
            "licensePlate" => $row['license_plate'],
            "trackerModel" => $row['tracker_model'],
            "trackerImei" => $row['tracker_imei'],
            "registrationDate" => $row['registration_date'],
            "status" => $row['status'],
            "createdAt" => $row['created_at']
        );
        
        array_push($checklists_arr, $checklist_item);
    }
    
    // Responder com sucesso
    http_response_code(200);
    echo json_encode($checklists_arr);
} else {
    // Nenhum checklist encontrado
    http_response_code(200);
    echo json_encode(array());
}
?>
