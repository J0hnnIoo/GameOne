<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Controle Game One</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body id="bodyControle">
    <div id="controles">
        <div id="subcontroles">
           <p id="labelControle">CONTROLE:</p>
        </div>
        <div id="subcontroles">
            <button id="keyup">⬆</button>
        </div>
        <div id="subcontroles">
            <button id="keyleft">⬅</button>
            <button id="keydown">⬇</button>
            <button id="keyright">⮕</button>
        </div>
        <div id="subcontroles" style="margin-top: 20px;">
            <button id="keyspace" style="width: 306px;">X</button>
        </div>
        <div id="subcontroles" style="margin-top: 50px;">
            <a href="index.html"><button id="startButton" style="height: max-content; width: max-content; box-shadow: 0">Voltar e Jogar Sem Controle</button></a>
        </div>
    </div>
</body>
</html>
<script>
        const ws = new WebSocket('ws://127.0.0.1:8081');

        ws.onopen = () => {
            console.log("Conectado ao servidor WebSocket");
        };

        ws.onerror = (error) => {
            console.error("Erro no WebSocket:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket desconectado");
        };

        // Mapear os botões para as teclas correspondentes
        const buttonKeyMap = {
            keyup: 'ArrowUp',
            keyleft: 'ArrowLeft',
            keyright: 'ArrowRight',
            keydown: 'ArrowDown',
            keyspace: 'Space'
        };

        // Adicionar eventos de clique aos botões
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mousedown', () => {
                const key = buttonKeyMap[button.id];
                if (key) {
                    ws.send(JSON.stringify({ type: 'keydown', key }));
                }
            });
            button.addEventListener('mouseup', () => {
                const key = buttonKeyMap[button.id];
                if (key) {
                    ws.send(JSON.stringify({ type: 'keyup', key }));
                }
            });
        });
    </script>