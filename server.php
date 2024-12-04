<?php

$host = '127.0.0.1';
$port = '8081';
set_time_limit(5000);

$serverSocket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_bind($serverSocket, $host, $port);
socket_listen($serverSocket);

echo "Servidor WebSocket rodando em ws://$host:$port...\n";

$clientes = [$serverSocket];

function performHandshaking($clienteSocket, $headers) {
    $upgrade = "HTTP/1.1 101 Switching Protocols\r\n" .
        "Upgrade: websocket\r\n" .
        "Connection: Upgrade\r\n" .
        "Sec-WebSocket-Accept: " . base64_encode(sha1($headers['Sec-WebSocket-Key'] . '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', true)) . "\r\n\r\n";
        socket_write($clienteSocket, $upgrade, strlen($upgrade));
}

function decodeWebSocketMessage($data): string {
    $unpacked = unpack('C*', $data);
    $length = $unpacked[2] & 127;

    if ($length === 126) {
        $masks = array_slice($unpacked, 4, 4);
        $data = array_slice($unpacked, 8);
    } elseif ($length === 127) {
        $masks = array_slice($unpacked, 10, 4);
        $data = array_slice($unpacked, 14);
    } else {
        $masks = array_slice($unpacked, 2, 4);
        $data = array_slice($unpacked, 6);
    }

    $message = '';
    foreach ($data as $key => $byte) {
        $message .= chr($byte ^ $masks[$key % 4]);
    }

    return $message;
}

function encodeWebSocketMessage($message): string {
    $header = " ";
    $header[0] = chr(129);
    $length = strlen($message);

    if ($length <= 125) {
        $header[1] = chr($length);
    } elseif ($length >= 126 && $length <= 65535) {
        $header[1] = chr(126);
        $header .= pack('n', $length);
    } else {
        $header[1] = chr(127);
        $header .= pack('J', $length);
    }

    return $header . $message;
}

while (true) {
    $readSocket = $clientes;
    $writeSocket = null;
    $exceptSocket = null;

    socket_select($readSocket, $writeSocket, $exceptSocket, 0, 10);

    if (in_array($serverSocket, $readSocket)) {
        $newSocket = socket_accept($serverSocket);
        $clientes[] = $newSocket;

        $header = [];
        $request = socket_read($newSocket, 1024);
        if (preg_match("/Sec-WebSocket-Key: (.*)\r\n/", $request, $matches)) {
            $header['Sec-WebSocket-Key'] = trim($matches[1]);
        }
        performHandshaking($newSocket, $header);

        echo "Novo cliente conectado\n";
        unset($readSocket[array_search($serverSocket, $readSocket)]);
    }

    foreach ($readSocket as $socket) {
        $data = @socket_read($socket, 1024, PHP_BINARY_READ);

        if ($data === false) {
            // Cliente desconectado
            echo "Cliente desconectado.\n";
            unset($clientes[array_search($socket, $clientes)]);
            socket_close($socket);
            continue;
        }

        $message = decodeWebSocketMessage($data);
        echo "Mensagem recebida: $message\n";

        // Repassar a mensagem para todos os clientes conectados
        $encodedMessage = encodeWebSocketMessage($message);
        foreach ($clientes as $client) {
            if ($client !== $serverSocket && $client !== $socket) {
                @socket_write($client, $encodedMessage, strlen($encodedMessage));
            }
        }
    }
}

socket_close($serverSocket);
?>