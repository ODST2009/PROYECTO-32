const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var player, playerBase;
var computer, computerBase;

var playerArrows = [];
var computerArrows = [];
var playerArcherLife = 3;
var computerArcherLife = 3;

function preload() {
  backgroundImg = loadImage("assets/background.gif");  // Imagen de fondo
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, random(450, height - 300), 180, 150);
  player = new Player(285, playerBase.body.position.y - 153, 50, 180);
  playerArcher = new PlayerArcher(
    340,
    playerBase.body.position.y - 180,
    120,
    120
  );

  computerBase = new ComputerBase(
    width - 300,
    random(450, height - 300),
    180,
    150
  );
  computer = new Computer(
    width - 280,
    computerBase.body.position.y - 153,
    50,
    180
  );
  computerArcher = new ComputerArcher(
    width - 340,
    computerBase.body.position.y - 180,
    120,
    120
  );

  // función para administrar las flechas de la computadora
  handleComputerArcher();
}

function draw() {
  background(backgroundImg);  // Mostrar la imagen de fondo

  Engine.update(engine);

  // Título
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("TIRO CON ARCO ÉPICO", width / 2, 100);

  // Mostrar jugadores, bases y vidas
  playerBase.display();
  player.display();
  player.life();

  computerBase.display();
  computer.display();
  computer.life();

  playerArcher.display();
  computerArcher.display();

  // Mostrar flechas del jugador
  for (var i = 0; i < playerArrows.length; i++) {
    showArrows(i, playerArrows);
    handlePlayerArrowCollision(i);  // Llamar colisión de flechas del jugador
  }

  // Mostrar flechas de la computadora
  for (var i = 0; i < computerArrows.length; i++) {
    showArrows(i, computerArrows);
    handleComputerArrowCollision(i);  // Llamar colisión de flechas de la computadora
  }

  // Mostrar vidas de los jugadores
  fill("white");
  textSize(20);
  text("Vida Jugador: " + playerArcherLife, 100, 50);
  text("Vida Computadora: " + computerArcherLife, width - 300, 50);
}

function keyPressed() {
  if (keyCode === 32) {  // Barra espaciadora
    var posX = playerArcher.body.position.x;
    var posY = playerArcher.body.position.y;
    var angle = playerArcher.body.angle + PI / 2;

    var arrow = new PlayerArrow(posX, posY, 100, 10);
    arrow.trajectory = [];
    Matter.Body.setAngle(arrow.body, angle);
    playerArrows.push(arrow);
  }
}

function keyReleased() {
  if (keyCode === 32) {  // Barra espaciadora
    if (playerArrows.length) {
      var angle = playerArcher.body.angle + PI / 2;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

// Mostrar la flecha y la trayectoria
function showArrows(index, arrows) {
  arrows[index].display();
}

// Lógica para que la computadora dispare flechas
function handleComputerArcher() {
  if (!computerArcher.collapse && !playerArcher.collapse) {
    setTimeout(() => {
      var pos = computerArcher.body.position;
      var angle = computerArcher.body.angle;
      var moves = ["UP", "DOWN"];
      var move = random(moves);
      var angleValue;

      if (move === "UP") {
        angleValue = 0.1;
      } else {
        angleValue = -0.1;
      }
      angle += angleValue;

      var arrow = new ComputerArrow(pos.x, pos.y, 100, 10, angle);
      Matter.Body.setAngle(computerArcher.body, angle);
      computerArrows.push(arrow);

      setTimeout(() => {
        computerArrows[computerArrows.length - 1].shoot(angle);
      }, 100);

      handleComputerArcher();
    }, 2000);
  }
}

// Detección de colisión entre la flecha del jugador y la computadora
function handlePlayerArrowCollision(index) {
  for (let i = 0; i < computerArrows.length; i++) {
    var arrow = playerArrows[index];
    var collision = Matter.SAT.collides(arrow.body, computer.body);

    if (collision.collided) {
      computerArcherLife -= 1;  // Reducir la vida de la computadora
      playerArrows.splice(index, 1);  // Eliminar la flecha tras la colisión
    }
  }
}

// Detección de colisión entre la flecha de la computadora y el jugador
function handleComputerArrowCollision(index) {
  for (let i = 0; i < playerArrows.length; i++) {
    var arrow = computerArrows[index];
    var collision = Matter.SAT.collides(arrow.body, player.body);

    if (collision.collided) {
      playerArcherLife -= 1;  // Reducir la vida del jugador
      computerArrows.splice(index, 1);  // Eliminar la flecha tras la colisión
    }
  }
}