# Eventland

Pagina web bilingue para vender servicios de organizacion, decoracion y produccion de eventos.

## Servicios incluidos

- Organizacion de eventos / Event planning
- Decoracion y ambientacion / Decor and ambiance
- Iluminacion profesional / Professional lighting
- Sonido profesional / Professional sound
- Produccion tecnica / Technical production

## Archivos principales

- `index.html`: landing page principal (servicios, paquetes, contacto), bilingue ES/EN.
- `rentas.html`: cotizador de inventario de rentas (manteles, mesas, sillas, decoracion).
- `styles.css`: estilos visuales y responsive compartidos por ambas paginas.
- `config.js`: configuracion centralizada (numero de WhatsApp).
- `assets/`: logos, favicon e iconos.

## Como correr el sitio localmente

Es un sitio estatico sin build ni dependencias. Basta con servirlo con cualquier servidor HTTP simple, por ejemplo:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000/index.html` o `http://localhost:8000/rentas.html`.

> Abrir los archivos `.html` directamente con `file://` tambien funciona, pero algunos navegadores son mas estrictos con `file://`, por lo que se recomienda un servidor local.

## Como actualizar el contacto

El numero de WhatsApp se define una sola vez en `config.js`:

```js
const EVENTLAND_CONFIG = {
  whatsappNumber: "15025332210",
};
```

Cambialo ahi y se refleja automaticamente en ambas paginas (formulario de contacto y cotizador de rentas).

## Como agregar o editar productos de renta

El inventario vive en el array `inventory` dentro del `<script>` de `rentas.html`. Cada categoria tiene esta forma:

```js
{ category: "Manteles", items: [
  { name: "Mantel redondo", types: ["Redondo 90 in", "..."], colors: ["Blanco", "..."] },
]}
```

Para agregar una categoria nueva, tambien hay que sumar su imagen de portada en el objeto `categoryImages`.

## Como agregar un idioma o texto nuevo (index.html)

Los textos de `index.html` viven en el objeto `translations` (claves `es` y `en`) dentro del `<script>` final. Cada texto visible en el HTML usa un atributo `data-i18n="claveDeTraduccion"` que `setLanguage()` resuelve en tiempo de ejecucion. Para agregar un texto nuevo: agrega la clave en ambos idiomas dentro de `translations` y referenciala con `data-i18n` en el HTML.

## Red de seguridad automatica (CI)

Cada vez que se sube codigo a GitHub, una revision automatica (en `.github/workflows/ci.yml`) abre `index.html` y `rentas.html` en un navegador real y comprueba que:

- No haya errores de JavaScript al cargar la pagina.
- El menu de celular se pueda abrir y cerrar.
- Se puedan agregar productos a la cotizacion y que el boton de WhatsApp se active.

Si algo se rompe, GitHub marca el cambio con una "X" roja antes de que llegue a producirse un problema real para los usuarios. Para correr esta misma revision en tu computadora:

```bash
npm install
npx playwright install --with-deps chromium
npm test
```

## Limitaciones conocidas

- No hay backend: tanto el formulario de contacto como el cotizador de rentas abren WhatsApp; no se guarda nada en un servidor.
- No hay linting automatizado de estilo de codigo (solo la revision funcional de CI descrita arriba).
- Las imagenes de categoria usan URLs de Unsplash; si el servicio cae, las imagenes no cargan.
