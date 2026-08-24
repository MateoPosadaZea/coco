# Coco 🦜 — Guía para Claude (léela antes de tocar código)

App de una sola página (`index.html`) para que Mateo aprenda idiomas (ahora: francés A1). En vivo: https://mateoposadazea.github.io/coco/ (GitHub Pages, rama main). PWA en iPhone.

**La memoria completa del proyecto vive en el proyecto "Laboratorio" de claude.ai** (documentos `claude/coco-plan.md` y `claude/coco-app.html`). Este archivo es el resumen operativo para sesiones conectadas a este repo. Al terminar cambios: actualizar también los documentos del proyecto si tienes acceso.

## Reglas de oro del producto (decisiones de Mateo — NO cambiar sin su OK)
- **CERO CULPA**: jamás avergonzar por racha rota o errores; se celebra volver.
- **CERO INFLAR**: nada de títulos ni métricas que prometan de más; la "puerta" al portugués puede BAJAR si baja la solidez (es diseño, no bug).
- **LA PODA**: solo se agrega lo que él pide; lo podado no vuelve (podados: botón reto rápido, API de Claude en la app, tarjeta "frases de la sesión", ejercicios de teclear en blitz/listen).
- **TODO ES EJERCITABLE**: todo contenido visible lleva ⭐ → repasos; nada entra solo al SRS.
- Onboarding = UNA pregunta (el nombre). Sin formularios.
- Personalización = contenido jugable, nunca encuestas.

## Reglas técnicas (NO regresionar)
- `localStorage` clave **`lingualab_fr`** — NO renombrar. El saver es de LISTA FIJA: todo campo nuevo de S debe añadirse a save() Y load() (claves cortas: pc=paracaídas, sg=canciones, gl=graduadas, nm=nombre). makeCode/loadCode (v2) también.
- CSS: TODO color de superficie por variables en `:root` + redefinición en `body.dark`. PROHIBIDO hardcodear colores claros, también en estilos inline de JS (rompe el modo oscuro).
- Fechas siempre con `localISO()`/`todayStr()` (zona horaria local, no UTC).
- Voz: no tocar la maquinaria de speakFR/getMic/releaseMic sin leer los comentarios (12 arreglos acumulados). `releaseMic()` al terminar juegos de hablar y al ir a background (iOS mata la app si no).
- ☂️ `chute()`/`rescueChute()`: cada respuesta se respalda; no romper.
- Escenas nuevas: SIEMPRE con `themes:[...]`, `vars` para rejugabilidad, y `react`/`reactEs` en opciones buenas. El nombre "Mateo" en contenido nuevo se sustituye por S.name vía PRISTINE/applyName — contenido nuevo con "Mateo" literal está bien (el motor lo reemplaza).
- chipBuilder() reemplazó los inputs de teclear — no volver a dictados tecleados.
- Ediciones: probar con Playwright (chromium en /opt/pw-browsers) sirviendo por http (file:// rompe el mic), verificar 0 errores de consola, y subir el `index.html` COMPLETO. Footer lleva la versión (v1.XX) — súbela en cada cambio y verifícala en vivo tras el deploy.

## Flujo de trabajo
Mateo manda ideas/bugs por el 🪶 buzón de la app (→ issues de este repo, revisarlos cada sesión) o por chat. Claude construye, prueba, publica (push a main → Pages ~1-2 min) y verifica el footer en vivo con query anticaché.

## Estado (ago-2026)
v1.54: 18 temas · 24 misiones · 14 escenas · 18 giros · 8 juegos · bienvenida con nombre · modo libre · cancionero · quiz sorpresa · chuleta+verbos · paracaídas · modo oscuro. Próximos: modo aventura, portugués (pt-PT) al cruzar la puerta, números/comida/passé composé, conversación libre.
