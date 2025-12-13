let estadoJuego = 'MENU';
let cuadradoX, cuadradoY;
let velocidadX, velocidadY;
let velocidadInicial = 3; // Ligeramente más rápido
let tamañoCuadrado = 30;
let puntos = 0;
let vidas = 3;
let cuadradoColeccionX, cuadradoColeccionY;
let tiempoUltimoNivel = 0;
let intervaloNivel = 12000; // Nivel sube cada 12 segundos
let velocidadMaxima = 8;

// Variables del ENEMIGO (Círculo Amarillo - Se mueve)
let enemigoX, enemigoY;
let velocidadEnemigoX, velocidadEnemigoY;
let velocidadEnemigoInicial = 4; // Más rápido que el jugador
let tamanoEnemigo = 25;

// Variables de sonido
let musicaFondo;
let sonidoColeccion;
let sonidoDerrota;
let sonidoNivelUp;

function preload() {
  // Carga de activos de audio
  musicaFondo = loadSound('assets/musica.ogg'); 
  sonidoColeccion = loadSound('assets/coleccion.ogg'); 
  sonidoDerrota = loadSound('assets/derrota.ogg'); 
  sonidoNivelUp = loadSound('assets/nivelup.ogg');
}

function setup() {
  // Configuración de p5.js para pantalla completa
  createCanvas(windowWidth, windowHeight); 
  document.documentElement.style.overflow = 'hidden'; 
  
  rectMode(CENTER);
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(24);
}

// Asegura que el canvas se redimensione si cambia el tamaño de la ventana
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Es crucial reinicializar el juego para ajustar posiciones al nuevo tamaño
  if (estadoJuego === 'JUGANDO') {
     // Si el juego está en curso, ajustamos solo el enemigo y el coleccionable
     generarCuadradoColeccion();
     enemigoX = width / 4;
     enemigoY = height / 4;
  }
}

function iniciarJuego() {
  // Inicialización del Jugador (cuadrado rojo)
  cuadradoX = width / 2;
  cuadradoY = height / 2;
  velocidadX = velocidadInicial;
  velocidadY = velocidadInicial;
  
  puntos = 0;
  vidas = 3;
  tiempoUltimoNivel = millis();
  
  // Inicialización del Coleccionable (círculo azul - fijo)
  generarCuadradoColeccion();
  
  // Inicialización del Enemigo (círculo amarillo - móvil)
  enemigoX = width * 0.75; 
  enemigoY = height * 0.25;
  velocidadEnemigoX = velocidadEnemigoInicial;
  velocidadEnemigoY = -velocidadEnemigoInicial;
  
  estadoJuego = 'JUGANDO';
}

function generarCuadradoColeccion() {
  // Genera el coleccionable (azul) en una posición aleatoria
  cuadradoColeccionX = random(tamañoCuadrado * 2, width - tamañoCuadrado * 2);
  cuadradoColeccionY = random(tamañoCuadrado * 2, height - tamañoCuadrado * 2);
}

function draw() {
  background(20);

  // Lógica del juego y dibujo
  switch (estadoJuego) {
    case 'MENU':
      dibujarMenu();
      break;
    case 'JUGANDO':
      logicaJuego();
      dibujarHUD();
      break;
    case 'DERROTA':
      dibujarDerrota();
      break;
  }
}

function dibujarMenu() {
  textSize(40);
  fill(255, 100, 150);
  text('PIXEL DASH', width / 2, height / 2 - 50);
  textSize(24);
  fill(200);
  text('Presiona ESPACIO para JUGAR', width / 2, height / 2 + 30);
}

