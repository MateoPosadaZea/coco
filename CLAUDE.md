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
- **EL NOMBRE ES COCO, y está decidido (oct-2026).** Mateo consideró «Amalia» por su abuela y lo resolvió él mismo: *«coco solo entonces mejor y ya… coco me recuerda a mi abuela también, la de la película»*. Coco ya lleva a la abuela dentro, así que no hay que elegir. **No reabrir el tema ni proponer renombres** (ni «Coco + una palabra»): se evaluó y se descartó. Amalia queda reservada para otro proyecto suyo.

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
- 🎙️ **NUNCA guardar un cambio automático de modo de voz (v1.85).** Hasta la v1.84, dos tomas mudas en ¡Suéltalo! pasaban a Mateo a «Yo me califico» **y lo guardaban para siempre**: tras un bug viejo quedó atrapado y ¡Suéltalo! y la voz del 📜 examen dejaron de intentar reconocerlo (en Improvisa sí le funcionaba porque ese juego no mira la preferencia — prueba de que su reconocedor sirve). Ahora el respaldo es **solo por la sesión** (`vozSoloHoy`) y `S.prefs.srFails` se pone en 0 en cada arranque. `S.prefs.vg="self"` solo lo pone **su propio botón** en Ajustes. Hay prueba que simula iPhone con un reconocedor falso, y que reproduce el fallo en la versión anterior.
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
- Lo que falta para llevar esto más lejos: **más misiones en `IMPROV`** (45 desde v1.78; eran 23) — es el cuello de botella del examen y del entrenamiento. Conversación libre de verdad exigiría devolver la API de Claude, que está PODADA: es decisión de Mateo, no se hace por iniciativa propia.

