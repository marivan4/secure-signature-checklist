
<?php
// Cabeçalhos obrigatórios
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Incluir arquivos de configuração
include_once '../config/database.php';

// Obter conexão com o banco de dados
$database = new Database();
$db = $database->getConnection();

// Verificar se o ID foi passado
$id = isset($_GET['id']) ? $_GET['id'] : die(json_encode(array("message" => "ID não fornecido.")));

// Consulta para obter um checklist
$query = "SELECT * FROM checklists WHERE id = ? LIMIT 0,1";
$stmt = $db->prepare($query);
$stmt->bindParam(1, $id);
$stmt->execute();

// Verificar se o checklist existe
if ($stmt->rowCount() > 0) {
    // Obter dados do checklist
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Criar array do checklist
    $checklist = array(
        "id" => $row['id'],
        "userId" => $row['user_id'],
        "cpfCnpj" => $row['cpf_cnpj'],
        "name" => $row['name'],
        "address" => $row['address'],
        "addressNumber" => $row['address_number'],
        "neighborhood" => $row['neighborhood'],
        "city" => $row['city'],
        "state" => $row['state'],
        "zipCode" => $row['zip_code'],
        "phone" => $row['phone'],
        "email" => $row['email'],
        "vehicleModel" => $row['vehicle_model'],
        "licensePlate" => $row['license_plate'],
        "trackerModel" => $row['tracker_model'],
        "trackerImei" => $row['tracker_imei'],
        "registrationDate" => $row['registration_date'],
        "installationLocation" => $row['installation_location'],
        "status" => $row['status'],
        "ipAddress" => $row['ip_address'],
        "signatureLink" => $row['signature_link'],
        "signedAt" => $row['signed_at'],
        "createdAt" => $row['created_at']
    );
    
    // Responder com sucesso
    http_response_code(200);
    echo json_encode($checklist);
} else {
    // Checklist não encontrado
    http_response_code(404);
    echo json_encode(array("message" => "Checklist não encontrado."));
}
?>
