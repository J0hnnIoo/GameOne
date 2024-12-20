var PERSONAGEM_DIREITA = 1;
var PERSONAGEM_ESQUERDA = 2;
var PERSONAGEM_CIMA = 3;
var PERSONAGEM_BAIXO = 4;

var somPorta = new Audio('sounds/som_porta.wav');
var somEsconder = new Audio('sounds/som_esconder.wav');

function personagemPrincipal(context, teclado, imagem) {
  this.context = context;
  this.teclado = teclado;
  this.x = 0;
  this.y = 0;
  this.velocidade = 2;

  this.sheet = new spritesheet(context, imagem, 4, 4);
  this.sheet.intervalo = 80;

  this.andando = false;
  this.direcao = PERSONAGEM_BAIXO;
  this.interior = false;
  this.entrando = false;
  this.escondendo = false;
  this.escondido = false;
  this.podeCaminhar = false;

  this.xTemp = null;
  this.yTemp = null;
}

function colideComObstaculo(x, y, larguraSprite, alturaSprite) {
  let obstaculos = [];
  if (personagemPrincipal.interior) {
    obstaculos = [
      { x: 0, y: 0, width: 320, height: 320 }, //Inicial
      { x: 0, y: 0, width: 200, height: 520 }, //Max até TV
      { x: 0, y: 0, width: 150, height: 960 }, //Sofá de baixo
      { x: 0, y: 425, width: 360, height: 95 }, //Aquario
      { x: 0, y: 0, width: 1280, height: 210 }, //Parte de cima
      { x: 0, y: 0, width: 1600, height: 130 }, //Parte de cima tirando parte do lado da cama
      { x: 1390, y: 0, width: 200, height: 260 }, //Cama
      { x: 1440, y: 0, width: 260, height: 960 }, //Lateral direita
      { x: 325, y: 425, width: 40, height: 245 }, //Cadeiras Sala
      { x: 210, y: 610, width: 40, height: 60 }, //Mesa de centro
      { x: 0, y: 770, width: 690, height: 190 },  //Parte de baixo
      { x: 430, y: 695, width: 260, height: 200 }, //Armario
      { x: 590, y: 665, width: 100, height: 100 }, //Canto esquerdo antes do armario
      { x: 540, y: 0, width: 420, height: 305 }, // Abajur
      { x: 585, y: 0, width: 375, height: 410 }, // Cozinha
      { x: 640, y: 0, width: 100, height: 470 }, // Mesa Cozinha
      { x: 700, y: 0, width: 40, height: 515 }, // Banquinho Cozinha
      { x: 900, y: 395, width: 110, height: 230 }, //Canto Abajur vermelho
      { x: 1125, y: 395, width: 475, height: 240 }, //Parede entre mesa de jantar e quarto
      { x: 1180, y: 395, width: 475, height: 555 }, //Mesa de Jantar
      { x: 0, y: 930, width: 1600, height: 30 }, //Parte de baixo fora a fora
      { x: 690, y: 830, width: 50, height: 240 }, //Canto Esquerdo Spawn
      { x: 810, y: 830, width: 150, height: 240 }, //Canto Direito Spawn
      { x: 960, y: 880, width: 640, height: 240 }, //Depois do Canto direito Spawn
      { x: 19000, y: 19000, width: 2000, height: 2000 }, //LocalEscondido
    ];
  } else {
    obstaculos = [
      { x: 0, y: 0, width: 260, height: 340 },
      { x: 0, y: 0, width: 830, height: 220 },
      { x: 730, y: 0, width: 100, height: 340 },
      { x: 730, y: 270, width: 170, height: 70 },
      { x: 0, y: 340, width: 510, height: 10 },
      { x: 1280, y: 510, width: 320, height: 450 },
      { x: 1430, y: 480, width: 320, height: 300 },
      { x: 1100, y: 480, width: 200, height: 240 },
      { x: 1180, y: 920, width: 180, height: 80 },
      { x: 1430, y: 0, width: 320, height: 80 },
      { x: 1480, y: 0, width: 200, height: 200 },
      { x: 980, y: 160, width: 180, height: 60 },
      { x: 400, y: 600, width: 60, height: 50 },
      { x: 19000, y: 19000, width: 2000, height: 2000 }, //LocalEscondido
    ];
  }

  for (let obstaculo of obstaculos) {
    if (x < obstaculo.x + obstaculo.width &&
      x + larguraSprite > obstaculo.x &&
      y < obstaculo.y + obstaculo.height &&
      y + alturaSprite > obstaculo.y) {
      return false;
    }
  }
  return true;
}

function interacaoPorta(x, y, larguraSprite, alturaSprite) {
  let portas = [];
  if(personagemPrincipal.interior){
    portas = [
      { x: 700, y: 800, width: 200, height: 340 },
    ];
  }else{
    portas = [
      { x: 530, y: 0, width: 200, height: 340 },
    ];
  }

  for (let porta of portas) {
    if (x < porta.x + porta.width &&
      x + larguraSprite > porta.x &&
      y < porta.y + porta.height &&
      y + alturaSprite > porta.y) {
      return true;
    }
  }
  return false;
}

