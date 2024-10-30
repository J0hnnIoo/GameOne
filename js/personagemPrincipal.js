var PERSONAGEM_DIREITA = 1;
var PERSONAGEM_ESQUERDA = 2;
var PERSONAGEM_CIMA = 3;
var PERSONAGEM_BAIXO = 4;

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
}

personagemPrincipal.prototype = {
  atualizar: function () {
    if (this.teclado.pressionada(SETA_DIREITA) && this.x < this.context.canvas.width - 60) {
      // Se já não estava neste estado...
      if (!this.andando || this.direcao != PERSONAGEM_DIREITA) {
        // Seleciono o quadro da spritesheet
        //TODO setar respectivamente com o sprite
        this.sheet.linha = 1;
        this.sheet.coluna = 0;
      }

      // Configuro o estado atual
      this.andando = true;
      this.direcao = PERSONAGEM_DIREITA;

      // Neste estado, a animação da spritesheet deve rodar
      this.sheet.proximoQuadro();

      // Desloco o Sonic
      this.x += this.velocidade;
    } else if (this.teclado.pressionada(SETA_ESQUERDA) && this.x > this.context.canvas.width - this.context.canvas.width) {
      if (!this.andando || this.direcao != PERSONAGEM_ESQUERDA) {
        this.sheet.linha = 2; 
        this.sheet.coluna = 0;
      }

      this.andando = true;
      this.direcao = PERSONAGEM_ESQUERDA;
      this.sheet.proximoQuadro();
      this.x -= this.velocidade;
    } else if (this.teclado.pressionada(SETA_CIMA) && this.y > this.context.canvas.height - this.context.canvas.height) {
      if (!this.andando || this.direcao != PERSONAGEM_CIMA) {
        this.sheet.linha = 3; 
        this.sheet.coluna = 0;
      }

      this.andando = true;
      this.direcao = PERSONAGEM_CIMA;
      this.sheet.proximoQuadro();
      this.y -= this.velocidade; 
    } else if (this.teclado.pressionada(SETA_BAIXO) && this.y < this.context.canvas.height - 90) {
      if (!this.andando || this.direcao != PERSONAGEM_BAIXO) {
        this.sheet.linha = 0; 
        this.sheet.coluna = 0;
      }

      this.andando = true;
      this.direcao = PERSONAGEM_BAIXO;
      this.sheet.proximoQuadro();
      this.y += this.velocidade; 
    } else {
        //AQUI SETA DE ACORDO COM A COLUNA DO PERSONAGEM PARADO EM CADA DIRECAO
      if (this.direcao == PERSONAGEM_DIREITA) {
        this.sheet.coluna = 3 ; this.sheet.linha = 1;
      }
      else if (this.direcao == PERSONAGEM_ESQUERDA){
        this.sheet.coluna = 3 ; this.sheet.linha = 2;
      } 
      else if (this.direcao == PERSONAGEM_CIMA) {
        this.sheet.coluna = 3 ; this.sheet.linha = 3;
      }
      else if (this.direcao == PERSONAGEM_BAIXO) {
        this.sheet.coluna = 3; this.sheet.linha = 0;
      }

      this.andando = false;
    }
  },
  desenhar: function () {
    this.sheet.desenhar(this.x, this.y);
  },
};
