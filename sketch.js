// Variables para el personaje (círculo rosa)
let personajeX;
let personajeY;
let velocidad = 5; // Velocidad base del personaje

// Variables para el objetivo (cuadrado amarillo)
let objetivoX;
let objetivoY;
let objetivoTamaño = 30;

// Variables para el enemigo (cuadrado azul)
let enemigoX;
let enemigoY;
let enemigoTamaño = 40;
let enemigoVelocidad = 2; // Velocidad base del enemigo

// Variables de juego
let puntuacion = 0;
let anchoLienzo = 600;
let altoLienzo = 400;
let juegoActivo = true; // Controla si el juego está corriendo

function setup() {
  // Inicializa el lienzo
  createCanvas(anchoLienzo, altoLienzo); 
  personajeX = width / 2;
  personajeY = height / 2;
  enemigoX = 50; 
  enemigoY = 50;
  
  colocarNuevoObjetivo(); 
}

function colocarNuevoObjetivo() {
  objetivoX = random(objetivoTamaño / 2, width - objetivoTamaño / 2);
  objetivoY = random(objetivoTamaño / 2, height - objetivoTamaño / 2);
}

// Función de Reinicio
function reiniciarJuego() {
  // 1. Restablece las variables del juego
  puntuacion = 0;
  juegoActivo = true;
  enemigoVelocidad = 2; // Resetea la velocidad del enemigo a su valor inicial
  velocidad = 5; // Resetea la velocidad del personaje a su valor inicial
  
  // 2. Coloca al personaje y al enemigo en sus posiciones iniciales
  personajeX = width / 2;
  personajeY = height / 2;
  enemigoX = 50; 
  enemigoY = 50;
  
  // 3. Coloca el primer objetivo
  colocarNuevoObjetivo();
  
  // 4. Inicia el bucle 'draw()' de nuevo
  loop(); 
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
  let radioPersonaje = 20;
  personajeX = constrain(personajeX, radioPersonaje, width - radioPersonaje);
  personajeY = constrain(personajeY, radioPersonaje, height - radioPersonaje);

  // --- 2. Detección de Colisión (Objetivo) con Dificultad Progresiva ---
  let distanciaObjetivo = dist(personajeX, personajeY, objetivoX, objetivoY);
  
  if (distanciaObjetivo < radioPersonaje + (objetivoTamaño / 2)) {
    puntuacion += 10;
    colocarNuevoObjetivo();

    // Lógica de Dificultad Progresiva
    // Si la puntuación es un múltiplo de 50 (50, 100, 150, etc.)
    if (puntuacion > 0 && puntuacion % 50 === 0) {
      enemigoVelocidad += 0.5; // El enemigo se vuelve más rápido
      velocidad += 0.5; // El personaje también se vuelve más rápido (para que sea desafiante pero jugable)
    }
  }

  // --- 3. Lógica de Movimiento y Derrota del Enemigo ---
  
  // Mover el enemigo lentamente hacia abajo
  enemigoY += enemigoVelocidad;
  
  // Si el enemigo se sale por abajo, hacerlo reaparecer arriba
  if (enemigoY > height + enemigoTamaño / 2) {
    enemigoY = -enemigoTamaño / 2;
    enemigoX = random(50, width - 50);
  }

  // Detección de Derrota
  let distanciaEnemigo = dist(personajeX, personajeY, enemigoX, enemigoY);
  let umbralColision = radioPersonaje + (enemigoTamaño / 2); 
  
  if (distanciaEnemigo < umbralColision) {
    juegoActivo = false; // El juego ya no está activo
    noLoop(); // Detiene el bucle draw()
  }

  // --- 4. Dibujar Elementos ---
  
  // Dibujar el enemigo (cuadrado azul)
  fill(0, 0, 255);
  rectMode(CENTER);
  square(enemigoX, enemigoY, enemigoTamaño); 

  // Dibujar el objetivo (cuadrado amarillo)
  fill(255, 255, 0);
  rectMode(CENTER); 
  square(objetivoX, objetivoY, objetivoTamaño); 

  // Dibujar el personaje (círculo rosa)
  fill(255, 0, 100); 
  circle(personajeX, personajeY, radioPersonaje * 2); 
  
  // Dibujar la puntuación en la esquina
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP); 
  text(`Puntuación: ${puntuacion}`, 10, 10);
  
  // Mensaje de Derrota y Reinicio
  if (juegoActivo === false) {
    fill(255, 0, 0); 
    textSize(50);
    textAlign(CENTER, CENTER);
    text('¡DERROTA!', width / 2, height / 2);
    
    fill(255); // Texto blanco
    textSize(20);
    text('Presiona ESPACIO para reiniciar', width / 2, height / 2 + 50);
  }
}

// CORRECCIÓN FINAL: Usa el código numérico (keyCode) para detectar la Barra Espaciadora.
function keyReleased() {
  // El keyCode para la Barra Espaciadora es 32
  if (keyCode === 32 && juegoActivo === false) {
    reiniciarJuego(); // Llama a la función de reinicio
  }
}
