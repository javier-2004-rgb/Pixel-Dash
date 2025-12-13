let estadoJuego = 'MENU';
let cuadradoX, cuadradoY;
let velocidadX, velocidadY;
let velocidadInicial = 2.5;
let tamañoCuadrado = 30;
let puntos = 0;
let vidas = 3;
let cuadradoColeccionX, cuadradoColeccionY;
let tiempoUltimoNivel = 0;
let intervaloNivel = 15000; // 15 segundos
let velocidadMaxima = 6.5;

// Variables de sonido
let musicaFondo;
let sonidoColeccion;
let sonidoDerrota;
let sonidoNivelUp;

function preload() {
  // *** CORRECCIÓN CRUCIAL: Se cargan los archivos OGG ***
  musicaFondo = loadSound('assets/musica.ogg'); 
  sonidoColeccion = loadSound('assets/coleccion.ogg'); 
  sonidoDerrota = loadSound('assets/derrota.ogg'); 
  sonidoNivelUp = loadSound('assets/nivelup.ogg');
}

function setup() {
  createCanvas(600, 400);
  iniciarJuego();
  rectMode(CENTER);
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(24);
}

function iniciarJuego() {
  cuadradoX = width / 2;
  cuadradoY = height / 2;
  velocidadX = velocidadInicial;
  velocidadY = velocidadInicial;
  puntos = 0;
  vidas = 3;
  tiempoUltimoNivel = millis();
  generarCuadradoColeccion();
  estadoJuego = 'JUGANDO';
}

function generarCuadradoColeccion() {
  cuadradoColeccionX = random(tamañoCuadrado * 2, width - tamañoCuadrado * 2);
  cuadradoColeccionY = random(tamañoCuadrado * 2, height - tamañoCuadrado * 2);
}

function draw() {
  background(20);

  // Lógica del juego
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
  // 1. Mover el cuadrado
  cuadradoX += velocidadX;
  cuadradoY += velocidadY;

  // 2. Comprobar colisiones con bordes
  if (cuadradoX > width - tamañoCuadrado / 2 || cuadradoX < tamañoCuadrado / 2) {
    velocidadX *= -1;
    perderVida();
  }
  if (cuadradoY > height - tamañoCuadrado / 2 || cuadradoY < tamañoCuadrado / 2) {
    velocidadY *= -1;
    perderVida();
  }
  
  // 3. Comprobar colección
  if (dist(cuadradoX, cuadradoY, cuadradoColeccionX, cuadradoColeccionY) < tamañoCuadrado) {
    puntos++;
    generarCuadradoColeccion();
    sonidoColeccion.play();
  }

  // 4. Aumentar nivel (velocidad)
  if (millis() - tiempoUltimoNivel > intervaloNivel) {
    aumentarNivel();
  }

  // 5. Dibujar elementos
  // Cuadrado del jugador
  fill(255, 0, 0);
  rect(cuadradoX, cuadradoY, tamañoCuadrado, tamañoCuadrado);
  
  // Cuadrado de colección
  fill(255, 255, 0);
  ellipse(cuadradoColeccionX, cuadradoColeccionY, tamañoCuadrado, tamañoCuadrado);
  
  // ** Control de la música **
  // Aseguramos que la música suene solo una vez
  if (!musicaFondo.isPlaying()) {
    musicaFondo.loop();
  }
}

function aumentarNivel() {
  tiempoUltimoNivel = millis();
  let nuevaVelocidad = velocidadInicial + 0.5 * (floor(puntos / 5) + 1);

  if (nuevaVelocidad < velocidadMaxima) {
    // Aplicar la nueva velocidad manteniendo la dirección
    velocidadX = (velocidadX > 0 ? 1 : -1) * nuevaVelocidad;
    velocidadY = (velocidadY > 0 ? 1 : -1) * nuevaVelocidad;
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
  fill(255);
  text('Puntos: ' + puntos, 50, 20);
  text('Vidas: ' + vidas, width - 50, 20);
  text('Velocidad: ' + nf(abs(velocidadX), 1, 1), 50, height - 20);
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
