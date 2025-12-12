// Variables para el personaje (círculo rosa)
let personajeX;
let personajeY;
let velocidad = 5; 

// Variables para el objetivo (cuadrado amarillo)
let objetivoX;
let objetivoY;
let objetivoTamaño = 30;

// Variables para el enemigo (cuadrado azul)
let enemigoX;
let enemigoY;
let enemigoTamaño = 40;
let enemigoVelocidad = 2; // Más lento que el personaje (5)

// Variables de juego
let puntuacion = 0;
let anchoLienzo = 600;
let altoLienzo = 400;

function setup() {
  // Inicializa el lienzo
  createCanvas(anchoLienzo, altoLienzo); 
  personajeX = width / 2;
  personajeY = height / 2;
  
  // Posición inicial del enemigo (en la esquina superior izquierda)
  enemigoX = 50; 
  enemigoY = 50;
  
  // Llama a la función para colocar el primer objetivo
  colocarNuevoObjetivo(); 
}

function colocarNuevoObjetivo() {
  // Coloca el objetivo en una posición aleatoria dentro del lienzo
  objetivoX = random(objetivoTamaño / 2, width - objetivoTamaño / 2);
  objetivoY = random(objetivoTamaño / 2, height - objetivoTamaño / 2);
}

function draw() {
  background(50); // Limpia el fondo 
  
  // --- 1. Lógica de Movimiento del Personaje ---
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
  
  // Restricción de bordes 
  let radioPersonaje = 20; // Mitad del diámetro de 40px
  personajeX = constrain(personajeX, radioPersonaje, width - radioPersonaje);
  personajeY = constrain(personajeY, radioPersonaje, height - radioPersonaje);

  // --- 2. Detección de Colisión (Objetivo) ---
  
  let distanciaObjetivo = dist(personajeX, personajeY, objetivoX, objetivoY);
  
  if (distanciaObjetivo < radioPersonaje + (objetivoTamaño / 2)) {
    puntuacion += 10; // Aumenta la puntuación
    colocarNuevoObjetivo(); // Mueve el objetivo a una nueva posición
  }

  // --- 3. Lógica de Movimiento y Derrota del Enemigo (NUEVO) ---
  
  // Mover el enemigo lentamente hacia abajo
  enemigoY += enemigoVelocidad;
  
  // Si el enemigo se sale por abajo, hacerlo reaparecer arriba
  if (enemigoY > height + enemigoTamaño / 2) {
    enemigoY = -enemigoTamaño / 2; // Reaparece arriba
    enemigoX = random(50, width - 50); // En posición X aleatoria
  }

  // Detección de Derrota
  let distanciaEnemigo = dist(personajeX, personajeY, enemigoX, enemigoY);
  
  if (distanciaEnemigo < radioPersonaje + (enemigoTamaño / 2)) {
    // Código de derrota: detiene el loop draw()
    noLoop(); 
    fill(255, 0, 0); // Color rojo
    textSize(50);
    textAlign(CENTER, CENTER);
    text('¡DERROTA!', width / 2, height / 2);
  }

  // --- 4. Dibujar Elementos ---
  
  // Dibujar el enemigo (cuadrado azul)
  fill(0, 0, 255); // Azul
  rectMode(CENTER); // Dibuja el cuadrado desde su centro
  square(enemigoX, enemigoY, enemigoTamaño); 

  // Dibujar el objetivo (cuadrado amarillo)
  fill(255, 255, 0); // Amarillo
  rectMode(CENTER); 
  square(objetivoX, objetivoY, objetivoTamaño); 

  // Dibujar el personaje (círculo rosa)
  fill(255, 0, 100); 
  circle(personajeX, personajeY, radioPersonaje * 2); 
  
  // Dibujar la puntuación en la esquina
  fill(255); // Color blanco para el texto
  textSize(24);
  textAlign(LEFT, TOP); 
  text(`Puntuación: ${puntuacion}`, 10, 10);
}
