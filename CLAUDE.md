# Coco 🦜 — Guía para Claude (léela antes de tocar código)

App de una sola página (`index.html`) para que Mateo aprenda idiomas (ahora: francés A1). En vivo: https://mateoposadazea.github.io/coco/ (GitHub Pages, rama main). PWA en iPhone.

**La memoria completa del proyecto vive en el proyecto "Laboratorio" de claude.ai** (documentos `claude/coco-plan.md` y `claude/coco-app.html`). Este archivo es el resumen operativo para sesiones conectadas a este repo. Al terminar cambios: actualizar también los documentos del proyecto si tienes acceso.

## Reglas de oro del producto (decisiones de Mateo — NO cambiar sin su OK)
- **CERO CULPA**: jamás avergonzar por racha rota o errores; se celebra volver.
- **CERO INFLAR**: nada de títulos ni métricas que prometan de más; la "puerta" al siguiente idioma puede BAJAR si baja la solidez (es diseño, no bug).
- **LA PODA**: solo se agrega lo que él pide; lo podado no vuelve (podados: botón reto rápido, API de Claude en la app, tarjeta "frases de la sesión", ejercicios de teclear en blitz/listen).
- **TODO ES EJERCITABLE**: todo contenido visible lleva ⭐ → repasos; nada entra solo al SRS.
- Onboarding = UNA pregunta (el nombre). Sin formularios.
- Personalización = contenido jugable, nunca encuestas.

## Reglas técnicas (NO regresionar)
- 🔒 **LA CAJA FUERTE (v1.56-v1.59) — el progreso es intocable, esto es lo más delicado del archivo.**
  - La LISTA FIJA de campos vive en **`packState()`/`applyState()`** y en NINGÚN otro sitio. Todo campo nuevo de S se añade a las DOS. El guardado, el espejo, las fotos y makeCode/loadCode beben de ahí, así que ya no se pueden desincronizar (era el fallo clásico). Claves cortas: pc=paracaídas, sg=canciones, gl=graduadas, nm=nombre, lt=giros vistos.
  - Tres copias: **`lingualab_fr`** (NO renombrar NUNCA) · `lingualab_fr_bak` (espejo) · `lingualab_fr_snap` (7 fotos diarias, la del día solo mejora).
  - **`earnedWeight()` mide progreso GANADO** (⭐, días, graduadas, racha) y es lo que usa el CANDADO. NO usar `stateWeight()` (peso bruto) para decidir si un estado está vacío: la app siembra 11 frases sola al arrancar, así que un arranque recién borrado pesa ~220 y el candado se queda dormido — ese bug ya pasó una vez (v1.58).
  - Al cargar gana la copia con MÁS progreso, no la más nueva. Si el principal venía dañado, `store.rescued` avisa al arrancar.
  - 🗄️ Respaldo fuera del teléfono (Ajustes): 📄 archivo .txt (privado, recomendado) y ☁️ issue de GitHub. **El repo es PÚBLICO y el código va en base64, que no es cifrado** — el botón de GitHub debe seguir avisando de eso antes de abrir nada.
