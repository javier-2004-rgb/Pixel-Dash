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
let nivelDificultad = 0; 

// Variables de MEJORAS
let puntuacionMaxima = 0; // NUEVO: Para guardar la mejor puntuación (High Score)
let vida = 3; // NUEVO: Vida inicial
let invulnerable = false; // NUEVO: Para evitar perder vida constantemente
let tiempoInvulnerable = 0; // NUEVO: Temporizador para la invulnerabilidad
let mostrarNivelUp = false; // NUEVO: Controla el mensaje de nivel
let nivelUpTiempo = 0; // NUEVO: Temporizador para el mensaje Nivel Up

function setup() {
  // Inicializa el lienzo
  createCanvas(anchoLienzo, altoLienzo); 
  personajeX = width / 2;
  personajeY = height / 2;
  enemigoX = 50; 
  enemigoY = 50;
  
  // NUEVO: Cargar la puntuación máxima guardada (si existe)
  let recordGuardado = localStorage.getItem('pixelDashRecord');
  if (recordGuardado !== null) {
    puntuacionMaxima = int(recordGuardado); 
  }

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
  enemigoVelocidad = 2; 
  velocidad = 5; 
  nivelDificultad = 0; 
  
  // Restablece las variables de vida y temporizadores
  vida = 3; 
  invulnerable = false;
  tiempoInvulnerable = 0;
  mostrarNivelUp = false;
  
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

    // Lógica de Dificultad Progresiva basada en Nivel
    let nuevoNivel = floor(puntuacion / 50); 

    if (nuevoNivel > nivelDificultad) {
      nivelDificultad = nuevoNivel; 
      
      enemigoVelocidad += 0.5; 
      velocidad += 0.5; 
      
      // Activa el mensaje de Nivel Up
      mostrarNivelUp = true;
      nivelUpTiempo = millis(); // Guarda el tiempo actual
    }
  }

  // --- 3. Lógica de Movimiento y Derrota del Enemigo con VIDA ---
  
  // Mover el enemigo lentamente hacia abajo
  enemigoY += enemigoVelocidad;
  
  // Si el enemigo se sale por abajo, hacerlo reaparecer arriba
  if (enemigoY > height + enemigoTamaño / 2) {
    enemigoY = -enemigoTamaño / 2;
    enemigoX = random(50, width - 50);
  }

  // --- Manejo de la Invulnerabilidad ---
  if (invulnerable && millis() > tiempoInvulnerable + 2000) { // 2 segundos de invulnerabilidad
    invulnerable = false; 
  }
  
  // Detección de Colisión ENEMIGO/PERSONAJE
  let distanciaEnemigo = dist(personajeX, personajeY, enemigoX, enemigoY);
  let umbralColision = radioPersonaje + (enemigoTamaño / 2); 
  
  if (distanciaEnemigo < umbralColision && !invulnerable) {
    vida -= 1; // Pierde 1 vida
    invulnerable = true; // Activa la invulnerabilidad
    tiempoInvulnerable = millis(); // Guarda el tiempo de activación
    
    // Si la vida llega a cero, ¡DERROTA!
    if (vida <= 0) {
      // Guardar la puntuación máxima si se supera
      if (puntuacion > puntuacionMaxima) {
        puntuacionMaxima = puntuacion;
        localStorage.setItem('pixelDashRecord', puntuacionMaxima);
      }
      
      juegoActivo = false; // El juego ya no está activo
      noLoop(); // Detiene el bucle draw()
    }
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

  // Dibuja el personaje con parpadeo si es invulnerable
  if (!(invulnerable && (floor(millis() / 100) % 2 === 0))) {
     // Dibuja el círculo solo si NO es invulnerable O si está en el momento "encendido" del parpadeo
    fill(255, 0, 100); 
    circle(personajeX, personajeY, radioPersonaje * 2); 
  }
  
  // --- Dibujar Puntuaciones y Vida ---
  
  // Puntuación Actual
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP); 
  text(`Puntuación: ${puntuacion}`, 10, 10);

  // Puntuación Máxima
  textSize(18); 
  textAlign(RIGHT, TOP); 
  text(`Máximo: ${puntuacionMaxima}`, width - 10, 10);
  
  // Vida
  textAlign(LEFT, TOP);
  textSize(20);
  fill(255, 0, 0); // Rojo para la vida
  text(`❤️ Vida: ${vida}`, 10, 40); 
  
  // Manejar y Dibujar el Mensaje de Nivel Up
  if (mostrarNivelUp) {
    if (millis() < nivelUpTiempo + 1500) { // Muestra por 1.5 segundos
      fill(0, 255, 0); // Verde brillante
      textSize(40);
      textAlign(CENTER, CENTER);
      text('¡NIVEL UP!', width / 2, height / 2 - 50); 
    } else {
      mostrarNivelUp = false; // Desactiva el mensaje
    }
  }
  
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

// FUNCIÓN DE REINICIO CON CORRECCIÓN DE TECLA (keyCode 32)
function keyReleased() {
  // El keyCode para la Barra Espaciadora es 32
  if (keyCode === 32 && juegoActivo === false) {
    reiniciarJuego(); // Llama a la función de reinicio
  }
}
