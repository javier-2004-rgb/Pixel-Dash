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
let nivelDificultad = 0; 

// Variables de ESTADO y MEJORAS
let estadoJuego = 'menu'; // CAMBIO CLAVE: El juego comienza en el menú
let puntuacionMaxima = 0; // Para guardar la mejor puntuación (High Score)
let vida = 3; // Vida inicial
let invulnerable = false; // Para evitar perder vida constantemente
let tiempoInvulnerable = 0; // Temporizador para la invulnerabilidad
let mostrarNivelUp = false; // Controla el mensaje de nivel
let nivelUpTiempo = 0; // Temporizador para el mensaje Nivel Up

// NUEVO: Variables de Sonido
let musicaFondo;
let sonidoColeccion;
let sonidoDerrota;
let sonidoNivelUp;

// NUEVO: Carga los archivos de sonido antes de que inicie el juego
function preload() {
  // Asegúrate de que los nombres de archivo coincidan con lo que subiste a GitHub, 
  // ¡y que estén dentro de la carpeta 'assets'!
  musicaFondo = loadSound('assets/musica.mp3'); 
  sonidoColeccion = loadSound('assets/coleccion.mp3'); 
  sonidoDerrota = loadSound('assets/derrota.mp3'); 
  sonidoNivelUp = loadSound('assets/nivelup.mp3');
}

function setup() {
  // Inicializa el lienzo
  createCanvas(anchoLienzo, altoLienzo); 
  
  // Cargar la puntuación máxima guardada (si existe)
  let recordGuardado = localStorage.getItem('pixelDashRecord');
  if (recordGuardado !== null) {
    puntuacionMaxima = int(recordGuardado); 
  }
  
  // El juego no se inicia aquí, el estado es 'menu'.
}

function colocarNuevoObjetivo() {
  objetivoX = random(objetivoTamaño / 2, width - objetivoTamaño / 2);
  objetivoY = random(objetivoTamaño / 2, height - objetivoTamaño / 2);
}

// NUEVO: Función para INICIAR el Juego desde el Menú o Reiniciar después de Derrota
function iniciarJuego() {
  // 1. Restablece las variables del juego
  puntuacion = 0;
  estadoJuego = 'jugando'; // El juego está ahora activo
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
  
  // NUEVO: Iniciar música de fondo
  if (!musicaFondo.isPlaying()) {
    musicaFondo.loop(); 
    musicaFondo.setVolume(0.5); // Volumen bajo para que no sature
  }
  
  // 4. Inicia el bucle 'draw()' si estaba detenido
  loop(); 
}

function draw() {
  background(50); // Limpia el fondo 
  
  if (estadoJuego === 'menu') {
    mostrarMenu();
  } else if (estadoJuego === 'jugando') {
    
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
      sonidoColeccion.play(); // NUEVO: Sonido de colección
      
      // Lógica de Dificultad Progresiva basada en Nivel
      let nuevoNivel = floor(puntuacion / 50); 

      if (nuevoNivel > nivelDificultad) {
        nivelDificultad = nuevoNivel; 
        
        enemigoVelocidad += 0.5; 
        velocidad += 0.5; 
        
        // Activa el mensaje y sonido de Nivel Up
        mostrarNivelUp = true;
        nivelUpTiempo = millis(); 
        sonidoNivelUp.play(); // NUEVO: Sonido de Nivel Up
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
        
        musicaFondo.stop(); // PAUSA LA MÚSICA
        sonidoDerrota.play(); // Reproduce el sonido de derrota
        
        estadoJuego = 'derrota'; // CAMBIO DE ESTADO
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

  } else if (estadoJuego === 'derrota') {
    mostrarDerrota();
  }
}

// NUEVO: Muestra la pantalla de menú
function mostrarMenu() {
  fill(255);
  textSize(50);
  textAlign(CENTER, CENTER);
  text('PIXEL DASH', width / 2, height / 2 - 80);
  
  textSize(25);
  fill(255, 255, 0);
  text(`Máximo Record: ${puntuacionMaxima}`, width / 2, height / 2 + 20);
  
  fill(0, 255, 0);
  textSize(25);
  text('Presiona ESPACIO para JUGAR', width / 2, height / 2 + 80);
}

// NUEVO: Muestra la pantalla de derrota (código movido del draw)
function mostrarDerrota() {
  fill(255, 0, 0); 
  textSize(50);
  textAlign(CENTER, CENTER);
  text('¡DERROTA!', width / 2, height / 2);
  
  fill(255); // Texto blanco
  textSize(20);
  text('Presiona ESPACIO para reiniciar', width / 2, height / 2 + 50);

  // Asegúrate de dibujar la puntuación final también
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP); 
  text(`Puntuación: ${puntuacion}`, 10, 10);
  textSize(18); 
  textAlign(RIGHT, TOP); 
  text(`Máximo: ${puntuacionMaxima}`, width - 10, 10);
}


// FUNCIÓN DE REINICIO CON CORRECCIÓN DE TECLA (keyCode 32)
function keyReleased() {
  // El keyCode para la Barra Espaciadora es 32
  if (keyCode === 32) {
    if (estadoJuego === 'menu' || estadoJuego === 'derrota') {
      iniciarJuego(); // Usa la nueva función de inicio/reinicio
    }
  }
}
