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
  // ARREGLO DE CARGA: Se buscan los archivos OGG
  musicaFondo = loadSound('assets/musica.ogg'); 
  sonidoColeccion = loadSound('assets/coleccion.ogg'); 
  sonidoDerrota = loadSound('assets/derrota.ogg'); 
  sonidoNivelUp = loadSound('assets/nivelup.ogg');
}

function setup() {
  // ARREGLO PANTALLA COMPLETA
  createCanvas(windowWidth, windowHeight); 
  document.documentElement.style.overflow = 'hidden'; 
  
  // ARREGLO DE ESTADO
  rectMode(CENTER);
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(24);
}

// ARREGLO PANTALLA COMPLETA
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function iniciarJuego() {
  // Usa width y height de la pantalla completa para centrar
  cuadradoX = width / 2;
  cuadradoY = height / 2;
  velocidadX = velocidadInicial;
  velocidadY = velocidadInicial;
  puntos = 0;
  vidas = 3; // ¡Inicia con 3 vidas!
  tiempoUltimoNivel = millis();
  generarCuadradoColeccion();
  estadoJuego = 'JUGANDO';
}

function generarCuadradoColeccion() {
  // Usa width y height de la pantalla completa
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
  // Cuadrado del jugador (ROJO)
  fill(255, 0, 0); 
  rect(cuadradoX, cuadradoY, tamañoCuadrado, tamañoCuadrado);
  
  // *** Cuadrado de colección (AZUL) ***
  fill(0, 0, 255); 
  ellipse(cuadradoColeccionX, cuadradoColeccionY, tamañoCuadrado, tamañoCuadrado);
  
  // Control de la música
  if (!musicaFondo.isPlaying()) {
    musicaFondo.loop();
  }
}

function aumentarNivel() {
  tiempoUltimoNivel = millis();
  let nuevaVelocidad = velocidadInicial + 0.5 * (floor(puntos / 5) + 1);

  if (nuevaVelocidad < velocidadMaxima) {
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
  
  // 1. Dibuja el texto Puntos (en blanco) - POSICIÓN INFERIOR IZQUIERDA
  fill(255);
  text('Puntos: ' + puntos, 70, height - 20); 
  
  // 2. Dibuja el texto Velocidad (en blanco) - POSICIÓN INFERIOR DERECHA
  fill(255);
  text('Velocidad: ' + nf(abs(velocidadX), 1, 1), width - 70, height - 20); 
  
  // 3. Dibuja el texto "Vidas:" (en blanco) - POSICIÓN SUPERIOR IZQUIERDA
  fill(255);
  text('Vidas:', 150, 20);

  // 4. Dibuja los círculos rojos (las vidas / corazones)
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
