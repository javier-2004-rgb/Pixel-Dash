// Variables para la posición y velocidad del personaje
let personajeX;
let personajeY;
let velocidad = 5; 

function setup() {
  // 1. Inicializa el lienzo (Canvas) donde se dibuja el juego
  createCanvas(600, 400); 
  
  // 2. Establece la posición inicial del personaje en el centro
  personajeX = width / 2;
  personajeY = height / 2;
}

function draw() {
  // 1. Limpia el fondo en cada frame (para evitar el rastro)
  background(50); 
  
  // 2. Lógica de movimiento (se ejecuta 60 veces por segundo)
  if (keyIsDown(LEFT_ARROW)) {
    personajeX -= velocidad;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    personajeX += velocidad;
  }
  if (keyIsDown(UP_ARROW)) {
    personajeY -= velocidad;
  }
  if (keyIsDown(DOWN_ARROW)) {
    personajeY += velocidad;
  }
  
  // 3. Restricción de bordes (que el personaje no se salga)
  personajeX = constrain(personajeX, 20, width - 20);
  personajeY = constrain(personajeY, 20, height - 20);

  // 4. Dibuja el personaje (un círculo rosa)
  fill(255, 0, 100); 
  circle(personajeX, personajeY, 40); 
}
