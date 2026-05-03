// ================================================================
// Corral.js  –  Motor y UI del Corral de Animales
// Se integra con el juego existente leyendo estadoJuego de Juego.js
// ================================================================
// ⚠️  INSTRUCCIÓN ÚNICA PARA ESTE ARCHIVO:
//     Solo debes implementar la función renderizarTarjetaAnimal().
//     Todo lo demás ya está listo y funcionando.
// ================================================================

import { estadoJuego } from './Juego.js';
import { crearAnimal, CATALOGO_ANIMALES_VISUAL } from './Animales.js';

// ──────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL CORRAL
// ──────────────────────────────────────────────────────────────

const COSTO_DESBLOQUEO_CORRAL = 250;
const MAX_ANIMALES            = 4;
const CICLO_PRODUCCION        = 25; // segundos entre cada ronda de monedas

// ──────────────────────────────────────────────────────────────
// ESTADO INTERNO DEL CORRAL
// ──────────────────────────────────────────────────────────────

let corralEstado = {
  desbloqueado:             false,
  animales:                 [],   // instancias de Pollo o Vaca
  _ultimoTick:              null,
  _tiempoDesdeProduccion:   0,
};

// ──────────────────────────────────────────────────────────────
// ACCIONES (expuestas globalmente para los onclick del HTML)
// ──────────────────────────────────────────────────────────────

/**
 * desbloquearCorral()
 * Descuenta oro y activa el corral si el jugador tiene suficiente.
 */
window.desbloquearCorral = function () {
  if (estadoJuego.oro < COSTO_DESBLOQUEO_CORRAL) {
    mostrarToastCorral('❌ Necesitas ' + COSTO_DESBLOQUEO_CORRAL + ' 🪙 para desbloquear el corral.');
    return;
  }
  estadoJuego.oro -= COSTO_DESBLOQUEO_CORRAL;
  corralEstado.desbloqueado = true;
  actualizarOroEnHUD();
  renderizarCorral();
  mostrarToastCorral('🐄 ¡Corral desbloqueado! Ya puedes comprar animales.');
};

/**
 * comprarAnimal()
 * Intenta comprar un animal del tipo indicado.
 * @param {string} tipo - 'pollo' o 'vaca'
 */
window.comprarAnimal = function (tipo) {
  if (corralEstado.animales.length >= MAX_ANIMALES) {
    mostrarToastCorral('🚫 El corral está lleno. Máximo ' + MAX_ANIMALES + ' animales.');
    return;
  }

  let info = CATALOGO_ANIMALES_VISUAL[tipo];
  if (!info) return;

  if (estadoJuego.oro < info.costoCompra) {
    mostrarToastCorral('❌ Necesitas ' + info.costoCompra + ' 🪙 para comprar un ' + info.nombre + '.');
    return;
  }

  try {
    let nuevoAnimal = crearAnimal(tipo);
    estadoJuego.oro -= info.costoCompra;
    corralEstado.animales.push(nuevoAnimal);
    actualizarOroEnHUD();
    renderizarCorral();
    mostrarToastCorral('🐣 ¡' + info.nombre + ' comprado! Cuídalo bien.');
  } catch (e) {
    mostrarToastCorral('⚠️ ' + info.nombre + ': clase aún no implementada. ¡Es tu tarea!');
  }
};

/**
 * alimentarAnimal()
 * Alimenta al animal en la posición indicada.
 * @param {number} indice - Posición del animal en el array
 */
window.alimentarAnimal = function (indice) {
  let animal = corralEstado.animales[indice];
  if (!animal) return;
  animal.alimentar();
  renderizarCorral();
  mostrarToastCorral('🌽 ¡' + animal.nombre + ' alimentado!');
};

// ──────────────────────────────────────────────────────────────
// CICLO PRINCIPAL DEL CORRAL
// ──────────────────────────────────────────────────────────────

/**
 * tickCorral()
 * Se ejecuta en cada fotograma vía requestAnimationFrame.
 * Actualiza el estado de todos los animales.
 *
 * @param {DOMHighResTimeStamp} tiempoActual
 */
function tickCorral(tiempoActual) {
  if (!corralEstado.desbloqueado || corralEstado.animales.length === 0) {
    requestAnimationFrame(tickCorral);
    return;
  }

  if (!corralEstado._ultimoTick) {
    corralEstado._ultimoTick = tiempoActual;
  }

  let delta = (tiempoActual - corralEstado._ultimoTick) / 1000;
  corralEstado._ultimoTick = tiempoActual;

  // Actualizar cada animal
  corralEstado.animales.forEach(function (animal) {
    animal.crecer(delta);
    animal.tenerHambre(delta);
    animal.revisarEstado();
  });

  // Ciclo de producción / penalización
  corralEstado._tiempoDesdeProduccion += delta;
  if (corralEstado._tiempoDesdeProduccion >= CICLO_PRODUCCION) {
    ejecutarCicloProduccion();
    corralEstado._tiempoDesdeProduccion = 0;
  }

  renderizarCorral();
  requestAnimationFrame(tickCorral);
}

