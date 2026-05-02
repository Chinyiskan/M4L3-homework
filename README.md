# **🐔🐄 Misión: Animales en el Corral**

## **Asignación del Tech Lead para el Equipo de Desarrollo de *PixelHarvest* | Sprint M4W3**

**Cliente:** *PixelSprout Games*  
**Objetivo:** Implementar la mecánica de **Pollos** y **Vacas** en el sistema de corral, usando **herencia** y las clases base proporcionadas.  
**Contexto:** *El cliente quiere expandir su juego de granja para incluir animales que produzcan recursos pasivamente. Los jugadores podrán comprar animales, alimentarlos, y obtener beneficios como monedas o productos.*

---

---

## **📜 Mensaje del Tech Lead (Camilo Charry)**

*"¡Hola, equipo!*

El cliente *PixelSprout Games* está emocionado con el progreso de su juego de granja. **Ya implementamos los cultivos (Maíz, Fresa, Berenjena) en clase**, y ahora es el momento de llevar el juego al siguiente nivel: **¡los animales!**

El cliente quiere que los jugadores puedan **comprar Pollos y Vacas**, colocarlos en un corral, y que estos animales **crezcan, produzcan recursos y generen ingresos pasivos**. **Tu misión es implementar las clases `Pollo` y `Vaca**` usando herencia de la clase base `Animal`, siguiendo el mismo patrón que usamos con los cultivos.

**Requisitos clave:**

- Usar `extends` para heredar de `Animal`.
- Configurar correctamente el constructor con `super()`.
- Implementar las propiedades y comportamientos específicos de cada animal.
- **No modificar** los archivos `Animal.js` ni `Corral.js` (ya están listos).

**Plazo:** Esta tarea es **individual** y debe entregarse antes de la próxima sesión de revisión. **¡El cliente confía en ustedes!**

---

*— Camilo Charry, Tech Lead en LevelUp Code"*

---

---

## **🌍 Lore del Cliente: PixelSprout Games**

*PixelSprout Games* es un estudio indie que desarrolla juegos de simulación agrícola. Su último proyecto, **"PixelHarvest"**, permite a los jugadores construir y administrar su propia granja virtual. Después del éxito de la mecánica de cultivos, el cliente quiere **agregar animales** para enriquecer la experiencia.

**Visión del cliente:**

- Los animales deben ser **fáciles de entender** pero con **personalidad única**.
- Los jugadores deben poder **comprarlos, alimentarlos y cosechar sus beneficios**.
- El sistema debe ser **escalable**: en el futuro, se añadirán más animales (ovejas, cerdos, etc.).

**Tu rol:**  
Eres un **desarrollador junior** en el equipo de *PixelHarvest*. Tu trabajo es implementar las clases `Pollo` y `Vaca` para que los jugadores puedan interactuar con ellos en el corral.

---

---

## **🎫 Tickets de Desarrollo**

---

### **📌 Ticket 1: Clase `Pollo**`

**Descripción:**  
El pollo es el animal **"rápido y barato"** del juego. Es ideal para jugadores que quieren **ganancias rápidas pero modestas**.

**Requisitos:**

- **Fases de crecimiento:** `Huevo` → `Pollito` → `Adulto`.
- **Tiempo por fase:** 20 segundos.
- **Producción:** 20 monedas por ciclo (solo cuando es `Adulto`).
- **Costo de compra:** 75 oro.
- **Propiedades visuales:**
  - `icono`: Emoji de pollo.
  - `colorUI`: Color dorado (`#FFD700`).

**Pistas:**

1. **Herencia:** Usa `extends Animal` para que `Pollo` herede de `Animal`.
2. **Constructor:** Llama a `super()` en el constructor de `Pollo` para inicializar las propiedades heredadas.
3. **Parámetros:** Revisa `Animal.js` para saber qué parámetros espera el constructor de `Animal`.
4. **Propiedades propias:** Agrega `this.icono` y `this.colorUI` **después** de llamar a `super()`.

---

### **📌 Ticket 2: Clase `Vaca**`

**Descripción:**  
La vaca es el animal **"lento pero valioso"** del juego. Es ideal para jugadores que prefieren **inversiones a largo plazo con altos retornos**.

**Requisitos:**

- **Fases de crecimiento:** `Ternero` → `Adulto`.
- **Tiempo por fase:** 60 segundos.
- **Producción:** 100 monedas por ciclo (solo cuando es `Adulto`).
- **Costo de compra:** 200 oro.
- **Propiedades visuales:**
  - `icono`: Emoji de vaca.
  - `colorUI`: Color marrón (`#8B4513`).

**Pistas:**

1. **Herencia:** Usa `extends Animal` para que `Vaca` herede de `Animal`.
2. **Constructor:** Asegúrate de llamar a `super()` con los parámetros correctos.
3. **Fases:** La vaca tiene **solo dos fases** de crecimiento.
4. **Propiedades propias:** No olvides definir `this.icono` y `this.colorUI`.

---

---

## **📋 Checklist de Entrega**

Antes de enviar tu código, verifica que:

- La clase `Pollo` se puede instanciar sin errores en la consola.
- La clase `Vaca` se puede instanciar sin errores en la consola.
- Ambos animales tienen las **fases de crecimiento correctas**.
- Ambos animales tienen los **valores de producción y costo** configurados.
- Las propiedades `icono` y `colorUI` están definidas para cada animal.
- **No modificaste** los archivos `Animal.js` ni `Corral.js`.
- El corral puede **agregar y gestionar** instancias de `Pollo` y `Vaca`.

---

---

## **🔍 Referencia Rápida: Valores de los Animales**


| Animal | Tiempo por Fase | Producción (monedas) | Costo de Compra | Fases                    |
| ------ | --------------- | -------------------- | --------------- | ------------------------ |
| Pollo  | 20 segundos     | 20                   | 75 oro          | Huevo → Pollito → Adulto |
| Vaca   | 60 segundos     | 100                  | 200 oro         | Ternero → Adulto         |


---

---

## **💡 Consejos del Tech Lead**

1. **Revisa el código de los cultivos:** El patrón que usamos para `Maiz`, `Fresa` y `Berenjena` es **idéntico** al que debes usar aquí.
2. **Prueba en consola:** Instancia un `Pollo` y una `Vaca` para verificar que no haya errores.
3. **Herencia > Copiar/Pegar:** Usa `extends` y `super()` para evitar duplicar código.
4. **Sé meticuloso:** Asegúrate de que los nombres de las fases y los valores numéricos coincidan con los requisitos.

---

---

## **📢 Mensaje Final**

*"El cliente está ansioso por ver los animales en acción. **¡Hagan que el corral cobre vida!** Si tienen dudas, revisen el código de los cultivos que hicimos en clase: el patrón es **idéntico**.

¡A codificar, equipo! 🚀"*

---

*The Bit Masters © 2026 — Sprint M4W3 · PixelHarvest para PixelSprout Games*