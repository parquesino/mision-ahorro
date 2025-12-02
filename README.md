# Misión Ahorro — Web App (SPA)

Propósito:
- Enseñar educación financiera a tres niños mediante una interfaz gamificada.
- Guardar datos en el navegador (localStorage) para persistencia.

Características principales:
- Presupuesto Base: 200€ semanales.
- Meta de Tiempo: 7 días.
- Cálculo del "Bote de Premios":
  - Ahorro por compra: si gastan menos de 200€, el 10% del sobrante va al bote.
  - Ahorro por tiempo: por cada día que el mercado dura más de 7 días, se añade 10% del ahorro teórico por día (200€ / 7 ≈ 28.57€/día).
  - El total del bote se divide equitativamente entre los 3 niños.
- Persistencia con localStorage:
  - Estado actual guardado con la key `misionAhorro_state`.
  - Historial guardado con la key `misionAhorro_history`.
- Pestañas: Gasto, Días, Historial.
- Pestaña Gasto: input grande, barra de progreso visual.
- Pestaña Días: contador (- / +) y visualización tipo calendario para 7 días (y días extra).
- Cards de Personajes con estilo: Simón (Minecraft), Mateo (Brawl), Violeta (Bluey).
- Botón "Cerrar Semana" guarda la semana en historial y reinicia estado.

Cómo usar:
1. Abre `index.html` en un navegador moderno.
2. En "Gasto" escribe el total del ticket. La barra muestra cuánto queda del presupuesto.
3. En "Días" ajusta cuántos días duró el mercado. La cuadrícula muestra los días y los extras.
4. Observa los montos que aparecen en las tarjetas (se actualizan automáticamente).
5. Pulsa "Cerrar Semana (guardar resultado)" para guardar en el historial y reiniciar la semana.
6. El historial se puede borrar con el botón "Borrar historial".

Archivos:
- `index.html` — Estructura HTML y vista.
- `styles.css` — Estilos y temas de los personajes.
- `app.js` — Lógica de negocio, persistencia y comportamiento.

Notas de desarrollo y mejoras posibles:
- Añadir sonidos y microanimaciones para reforzar la gamificación.
- Hacer PWA (instalable) para uso offline en móviles.
- Añadir export/import del historial como JSON.
- Permitir perfiles individuales por niño (si deseas llevar puntajes independientes).

Licencia: código libre para uso educativo y modificaciones.
