// Variables para el personaje (círculo rosa)
let personajeX;
let personajeY;
let velocidad = 5; 

// Variables para el objetivo (cuadrado amarillo)
let objetivoX;
let objetivoY;
let objetivoTamaño = 30;

// Variables de juego
let puntuacion = 0;
let anchoLienzo = 600;
let altoLienzo = 400;

function setup() {
  // Inicializa el lienzo
  createCanvas(anchoLienzo, altoLienzo); 
  personajeX = width / 2;
  personajeY = height / 2;
  
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
  
  // --- 1. Lógica de Movimiento ---
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

  // --- 2. Detección de Colisión ---
  
  // Calcula la distancia entre el centro del personaje y el centro del objetivo
  let distancia = dist(personajeX, personajeY, objetivoX, objetivoY);
  
  // Si la distancia es menor a la suma de sus radios/tamaños, hubo colisión
  if (distancia < radioPersonaje + (objetivoTamaño / 2)) {
    puntuacion += 10; // Aumenta la puntuación
    colocarNuevoObjetivo(); // Mueve el objetivo a una nueva posición
  }

  // --- 3. Dibujar Elementos ---
  
  // Dibujar el objetivo (cuadrado amarillo)
  fill(255, 255, 0); // Amarillo
  rectMode(CENTER); // Dibuja el cuadrado desde su centro
  square(objetivoX, objetivoY, objetivoTamaño); 

  // Dibujar el personaje (círculo rosa)
  fill(255, 0, 100); 
  circle(personajeX, personajeY, radioPersonaje * 2); 
  
  // Dibujar la puntuación en la esquina
  fill(255); // Color blanco para el texto
  textSize(24);
  textAlign(LEFT, TOP); // Alineación a la esquina superior izquierda
  text(`Puntuación: ${puntuacion}`, 10, 10);
}