- 📴 **`sw.js` — RED PRIMERO para el HTML.** No cambiar a caché-primero: con red primero un deploy se ve al instante y el footer se puede seguir verificando en vivo. Caché-primero solo para iconos y manifest. El progreso NO vive en el caché.
- Los topes con borrado suelta **lo que menos falta hace**, nunca lo más antiguo: repasos (40) → `dropWeakest()`, caja más baja; graduadas (60) → `dropGraduada()`, la re-probada más recientemente. Un `shift()` ciego se lleva frases dominadas y baja la puerta sin que Mateo falle nada (bug real, v1.57/v1.61).
- CSS: TODO color de superficie por variables en `:root` + redefinición en `body.dark`. PROHIBIDO hardcodear colores claros, también en estilos inline de JS (rompe el modo oscuro).
- Fechas siempre con `localISO()`/`todayStr()` (zona horaria local, no UTC).
- Voz: no tocar la maquinaria de speakFR/getMic/releaseMic sin leer los comentarios (12 arreglos acumulados). `releaseMic()` al terminar juegos de hablar y al ir a background (iOS mata la app si no).
- ☂️ `chute()`/`rescueChute()`: cada respuesta se respalda; no romper.
- Escenas nuevas: SIEMPRE con `themes:[...]`, `vars` para rejugabilidad, y `react`/`reactEs` en opciones buenas. El nombre "Mateo" en contenido nuevo se sustituye por S.name vía PRISTINE/applyName — contenido nuevo con "Mateo" literal está bien (el motor lo reemplaza).
- chipBuilder() reemplazó los inputs de teclear — no volver a dictados tecleados.
- Ediciones: probar con Playwright (chromium en /opt/pw-browsers) sirviendo por http (file:// rompe el mic), verificar 0 errores de consola, y subir el `index.html` COMPLETO. Footer lleva la versión (v1.XX) — súbela en cada cambio y verifícala en vivo tras el deploy.

## Flujo de trabajo
Mateo manda ideas/bugs por el 🪶 buzón de la app (→ issues de este repo, revisarlos cada sesión) o por chat. Claude construye, prueba, publica (push a main → Pages ~1-2 min) y verifica el footer en vivo con query anticaché.

## La puerta al siguiente idioma (para no volver a diagnosticarla desde cero)
`pct` = promedio de **5** partes (v1.62), cada una tope 100%: 🗓️ días/21 · ⭐/26.000 · 🌶️ tier de "mix"/3 · 🎓 memoria/30 · 🎙️ misiones de Improvisa clavadas/15.
Las tres primeras **solo suben**. Las otras **bajan por diseño**: el 🌶️ baja con <50% de acierto en una tanda, y la memoria baja al recaer en una frase de caja ≥3 **y también** al fallar una graduada en el ⚡ quiz (ahí `S.grad` resta uno — CERO INFLAR). Una caída de ~20 puntos = una parte entera. Si Mateo pregunta por su %, mirar las 5 barras (salen al tocar la tarjeta de la puerta) antes de tocar nada.

**El % ya no abre el siguiente idioma: lo abre el 📜 examen** (`S.exam.passed`). El % es solo el medidor del día a día.

**Orden de idiomas (v1.65, cambio de prioridades de Mateo): 🇫🇷 francés → 🇮🇹 ITALIANO → 🇵🇹 portugués.** Antes era portugués primero. La puerta y el examen apuntan al italiano. Para volver a cambiar el orden solo se intercambian los objetos `META` y `LUEGO` en `renderLangs()` — todos los textos salen de ahí. Sigue siendo UN idioma a la vez.

## 📜 El examen de salida (v1.62)
Cuatro secciones de 4: 🎧 entender · 🧩 armar · 🎙️ decir · ⚡ improvisar con reloj de 25 s.
- **Se aprueba con 3/4 en CADA sección, NUNCA por promedio.** Promediando se pasa a punta de reconocimiento, que es justo lo flojo de Mateo ("muy nulo para una conversación espontánea"). No tocar esta regla.
- **No da ⭐** — un examen se aprueba, no se farmea. Y lo fallado entra solo a repasos (CERO CULPA: es un mapa, no un portazo).
- Califica el habla por **familias de palabras clave** (`IMPROV[].keys`), no por frase exacta: es lo que aguanta que el reconocedor de voz falle. Si no hay micrófono se autocalifica y el informe lo dice.
- 🎙️ Improvisa ya medía producción y la puerta lo ignoraba (bug de diseño hasta v1.61). `markSpoken()` alimenta `S.spoken`.
- Lo que falta para llevar esto más lejos: **más misiones en `IMPROV`** (hoy 23) — es el cuello de botella del examen y del entrenamiento. Conversación libre de verdad exigiría devolver la API de Claude, que está PODADA: es decisión de Mateo, no se hace por iniciativa propia.

## Estado (ago-2026)
v1.65: 18 temas · 24 misiones · 14 escenas · 18 giros · 8 juegos · bienvenida con nombre · modo libre · cancionero · quiz sorpresa · chuleta+verbos · paracaídas · modo oscuro · 🔒 caja fuerte · 🗄️ respaldo fuera del teléfono · 📴 funciona sin señal · 📜 examen de salida.
Próximos: modo aventura, italiano (it-IT) al cruzar la puerta, números/comida/passé composé, conversación libre.

## Aprendido a la mala (ago-2026)
- Mateo **perdió su progreso** cuando el navegador borró los datos del sitio (posiblemente por una "recarga forzada" que en iPhone significa borrar datos del sitio — cuidado con sugerirle eso). La caja fuerte nació después y no pudo rescatarlo. Recordarle guardar el 📄 archivo de vez en cuando: es lo único que sobrevive a eso.
- El entorno remoto de Claude Code **bloquea `github.io`** por política de red: no se puede verificar el footer en vivo desde la sesión. Se verifica el deploy por la API de GitHub (workflow "pages build and deployment" del commit) y se le pide a Mateo la confirmación visual.
- No encadenar varias suites de Playwright en un solo comando: se queda sin memoria. Una por una.