function logicaJuego() {
  // 1. MOVIMIENTO DE ENTIDADES

  // Movimiento del Jugador (ROJO)
  cuadradoX += velocidadX;
  cuadradoY += velocidadY;

  // Movimiento del Enemigo (AMARILLO)
  enemigoX += velocidadEnemigoX;
  enemigoY += velocidadEnemigoY;
  
  // 2. LÓGICA DE REBOTE Y PÉRDIDA DE VIDA

  // Rebote y pérdida de vida del Jugador contra BORDES
  if (cuadradoX > width - tamañoCuadrado / 2 || cuadradoX < tamañoCuadrado / 2) {
    velocidadX *= -1;
    perderVida();
  }
  if (cuadradoY > height - tamañoCuadrado / 2 || cuadradoY < tamañoCuadrado / 2) {
    velocidadY *= -1;
    perderVida();
  }
  
  // Rebote del Enemigo (AMARILLO) contra BORDES (no pierde vida)
  if (enemigoX > width - tamanoEnemigo / 2 || enemigoX < tamanoEnemigo / 2) {
    velocidadEnemigoX *= -1;
  }
  if (enemigoY > height - tamanoEnemigo / 2 || enemigoY < tamanoEnemigo / 2) {
    velocidadEnemigoY *= -1;
  }

  // 3. LÓGICA DE COLISIÓN (ROJO contra AMARILLO)
  let distanciaColision = (tamañoCuadrado / 2) + (tamanoEnemigo / 2);

  if (dist(cuadradoX, cuadradoY, enemigoX, enemigoY) < distanciaColision) {
    perderVida();
    
    // Reubicación y rebote para evitar colisiones múltiples instantáneas
    enemigoX = random(width * 0.3, width * 0.7);
    enemigoY = random(height * 0.3, height * 0.7);
    velocidadX *= -1;
    velocidadY *= -1;
  }
  
  // 4. LÓGICA DE COLECCIÓN (ROJO contra AZUL)
  if (dist(cuadradoX, cuadradoY, cuadradoColeccionX, cuadradoColeccionY) < tamañoCuadrado) {
    puntos++;
    generarCuadradoColeccion(); // Mueve el coleccionable a un nuevo lugar
    sonidoColeccion.play();
  }

  // 5. LÓGICA DE NIVEL (Velocidad aumenta)
  if (millis() - tiempoUltimoNivel > intervaloNivel) {
    aumentarNivel();
  }

  // 6. DIBUJAR ELEMENTOS
  
  // Dibujar Jugador (ROJO)
  fill(255, 0, 0); 
  rect(cuadradoX, cuadradoY, tamañoCuadrado, tamañoCuadrado);
  
  // Dibujar Coleccionable (AZUL - Fijo)
  fill(0, 0, 255); 
  ellipse(cuadradoColeccionX, cuadradoColeccionY, tamañoCuadrado, tamañoCuadrado);
  
  // Dibujar Enemigo (AMARILLO - Móvil)
  fill(255, 255, 0);
  ellipse(enemigoX, enemigoY, tamanoEnemigo, tamanoEnemigo);
  
  // Control de la música (loop)
  if (!musicaFondo.isPlaying()) {
    musicaFondo.loop();
  }
}

function aumentarNivel() {
  tiempoUltimoNivel = millis();
  let incrementoVelocidad = 0.5;
  let nuevaVelocidad = abs(velocidadX) + incrementoVelocidad;
  
  if (nuevaVelocidad < velocidadMaxima) {
    // Aplicar la nueva velocidad al jugador, manteniendo la dirección
    velocidadX = (velocidadX > 0 ? 1 : -1) * nuevaVelocidad;
    velocidadY = (velocidadY > 0 ? 1 : -1) * nuevaVelocidad;
    
    // Aumentar ligeramente la velocidad del enemigo
    velocidadEnemigoX = (velocidadEnemigoX > 0 ? 1 : -1) * (abs(velocidadEnemigoX) + 0.2);
    velocidadEnemigoY = (velocidadEnemigoY > 0 ? 1 : -1) * (abs(velocidadEnemigoY) + 0.2);

    sonidoNivelUp.play();
  }
}

function perderVida() {
  vidas--;
  if (vidas <= 0) {
    estadoJuego = 'DERROTA';
    musicaFondo.stop();
    sonidoDerrota.play();
  }
}

function dibujarHUD() {
  textSize(18);
  
  // 1. Puntos (Inferior Izquierda)
  fill(255);
  text('Puntos: ' + puntos, 70, height - 20); 
  
  // 2. Velocidad (Inferior Derecha)
  fill(255);
  text('Velocidad: ' + nf(abs(velocidadX), 1, 1), width - 70, height - 20); 
  
  // 3. Texto "Vidas:" (Superior Izquierda)
  fill(255);
  text('Vidas:', 150, 20);

  // 4. Indicadores de vida (Círculos rojos / Corazones)
  let inicioX = 180; 
  let tamañoVida = 15;
  
  noStroke(); 
  fill(255, 0, 0); 
  
  for (let i = 0; i < vidas; i++) {
    ellipse(inicioX + (i * 20), 20, tamañoVida, tamañoVida); 
  }
}

function dibujarDerrota() {
  textSize(40);
  fill(255, 0, 0);
  text('GAME OVER', width / 2, height / 2 - 50);
  textSize(24);
  fill(200);
  text('Puntos Finales: ' + puntos, width / 2, height / 2);
  text('Presiona ESPACIO para REINICIAR', width / 2, height / 2 + 50);
}

function keyPressed() {
  if (key === ' ' || key === 'Spacebar') {
    if (estadoJuego === 'MENU' || estadoJuego === 'DERROTA') {
      iniciarJuego();
    }
  }
}
