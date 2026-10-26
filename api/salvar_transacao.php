<?php

header ("Content-Type: application/json; charset=utf-8");

require_once_DIR_ . "/conexao.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido"]);
    exit;
}

$dados = json_decode(file_get_contents ("php://input"), true);

$descricao = trim($dados["descricao"] ?? "");
$valor = $dados["valor"] ?? null;
$tipo = $dados["tipo"] ?? "";

if (
    $descricao === "" ||
    strlen($descricao) > 255 ||
    !is_numeric($valor) ||
    $valor <= 0 ||
    !in_array($tipo, ["receita", "despesa"], true)
) {
    http_response_code(400)
    echo json_encode(["erro" => "Dados inválidos"]);
    exit;
}

try {
    $sql = "INSERT INTO transacoes (descricao, valor, tipo, data_transacao)
    VALUES (:descricao, :valor, :tipo, CURDATE())";

    $comando = $pdo->prepare($sql);

    $comando->execute([
        ":descricao" => $descricao,
        ":valor" => $valor,
        ":tipo" => $tipo
    ]);

    echo json_encode([
        "status" => "sucesso",
        "id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $erro) {
    error_log($erro->getMessage());
    http_response_code(500);
    echo json_encode(["erro" => "Erro ao salvar transação"]);
}