/**
 * ejecutarCicloProduccion()
 * Suma o resta oro según el estado de cada animal adulto.
 */
function ejecutarCicloProduccion() {
  let oroGanado  = 0;
  let oroPerdido = 0;

  corralEstado.animales.forEach(function (animal) {
    oroGanado  += animal.producirMonedas();
    oroPerdido += animal.penalizacionTriste();
  });

  if (oroGanado > 0) {
    estadoJuego.oro += oroGanado;
    mostrarToastCorral('🪙 Corral generó +' + oroGanado + ' monedas.');
  }
  if (oroPerdido > 0) {
    estadoJuego.oro = Math.max(0, estadoJuego.oro - oroPerdido);
    mostrarToastCorral('😢 Animales tristes... -' + oroPerdido + ' monedas.');
  }

  actualizarOroEnHUD();
}

// ──────────────────────────────────────────────────────────────
// RENDERIZADO
// ──────────────────────────────────────────────────────────────

/**
 * renderizarCorral()
 * Reconstruye el HTML del corral según el estado actual.
 */
function renderizarCorral() {
  let contenedor = document.getElementById('corral-terreno');
  if (!contenedor) return;

  if (!corralEstado.desbloqueado) {
    contenedor.innerHTML = renderizarCorralBloqueado();
    return;
  }

  let html = '<h2 class="corral-terreno-titulo">🐄 Corral de Animales</h2>';

  // Tienda de animales
  html += '<div class="corral-tienda">';
  html += '<p class="corral-tienda-titulo">Comprar animales:</p>';
  html += '<div class="corral-tienda-botones">';

  Object.keys(CATALOGO_ANIMALES_VISUAL).forEach(function (tipo) {
    let info = CATALOGO_ANIMALES_VISUAL[tipo];
    html += `
      <button class="corral-btn-comprar" onclick="comprarAnimal('${tipo}')"
              style="border-color: ${info.colorUI}">
        ${info.icono} ${info.nombre}
        <span class="corral-costo">${info.costoCompra} 🪙</span>
        <span class="corral-descripcion-mini">${info.descripcion}</span>
      </button>`;
  });

  html += '</div></div>';

  // Animales actuales
  if (corralEstado.animales.length === 0) {
    html += '<p class="corral-vacio">El corral está vacío. ¡Compra tu primer animal!</p>';
  } else {
    html += '<div class="corral-animales">';
    corralEstado.animales.forEach(function (animal, indice) {
      html += renderizarTarjetaAnimal(animal, indice);
    });
    html += '</div>';
  }

  contenedor.innerHTML = html;
}

/**
 * renderizarCorralBloqueado()
 * Devuelve el HTML del estado "bloqueado" del corral.
 * @returns {string}
 */
function renderizarCorralBloqueado() {
  return `
    <h2 class="corral-terreno-titulo">🔒 Corral de Animales</h2>
    <div class="corral-terreno-valla">
      <img src="images/vaca/vaca_bebe.webp" alt="Vaca bebé" class="corral-img corral-img-preview" />
      <img src="images/pollo/pollo_huevo.webp" alt="Huevo" class="corral-img corral-img-preview" />
      <div class="corral-bloqueo-info">
        <p>Desbloquea el corral para criar animales.</p>
        <p>Los animales adultos generan monedas automáticamente.</p>
        <p>¡Pero cuídalos! Un animal triste resta oro.</p>
        <button class="corral-btn-desbloquear" onclick="desbloquearCorral()">
          Desbloquear Corral — ${COSTO_DESBLOQUEO_CORRAL} 🪙
        </button>
      </div>
    </div>`;
}


