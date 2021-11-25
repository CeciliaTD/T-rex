var trex, trex_correndo, trex_collided;
var solo, imagemDoSolo, soloInvisivel;
var numAleatorio, pontuacao;
var nuvem, imagemNuvem, grupoDeNuvens;
var obstaculo, imagemObstaculo1,imagemObstaculo2, imagemObstaculo3, imagemObstaculo4, imagemObstaculo5, imagemObstaculo6, randObstaculo, grupoDeObstaculos;
const JOGAR = 1;
const ENCERRAR = 0;
var estadoDoJogo = JOGAR;
var jump;
var die;
var checkPoint;
var gameOver, imagemGameOver;
var restart, imagemRestart;

function preload(){
  
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  imagemDoSolo = loadImage("ground2.png");
  imagemNuvem = loadImage("cloud.png");
  imagemObstaculo1 = loadImage("obstacle1.png");
  imagemObstaculo2 = loadImage("obstacle2.png");
  imagemObstaculo3 = loadImage("obstacle3.png");
  imagemObstaculo4 = loadImage("obstacle4.png");
  imagemObstaculo5 = loadImage("obstacle5.png");
  imagemObstaculo6 = loadImage("obstacle6.png");
  imagemGameOver = loadImage("gameOver.png");
  imagemRestart = loadImage("restart.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkPoint = loadSound("checkPoint.mp3");
  
}

function setup() {
  
  createCanvas(600, 200);
  trex = createSprite(35,150,20,50);
  trex.scale = 0.5;
  solo = createSprite(300,170,600,20);
  solo.addImage("ground", imagemDoSolo);
  
  //criando movimento de corrida
  trex.addAnimation("correndo", trex_correndo);
  solo.x = solo.width / 2;
  
  //criando solo invisível
  soloInvisivel =  createSprite(300,200,600,20);
  soloInvisivel.visible = false;
  numAleatorio = Math.round(random(1,100));

  pontuacao = 0;
  
  trex.addAnimation("collided", trex_collided);
  
  // criar grupos de obstáculos e nuvens
  grupoDeObstaculos = new Group();
  grupoDeNuvens = new Group();
  
  gameOver = createSprite(300,100);
  gameOver.addImage("gameOver.png", imagemGameOver);
  gameOver.scale = 0.5;
  
  restart = createSprite(300,130);
  restart.addImage("restart.png", imagemRestart);
  restart.scale = 0.5;
 
  // trex.setCollider("rectangle", 25,0, 200,50);
}
function draw(){
  
  background("white");
  text("Pontuação "+ pontuacao, 500, 50);
  trex.setCollider ("circle",0,0,40); 
  
  
  if(estadoDoJogo === JOGAR){
     pontuacao = Math.round(pontuacao + frameRate()/60);
    
     if(4+Math.round(pontuacao/100) >20){
       solo.velocityX = -20;
     }
    
     else{
       solo.velocityX = -(4+Math.round(pontuacao/100));
     }
    
     // condição para pular
    if((keyDown('up')||keyDown('space')) && trex.y >= 165){
      trex.velocityY = -10;
      jump.play();
    }

    if(solo.x < 0){
      solo.x = solo.width / 2;
    }

    // ação da gravidade
    trex.velocityY = trex.velocityY + 0.5;
    
    gerarNuvens();
    gerarObstaculos();
    
    if(grupoDeObstaculos.isTouching(trex)){
      estadoDoJogo = ENCERRAR;
      // trex.velocityY = -10;
      die.play();
    }
    
    if(pontuacao %100 == 0 && pontuacao !=0){
      checkPoint.play();
    }
    
    gameOver.visible = false;
    restart.visible = false;
  }
  else if(estadoDoJogo === ENCERRAR){
     solo.velocityX = 0;
     trex.velocityY = 0;
     trex.changeAnimation("collided");
    
     grupoDeObstaculos.setLifetimeEach(-1);
     grupoDeNuvens.setLifetimeEach(-1);
    
     grupoDeObstaculos.setVelocityXEach(0);
     grupoDeNuvens.setVelocityXEach(0);
    
     gameOver.visible = true;
     restart.visible = true;
     if(mousePressedOver(restart)){
       resetar();
     }
  }
  
  
  //barreira do chão
  trex.collide(soloInvisivel);

  drawSprites();
}

function resetar(){
  estadoDoJogo = JOGAR;
  pontuacao = 0;
  grupoDeObstaculos.destroyEach();
  grupoDeNuvens.destroyEach();
  trex.changeAnimation("correndo");
}


function gerarNuvens(){
  if(frameCount % 60 == 0){
    nuvem = createSprite(600,100,40,10);
    nuvem.addImage("nuvem", imagemNuvem);
    nuvem.scale = 0.6;
    nuvem.y = Math.round(random(30,80)  );
    nuvem.velocityX = -3; 
    //ajustando profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //tempo de vida
    nuvem.lifetime = 200;
    
    grupoDeNuvens.add(nuvem);
  }
}

function gerarObstaculos(){
  if(frameCount % 60 == 0){
    obstaculo = createSprite(600,165,10,40);
    
    if(6+Math.round(pontuacao/100) >20){
      obstaculo.velocityX = -20;
    }
    
    else{
      obstaculo.velocityX = -(6+Math.round(pontuacao/100));
    }
    
    // gerar obstáculos aleatórios
    
    randObstaculo = Math.round(random(1,6));
    
    switch(randObstaculo){
      case 1:
        obstaculo.addImage(imagemObstaculo1);
        break;
      case 2:
        obstaculo.addImage(imagemObstaculo2);
        break;
      case 3:
        obstaculo.addImage(imagemObstaculo3);
        break;
      case 4:
        obstaculo.addImage(imagemObstaculo4);
        break;  
      case 5:
        obstaculo.addImage(imagemObstaculo5);
        break;
      case 6:
        obstaculo.addImage(imagemObstaculo6);
        break;
      default: break;
    }
    
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 105;
    
    grupoDeObstaculos.add(obstaculo);
  }

}