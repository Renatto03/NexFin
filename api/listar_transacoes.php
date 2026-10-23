<?php

header("content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/conexao.php";

try {
    $sql = "SELECT id, descricao, valor, tipo, categoria, data_transacao
    FROM transacoes 
    ORDER BY id DESC";

    $comando = $pdo->prepare($sql);
    $comando->execute();

    $transacoes = $comando->fetchALL(
        PDO::FETCH_ASSOC
    );
    
     echo json_encode($transacoes);

    } catch (PDOException $erro) {
    error_log($erro->getMessage());

    http_response_code(500);

    echo json_encode([
        "erro" => "Erro ao consultar transações"
    ]);

}