function interacaoSeEsconder(x, y, larguraSprite, alturaSprite) {
  let esconderijos = [];
  if(personagemPrincipal.interior){
    esconderijos = [
      { x: 150, y: 250, width: 100, height: 150 }, //Mesa de centro canto superior esquerdo
      { x: 130, y: 600, width: 50, height: 150 }, //Sofá canto inferior esquerdo
      { x: 450, y: 670, width: 60, height: 30 }, //Armario
      { x: 620, y: 350, width: 150, height: 160 }, //Mesa Cozinha
      { x: 1150, y: 550, width: 200, height: 340 }, //Mesa de Jantar
      { x: 1360, y: 0, width: 200, height: 300 }, //Cama
      { x: 19000, y: 19000, width: 2000, height: 2000 }, //LocalEscondido
    ];
  }else{
    esconderijos = [
      { x: 19000, y: 19000, width: 2000, height: 2000 }, //LocalEscondido
      { x: 1000, y: 200, width: 200, height: 90 }, //Caixote
    ];
  }

  for (let esconderijo of esconderijos) {
    if (x < esconderijo.x + esconderijo.width &&
      x + larguraSprite > esconderijo.x &&
      y < esconderijo.y + esconderijo.height &&
      y + alturaSprite > esconderijo.y) {
      return true;
    }
  }
  return false;
}
personagemPrincipal.prototype = {
  atualizar: function () {
    if(this.escondido){
        this.context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.context.fillRect(0, 0, 1600, 960);
    }
    if (this.teclado.pressionada(SETA_DIREITA) && this.x < this.context.canvas.width - 60 && colideComObstaculo(this.x + this.velocidade, this.y, 60, 90) && this.podeCaminhar) {
      if (!this.andando || this.direcao != PERSONAGEM_DIREITA) {
        this.sheet.linha = 1;
        this.sheet.coluna = 0;
      }

      this.andando = true;
      this.direcao = PERSONAGEM_DIREITA;

      this.sheet.proximoQuadro();

      this.x += this.velocidade;
    } else if (this.teclado.pressionada(SETA_ESQUERDA) && this.x > this.context.canvas.width - this.context.canvas.width && colideComObstaculo(this.x - this.velocidade, this.y, 60, 90) && this.podeCaminhar) {
      if (!this.andando || this.direcao != PERSONAGEM_ESQUERDA) {
        this.sheet.linha = 2;
        this.sheet.coluna = 0;
      }

      this.andando = true;
      this.direcao = PERSONAGEM_ESQUERDA;
      this.sheet.proximoQuadro();
      this.x -= this.velocidade;
    } else if (this.teclado.pressionada(SETA_CIMA) && this.y > this.context.canvas.height - this.context.canvas.height && colideComObstaculo(this.x, this.y - this.velocidade, 60, 90) && this.podeCaminhar) {
      if (!this.andando || this.direcao != PERSONAGEM_CIMA) {
        this.sheet.linha = 3;
        this.sheet.coluna = 0;
      }

      this.andando = true;
      this.direcao = PERSONAGEM_CIMA;
      this.sheet.proximoQuadro();
      this.y -= this.velocidade;
    } else if (this.teclado.pressionada(SETA_BAIXO) && this.y < this.context.canvas.height - 90 && colideComObstaculo(this.x, this.y + this.velocidade, 60, 90) && this.podeCaminhar) {
      if (!this.andando || this.direcao != PERSONAGEM_BAIXO) {
        this.sheet.linha = 0;
        this.sheet.coluna = 0;
      }

      this.andando = true;
      this.direcao = PERSONAGEM_BAIXO;
      this.sheet.proximoQuadro();
      this.y += this.velocidade;
    } else if (this.teclado.pressionada(ESPACO) && (interacaoPorta(this.x, this.y, 60, 90) || interacaoSeEsconder(this.x, this.y, 60, 90)) && this.podeCaminhar) {
      if(interacaoPorta(this.x, this.y, 60, 90)){
        if(this.entrando == false){
          this.entrando = true;
          if(this.interior){
            document.getElementById('canvas').style.backgroundImage = 'url(assets/CenarioExterior.jpeg)';
            this.x = 585;
            this.y = 240;
            this.direcao = PERSONAGEM_BAIXO;
            this.interior = false;
            somPorta.play();
          }else{
            document.getElementById('canvas').style.backgroundImage = 'url(assets/CenarioInterior.jpg)';
            this.x = 740;
            this.y = 820;
            this.direcao = PERSONAGEM_CIMA;
            this.interior = true;
            somPorta.play();
          }
          
        }
      }else{
        if(this.escondendo == false){
          this.escondendo = true;
          somEsconder.play();
          if(this.escondido){
            window.tempoEscondido = 0;
            this.escondido = false;
            this.x = this.xTemp;
            this.y = this.yTemp;
          }else{
            this.escondido = true;
            window.tempoEscondido = window.segundos;
            this.xTemp = this.x;
            this.yTemp = this.y;
            this.x = 20000;
            this.y = 20000;
          }
        }
      }
    } else {
      //AQUI SETA DE ACORDO COM A COLUNA DO PERSONAGEM PARADO EM CADA DIRECAO
      if (this.direcao == PERSONAGEM_DIREITA) {
        this.sheet.coluna = 3; this.sheet.linha = 1;
      }
      else if (this.direcao == PERSONAGEM_ESQUERDA) {
        this.sheet.coluna = 3; this.sheet.linha = 2;
      }
      else if (this.direcao == PERSONAGEM_CIMA) {
        this.sheet.coluna = 3; this.sheet.linha = 3;
      }
      else if (this.direcao == PERSONAGEM_BAIXO) {
        this.sheet.coluna = 3; this.sheet.linha = 0;
      }

      this.andando = false;
      this.entrando = false;
      this.escondendo = false;
    }
  },
  desenhar: function () {
    this.sheet.desenhar(this.x, this.y);
  },
};
