var SETA_ESQUERDA = 37;
var SETA_DIREITA = 39;
var SETA_CIMA = 38;
var SETA_BAIXO = 40;
var ESPACO = 32;

function teclado(elemento) {
    this.elemento = elemento;

    this.pressionadas = [];

    this.disparadas = [];

    this.funcoesDisparo = [];

    var teclado = this;
    const ws = new WebSocket("ws://127.0.0.1:8081");
    ws.onopen = () => {
        console.log("Conectado ao servidor WebSocket");
    };

    ws.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
    };

    ws.onclose = () => {
        console.log("WebSocket desconectado");
    };

    ws.onmessage = (event) => {
        if (event.data != "") {
            const message = JSON.parse(event.data);
            var tecla = message.keyCode;
            if (message.key === "ArrowUp") {
                tecla = SETA_CIMA;
            }
            if (message.key === "ArrowDown") {
                tecla = SETA_BAIXO;
            }
            if (message.key === "ArrowRight") {
                tecla = SETA_DIREITA;
            }
            if (message.key === "ArrowLeft") {
                tecla = SETA_ESQUERDA;
            }
            if (message.key === "Space") {
                tecla = ESPACO;
            }

            if (message.type === "keydown") {

                teclado.pressionadas[tecla] = true;

                // Disparar somente se for o primeiro keydown da tecla
                if (teclado.funcoesDisparo[tecla] && !teclado.disparadas[tecla]) {

                    teclado.disparadas[tecla] = true;
                    teclado.funcoesDisparo[tecla]();
                }
            }

            if (message.type === "keyup") {
                teclado.pressionadas[tecla] = false;
                teclado.disparadas[tecla] = false;
            }
        }
    };

    elemento.addEventListener('keydown', function (evento) {
        var tecla = evento.keyCode;  // Tornando mais legível ;)
        teclado.pressionadas[tecla] = true;

        // Disparar somente se for o primeiro keydown da tecla
        if (teclado.funcoesDisparo[tecla] && !teclado.disparadas[tecla]) {

            teclado.disparadas[tecla] = true;
            teclado.funcoesDisparo[tecla]();
        }

        elemento.addEventListener('keyup', function (evento) {
            teclado.pressionadas[evento.keyCode] = false;
            teclado.disparadas[evento.keyCode] = false;
        });
    });
}
teclado.prototype = {
    pressionada: function (tecla) {
        return this.pressionadas[tecla];
    },
    disparou: function (tecla, callback) {
        this.funcoesDisparo[tecla] = callback;
    }
}