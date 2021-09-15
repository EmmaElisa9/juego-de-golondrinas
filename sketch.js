//Una sola golondrina puede llegar a consumir alrededor de 850 moscas y mosquitos al día.

//estados de juego
var START = 0;
var Tutorial = 1;
var PLAY = 2;
var END = 3;
var ganar = 4;
var gameState = PLAY;

var iniciar,iniciarIMG;

//nube
var nube, nubeIMG;

//golondrina
var golondrina, golondrinaIMG, golondrinaPerderIMG;
//imagen de insecto
var insectoIMG;


//imagen pelota
var balon, pelota1, pelota2, pelota3;

//reiniciar
var reinicio,reinicioIMG,gameOver,gameOverIMG, Perder;

//variable de puntuador
var score;

//grupo de insectos y grupo de balones
var insectosGroup, balonesGroup,nubeGroup;

function preload(){
  //carga la animacion de la golondrina
  golondrinaIMG = loadAnimation("golondrina juego.png","golondrina juego2.png","golondrina juego3.png");
  
  golondrinaPerderIMG = loadAnimation("golondrina juego perder.png");
  
  //carga la animacion del insecto
  insectoIMG = loadAnimation("mosca 1 - copia.png","mosca 2 - copia.png");
  
  //carga la imagen del fondo
  nubeIMG = loadImage("nubeTransparente.png");
  
  //carga la imagen de las pelotas
  pelota1 = loadImage("Imported piskel(1).gif");
  pelota2 = loadImage("Imported piskel(2).gif");
  pelota3 = loadImage("Imported piskel(3).gif");
  
  Perder = loadSound("die.mp3");
  
  reinicioIMG = loadImage("vendita.png");
  gameOverIMG = loadImage("gameOver-1.png");
}

function setup() {
  //crea lienzo
  createCanvas(windowWidth,windowHeight);
  
  //crea el sprite de la golondrina y añade animación;
  golondrina = createSprite(width-50,height/2);
  golondrina.addAnimation("pajaro", golondrinaIMG);
  golondrina.addAnimation("pajaroPerder", golondrinaPerderIMG);
  golondrina.scale = 0.4;
  golondrina.setCollider ("circle",-100,0,45);
  
  //crea la sprite del boton de reinicio
  reinicio  = createSprite(width/2,height/2);
  reinicio.setCollider("rectangle",-40,-33,138,40);
  reinicio.addImage(reinicioIMG);
  
  gameOver = createSprite(width/2,height/2-100);
  gameOver.addImage(gameOverIMG);
  gameOver.scale=0.5;
    
  insectosGroup = createGroup();
  balonesGroup = createGroup();
  nubeGroup = createGroup();
  
  score = 0;
}


function draw() {
  background(rgb(160,220,234));
  
  text("insectos: "+ score,width/20,width/20);
  
  
  if (gameState === PLAY){
    golondrina.y = World.mouseY;
    
    insectos();
    balones();
    nubes();
    
    reinicio.visible = false;
    gameOver.visible = false;
    
    if (golondrina.isTouching(insectosGroup)){
      score=score+1;
      insectosGroup.destroyEach();
    }
    
    if(frameCount % (width*3) === 0){
       score = score-1;
    } 
    
    if (golondrina.isTouching(balonesGroup) || score < 0){
        gameState = END;
        golondrina.changeAnimation("pajaroPerder", golondrinaPerderIMG);
        Perder.play();
    }
    
  }
  else if(gameState === END){
      
        fill(rgb(10,10,200));
        textSize(20);
        text ("presiona la bandita para volver a jugar",width/20+80,width/20);
    
        reinicio.visible = true;
        gameOver.visible = true;
    
        insectosGroup.setLifetimeEach(-1);
        balonesGroup.setLifetimeEach(-1);
        nubeGroup.setLifetimeEach(-1);
        balonesGroup.setVelocityXEach(0);
        insectosGroup.setVelocityXEach(0);
        nubeGroup.setVelocityXEach(0);
    
     //aqui es donde lo quiero poner
      if (touches.length > 0 || mousePressedOver(reinicio)){
          reiniciar();
          touches = [];
      }
      
    }
  
  //dibuja las sprites
  drawSprites();
}

function reiniciar(){
  gameState = PLAY;
  
  golondrina.changeAnimation("pajaro", golondrinaIMG);
  
  balonesGroup.destroyEach();
  insectosGroup.destroyEach();
  nubeGroup.destroyEach();
  
  score = 0;
}

function insectos() {

  if (frameCount % 250 === 0) {
    //crea el insecto y añade animación
    var insecto = createSprite (10, 300);
    insecto.addAnimation("mosca", insectoIMG);
    insecto.scale = 0.4;
    insecto.velocityX = (4+(score/5));
    insecto.y = Math.round(random(0,height*2));
    
    insecto.setCollider ("circle",-180,-260,30);
    
    insecto.lifetime = width;
    
    insectosGroup.add(insecto);
  }
}

function balones(){
  if (frameCount % 150 === 0){
    //crea el balon
    balon = createSprite(30,300);
    balon.velocityX = (8+(score/5));
    balon.setCollider("circle",-250,-215,40);
    balon.y = Math.round(random(height-height,height*2));
    
    //crea una variable que me da un numero aleatorio entre uno y 4
    var aleatorio = Math.round(random(1,3));
    switch(aleatorio) {
      case 1: balon.addImage(pelota1);
              break;
      case 2: balon.addImage(pelota2);
              break;
      case 3: balon.addImage(pelota3);
              break;
      default: break; 
    }
    
    balon.scale = 0.8;
    balon.lifetime = width;
    
    balon.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 2;
    
    balon.depth = reinicio.depth;
    reinicio.depth = reinicio.depth + 2;
    
    balonesGroup.add(balon);
  }   
}

function nubes() {
  if (frameCount % 200 === 0){
    //crea la nube y añade su imagen
    nube = createSprite(width-width,Math.round(random(0,height+height)));
    nube.addImage(nubeIMG);
    nube.scale = random(0.3,1);
    nube.velocityX = (5+(score/5));
    
    balon.depth = nube.depth;
    nube.depth = nube.depth + 2;
    
    nube.depth = reinicio.depth;
    reinicio.depth = reinicio.depth + 2;
    
    nube.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 2;
    
    
    nubeGroup.add(nube);
  }
}