// ════════════════════════════════════════════════════════════════
//  🎫 TICKET 4 — renderizarTarjetaAnimal()
//
//  Esta función genera el HTML de una tarjeta individual de animal.
//  Es el único método que debes implementar en este archivo.
//
//  Recibe un objeto 'animal' (instancia de Pollo o Vaca) y el
//  índice de su posición en el array (necesario para el botón).
//
//  Propiedades disponibles en el objeto 'animal':
//    animal.nombre             → "Pollo" o "Vaca"
//    animal.icono              → "🐔" o "🐄"
//    animal.colorUI            → color en HEX para el borde
//    animal.fase               → número: 0, 1 o 2
//    animal.nombresFases       → array: ["Huevo", "Pollito", "Adulto"]
//    animal.hambre             → número 0–100
//    animal.progresoFase       → número 0–100 (solo si no es adulto)
//    animal.estaTriste         → true o false
//    animal.renderizar()       → ruta de imagen según estado actual
//    animal.esAdulto()         → true si fase === 2
//
//  La tarjeta debe mostrar:
//    ✅ Imagen del animal (usa animal.renderizar() como src)
//    ✅ Nombre + fase actual  (ej: "🐔 Pollito")
//    ✅ Barra de hambre con el porcentaje actual
//    ✅ Barra de progreso de fase (solo si NO es adulto)
//    ✅ Botón "Dar Comida 🌽" → onclick="alimentarAnimal([indice])"
//    ✅ Si está triste: alguna indicación visual (emoji, texto, estilo)
//
//  Pista: usa template literals — backticks ` ` — igual que
//         generarTarjeta() en los ejercicios de clase anteriores.
//
//  Clases CSS ya disponibles (en styles/main.css):
//    .animal-card        → contenedor de la tarjeta
//    .animal-imagen      → imagen del animal
//    .animal-nombre-fase → encabezado con nombre y fase
//    .barra-contenedor   → fondo gris de cualquier barra
//    .barra-relleno      → parte coloreada de la barra (usa 'width' en %)
//    .barra-hambre       → relleno específico de la barra de hambre
//    .barra-progreso     → relleno específico de la barra de progreso
//    .animal-btn-alimentar → estilo del botón de alimentar
//    .animal-triste-aviso  → aviso rojo de animal triste
// ════════════════════════════════════════════════════════════════

/**
 * renderizarTarjetaAnimal()
 * @param {import('./Animal.js').Animal} animal
 * @param {number} indice
 * @returns {string} HTML de la tarjeta
 */
function renderizarTarjetaAnimal(animal, indice) {
  // TODO — Genera y retorna el HTML de la tarjeta del animal.
  //
  // Estructura sugerida (puedes adaptarla):
  //
  // <div class="animal-card" style="border-color: [colorUI del animal]">
  //
  //   <img class="animal-imagen" src="[imagen actual]" alt="[nombre]" />
  //
  //   <p class="animal-nombre-fase">
  //     [icono] [nombre de la fase actual]
  //   </p>
  //
  //   <!-- Barra de hambre -->
  //   <div>Hambre: [hambre redondeada]%</div>
  //   <div class="barra-contenedor">
  //     <div class="barra-relleno barra-hambre" style="width: [hambre]%"></div>
  //   </div>
  //
  //   <!-- Barra de progreso (solo si NO es adulto) -->
  //   ... (usa un if con un ternario o una variable auxiliar)
  //
  //   <!-- Aviso de triste (solo si estaTriste) -->
  //   ... (muestra algo si el animal está triste)
  //
  //   <button class="animal-btn-alimentar" onclick="alimentarAnimal([indice])">
  //     Dar Comida 🌽
  //   </button>
  //
  // </div>

  return '<p>TODO: implementar renderizarTarjetaAnimal()</p>';
}


// ──────────────────────────────────────────────────────────────
// UTILIDADES
// ──────────────────────────────────────────────────────────────

/**
 * actualizarOroEnHUD()
 * Actualiza el contador de oro en el HUD superior del juego.
 */
function actualizarOroEnHUD() {
  let elemento = document.getElementById('hud-oro');
  if (elemento) elemento.textContent = estadoJuego.oro;
}

/**
 * mostrarToastCorral()
 * Muestra un mensaje breve en el toast existente del juego.
 * @param {string} mensaje
 */
function mostrarToastCorral(mensaje) {
  let toast  = document.getElementById('toast-feedback');
  let textoEl = document.getElementById('toast-texto');
  if (!toast || !textoEl) return;

  textoEl.textContent = mensaje;
  toast.classList.remove('oculto');
  setTimeout(function () {
    toast.classList.add('oculto');
  }, 2500);
}

// ──────────────────────────────────────────────────────────────
// ARRANQUE
// ──────────────────────────────────────────────────────────────

/**
 * inicializarCorral()
 * Punto de entrada. Hace el primer render y arranca el bucle.
 */
function inicializarCorral() {
  renderizarCorral();
  requestAnimationFrame(tickCorral);
  console.log('[Corral] Módulo de animales iniciado.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarCorral);
} else {
  inicializarCorral();
}