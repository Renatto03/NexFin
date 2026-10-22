<?php

header('Content-Type: application/json; charset=utf-8');

$resposta = [
    "status" => "sucesso",
    "mensagem" => "API financeira funcionando!"
];

echo json_encode($resposta);