## 📈 El medidor se queda quieto aunque haya avance (v1.78)
Mateo: *"No siento avance, veo el mismo 85% de hace rato"*. **No era un bug del número, era un límite del número**: con ⭐ y 🌶️ al tope de lo que mide la puerta, el % solo lo mueven 🗓️ días, 🎓 memoria (ritmo de calendario, mín. 11 días por frase) y 🎙️ misiones. Puede jugar una semana entera, mejorar, y ver el mismo %.
- `S.week` = **marcas diarias** de las 5 partes (una por día, últimas 12). `refSemana()` compara contra la más nueva que ya cumplió 7 días. ⚠️ Una sola foto NO sirve: si se refresca al cumplir los 7 días, la comparación vale cero justo el día en que empieza a servir (lo cazó la prueba, no el ojo).
- `renderMovimiento()` en 📈 Mi progreso dice **qué subió** y, sobre todo, **cuál es la única parte que queda**. Sin culpa si no se movió.
- `misionesDeHoy()`: 🎭 Improvisa sortea primero entre las misiones NO clavadas. El listón no baja (hay que tocar todas las claves); lo que cambia es que no le gasta el turno en algo ya ganado — al azar, la barra 🎙️ se movía a la mitad de velocidad.
- Al añadir misiones a `IMPROV`: el modelo de Coco **debe** tocar todas sus propias claves, o la misión es imposible. Hay prueba para eso, y otra que verifica que una misión no se clave con la respuesta de otra (la #14 es laxa a propósito: es abierta).

## 🎭 Improvisar es el cuello de botella REAL (v1.79)
Datos de Mateo (oct-2026, sus capturas): 💬 Conversación 100% · 🎤 Pronunciación 100% · 📖 Lectura 94% · 👂 Oído 93% · 🧩 Armar 83% · 📚 Vocabulario 75% · **🎭 Improvisar 25%**. Y sus 5 partes: 🗓️ 27/21 ✅ · ⭐ 87.692/26.000 ✅ · 🌶️ 5/3 ✅ · 🎓 27/30 · 🎙️ 5/15 → 84,67% = su 85%. **Lo único que lo separa del 100% es improvisar.**
- El reintento tras fallar una misión **se medía por parecido a la frase de Coco**: con 25% de acierto, 3 de cada 4 misiones le terminaban en transcribir, que es lo contrario del ejercicio. Desde v1.79 el 2º intento se vuelve a medir **por claves**. Decir la frase de Coco sigue cerrando (nadie se atasca), pero deja de ser el único camino.
- 🔒 CERO INFLAR: el reintento da ⭐ y cierra la misión, pero **NO** suma a `S.spoken` (barra 🎙️) ni a `recordSkill` — esas siguen midiendo solo el primer intento, sin ayuda. Se dice en pantalla, no se esconde.

## 🎨 La identidad (v1.80 — tanda 1 de 3)
Mateo: *«está muy IA… debe verse prolijo, amigable, divertido y elegante… es tu compañera»*. Tenía razón y las causas eran medibles:
- **La paleta eran los swatches A200/A400 de Material tal cual.** CUATRO no pasaban contraste con el texto blanco que llevan encima: verde `#00C853` **2,24:1** · amarillo **1,41** · naranja **2,26** · rosa **3,33** (mínimo 4,5). Los siete nuevos pasan. **Mismos NOMBRES de variable**, otros valores: nada estructural cambió.
- El verde `#16794E` sirve para los DOS temas (5,41 con blanco · 5,11 sobre papel · 3,28 sobre noche), así que `body.dark` **solo redefine superficies**. Una paleta, no dos que se desincronicen.
- Tokens nuevos: `--onColor`/`--onYellow` (tinta que va ENCIMA de un color; `--ink` no sirve porque se invierte) y `--toastBg`/`--toastInk`.
- 🐛 **El aviso (toast) llevaba meses invisible en oscuro**: `background:var(--ink)` + `color:#fff` = crema sobre crema. Salía en las capturas de Mateo.
- 🐛 **Las fuentes nunca se cargaron**: se pedían `Baloo 2`/`Nunito` sin enlace a Google Fonts. Ahora se enlazan Fraunces (display) + Figtree (interfaz) con respaldo `ui-serif`/`New York` y `-apple-system`, que en iPhone ya se ven bien **sin señal**. Si alguna vez estorba la dependencia, se quita la etiqueta `<link>` y queda el sistema.
- El «todo en negrita» vivía en `.bubble` y `.hint` a 700. Los botones son Figtree (interfaz), no serif.
- `cifra()` pone el separador de miles: `87692` → `87.692`.
- ~~Falta la tanda 2~~ (hecha en v1.83, ver abajo). Falta la **tanda 3** (sacar los emoji de dentro de las frases: 912 en total, 182 distintos). El personaje elegido por Mateo: **cara frontal + cuerpo entero**, el mismo loro a dos distancias.

## 🎯 Simplificar la experiencia (v1.81 — tanda 1b)
Mateo, al ver la v1.80: *«cambió la tipografía pero el diseño ui se ve igual… podemos simplificar la experiencia, el texto, las opciones»*. Tenía razón: la v1.80 cambió la **pintura** y no el **reparto**, que era lo que la maqueta aprobada proponía.
- **UNA acción principal.** `.cta` (verde, con subtítulo) para «Sesión de hoy». Antes había dos botones gordos de colores distintos (verde y rosa) compitiendo, más cinco pequeños en fila.
- **Segundo nivel = `.opt`**: superficie, borde, icono en caja, subtítulo y chevron; se hunden al tocarlos. Tienen que SENTIRSE botones sin competir con el verde (Mateo pidió esto explícitamente al ver la maqueta).
- **`<details class="card plegable">`** para «Temas y vocabulario» y «Pregúntale a Coco»: siguen enteros, dejan de estorbar. Mateo usa los temas como glosario, no para jugar.
- Se quitaron el título «Tu misión de hoy 🎯» y su párrafo (ahora son el subtítulo del botón) y la pista de Inmersión (es el subtítulo de su opción).
- El saludo era un marcador (*«Llevas 87.692 ⭐ y racha de 2 🔥»*). Ahora: *«Bonjour, Mateo. Qué bueno verte.»* Lo primero que dice una compañera no son tus cifras.
- 🐛 Los textos del nivel seguían diciendo **🇵🇹 puerta**: la puerta apunta al 🇮🇹 italiano desde la v1.65.
- `cifra()` también en los números del nivel (`15.692 / 20.000`).
- **Medido**: el botón de jugar queda a 518px del tope (entra sin scroll en un iPhone). Hay prueba que verifica que los 33 ids del inicio sobreviven y que los cuatro botones siguen abriendo su juego.

## ☀️ Coco al sol (v1.84) — MANDA SOBRE LAS SECCIONES DE IDENTIDAD ANTERIORES
Mateo: *«algo más alegre, más fresco, no tan oscuro… fondo piel, no blanco, y azul cielo… aprender idiomas tirado en un pasto viendo el cielo azul, un día soleado… entrar al app, nubes moviéndose»*. Y sobre el personaje: *«por alguna razón me la imagino a ella [su abuela] sonriendo… el ave sirve pero la ilustración aún no»*. Eligió de una galería de 4: **la nube y el coco**.
- **Paleta** (mismos nombres de variable): `--bg` piel `#FBE6D4` · `--card` crema `#FFF8F0` · `--ink` azul noche `#1D2F45` · **acción = `--blue` `#1871BA`** (azul cielo hondo: blanco encima 5,1:1, se recorta sobre la piel 4,2:1) · `--green` `#2F7D3B` = **acierto**, ya no es la marca · `--yellow` sol `#FFC94A` · `--celebra` `#8A5A12` (texto de puntos, 4,9:1 sobre piel). ⚠️ El **azul cielo claro solo va en el cielo**: sobre la piel un botón azul claro mide 1,48:1 y no se ve dónde empieza.
- **Noche** = cielo azul marino con luna (`--bg #14223A`), no casi-negro.
- **Letra: Nunito** en todo (400–900), con respaldo `ui-rounded`/SF Pro Rounded, que en iPhone se ve bien sin señal. Fuera Fraunces y Figtree.
- **El cielo del inicio** (`.escena`): degradado, sol que respira, 4 nubes con `deriva`, lomas de pasto, Coco dentro. ⚠️ Coco se centra con `left:0;right:0;margin-inline:auto` y **no** con `transform`: la animación de flotar usa `transform` y lo pisaría.
- **Personaje**: `cocoChar(px, animo)`; `cocoPj()` lee `S.prefs.pj` (`"nube"` por defecto, o `"coco"`), que se escoge en **Ajustes → Tu Coco** y viaja en la caja fuerte dentro de `pr`. La nube **flota**; el coco **se sienta en el pasto**. Animos: `feliz · guino · uy · duerme · escucha · celebra`. La boca va en `<g class="cboca">` (se mueve al hablar).
- **REGLA DEL PERSONAJE — no regresionar: LA SONRISA.** Ojos cerrados en arco, mejillas, boca pequeña: la cara de alguien que te mira con cariño. Solo `uy` abre los ojitos (sorpresa, nunca regaño). El loro tenía ojos abiertos y fijos, y eso era lo que no convencía.
- Reacciones sin tocar la voz: igual que v1.83 (`ding()` + `MutationObserver` de la clase `rec`).
- ☀️ **Migración única** (`S.prefs.dia184`): Mateo tenía el modo oscuro activado; al primer arranque de la v1.84 se apaga UNA vez con aviso. Si luego vuelve a escoger noche, se respeta.
- Iconos = la nube sobre cielo, generados desde `cocoChar`; `sw.js` → `CACHE="coco-v3"`.
- El chiste del tío (*«¿y quién te enseña?»*) pasó de «un loro» a **«Un nuage qui s'appelle Coco»**.

## 🦜 Coco dibujada (v1.83 — tanda 2 de la identidad) · REEMPLAZADO en v1.84 (queda como historia)
Mateo eligió en una galería de 6 bocetos **la cara frontal (v1) + el cuerpo entero (v6)**: el mismo loro a dos distancias. Vive en `cocoCara(px, animo)` y `cocoCuerpo(px, pose)`; `cocoFace(px)` es la cara dentro del texto (cada 🦜 de `withCoco()`).
- **Reglas del personaje — no regresionar:** DOS OJOS siempre (el primer boceto, un ojo enorme de perfil, «daba miedo, como un zombie»). Colores propios `--p1..--p5`, `--pPupila`, `--pBrillo`, `--pPico` — nunca los de la interfaz. Mejillas en **verde claro**, no coral (coral translúcido sobre verde = color barro). El pico va en `<g class="cpico">` para aletear al hablar.
- **Estados**: caras `feliz · guino · uy · duerme · escucha`; poses `saluda · celebra · escucha · duerme`.
- **Reacciona sin tocar la voz**: `ding()` (suena en cada respuesta de todos los juegos) → guiña al acertar, se sorprende al fallar (sin regañar: CERO CULPA) y vuelve sola. Un `MutationObserver` sobre `#gameArea` ve la clase `rec` (= micrófono grabando en TODOS los juegos de hablar) → ladea la cabeza para escuchar. **No se tocó speakFR/getMic/releaseMic.**
- Inicio: saluda; si `diasDesde(S.lastDay)>=3`, **celebra** (se celebra volver). Tocarla: celebra 1,6 s. Resultados: celebra con acierto ≥60 %, si no saluda (antes: medallas 🏆🥈🥉🎖️).
- **Iconos generados desde la misma función** (icon192/512.png, apple-touch-icon embebido, favicon SVG con colores literales porque en un data URI las variables no existen). `sw.js` → `CACHE="coco-v2"` para soltar los iconos viejos (caché-primero).
- 🧹 Barrido: un **bloque entero de `body.dark` con la paleta VIEJA a mano** (lavanda `#7C93FF`, grises morados) sobrevivió a la v1.80 por no ser variable: bordes de las opciones de todos los juegos, «Mi progreso»/«Ajustes», enlaces, campos. Ahora todo sale de tokens (`--link`, `--badInk`, `--goodInk` nuevos). 🐛 La colita de la burbuja era **blanca en oscuro**. Las 9 sombras de bloque `0 Npx 0` → `var(--shadow)`.
- Cabecera de juego: reto «🌶️ 5» en vez de cinco chiles; progreso en rayitas; barra de tiempo de 4px.
- **Falta la tanda 3**: sacar los emoji de dentro de las frases (912, 182 distintos) y la pantalla de resultados/ajustes, que conserva textos en negrita del diseño viejo.

## 🌴 Quién es Mateo HOY (oct-2026 — contado por él, úsalo para el contenido)
Vive en **Barranquilla** (costa caribe) — ya NO en Bogotá. Tiene su empresa, **Matriz** (diseño y desarrollo de software), y la está sacando adelante; su idea de fondo: *«ayudar a la gente, ayudar y ayudar»*. Tiene una gata, **Cliff**. Le gustan el **fútbol** y el **boxeo**, las buenas series (está viendo **Mad Men**), las películas, los libros y la música. Ama la playa y el calor; sueña con vivir en la costa o en **Portugal**. Hace ejercicio. Quiere aprender, conocerse, disfrutar, **relajarse cada vez más**, sonreír, ayudar a su familia y consentir a sus papás.

## 🔁 «Esto se repite demasiado» (v1.82)
- **El bucle**: en «armar la frase» UN tropiezo mandaba la frase a caja 0 **con fecha de hoy** → volvía en cada sesión. Ahora `markWeak()` la programa para **mañana** (`inDays(1)`). Sigue cayendo a caja 0, así que la 🎓 memoria sigue bajando al recaer (regla de la puerta intacta).
- **Contenido**: «Mi oficio» → **«Mi empresa»** (Matriz); «Mi mundo» con lo que quiere ahora; temas nuevos **`chezmoi`** («Barranquilla y Cliff») y **`loisirs`** («Lo que me gusta»), cada uno con su escena (`barranquilla-visita`, `series-amigo`). Bogotá → Barranquilla en temas, escenas y misiones (en las claves de misión se dejó «bogota» como alternativa). 7 misiones nuevas → **52**. Ahora son **20 temas**.
- «**minette**», no «chatte», para su gata: «chatte» tiene doble sentido vulgar.

## Estado (ago-2026)
v1.65: 18 temas · 24 misiones · 14 escenas · 18 giros · 8 juegos · bienvenida con nombre · modo libre · cancionero · quiz sorpresa · chuleta+verbos · paracaídas · modo oscuro · 🔒 caja fuerte · 🗄️ respaldo fuera del teléfono · 📴 funciona sin señal · 📜 examen de salida.
Próximos: modo aventura, italiano (it-IT) al cruzar la puerta, números/comida/passé composé, conversación libre.

## Aprendido a la mala (ago-2026)
- Mateo **perdió su progreso** cuando el navegador borró los datos del sitio (posiblemente por una "recarga forzada" que en iPhone significa borrar datos del sitio — cuidado con sugerirle eso). La caja fuerte nació después y no pudo rescatarlo. Recordarle guardar el 📄 archivo de vez en cuando: es lo único que sobrevive a eso.
- El entorno remoto de Claude Code **bloquea `github.io`** por política de red: no se puede verificar el footer en vivo desde la sesión. Se verifica el deploy por la API de GitHub (workflow "pages build and deployment" del commit) y se le pide a Mateo la confirmación visual.
- No encadenar varias suites de Playwright en un solo comando: se queda sin memoria. Una por una.
- **Antes de inventar un nombre de clase CSS, búscalo.** La v1.81 creó `.opt` para los botones del inicio sin ver que `.opt` YA ERA la clase de las opciones de respuesta de todos los juegos: la regla nueva, al venir después, les pisó el estilo (francés y español lado a lado, sin negrita) y salió publicado. Lo cazó la prueba de la v1.82. Los del inicio son ahora `.hopt`.
