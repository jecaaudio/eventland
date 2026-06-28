# Eventland

Pagina web bilingue para vender servicios de organizacion, decoracion y produccion de eventos, con sonido e iluminacion proporcionados por JECA Audio.

## Servicios incluidos

- Organizacion de eventos / Event planning
- Decoracion y ambientacion / Decor and ambiance
- Iluminacion profesional / Professional lighting
- Sonido por JECA Audio / Sound by JECA Audio
- Produccion tecnica / Technical production
- Fotografia / Photography

## Archivos principales

- `index.html`: landing page principal (servicios, paquetes, contacto), bilingue ES/EN.
- `rentas.html`: cotizador de inventario de rentas (manteles, mesas, sillas, decoracion).
- `styles.css`: estilos visuales y responsive compartidos por ambas paginas.
- `config.js`: configuracion centralizada (email de contacto, numero de WhatsApp).
- `assets/`: logos, favicon e iconos.

## Como correr el sitio localmente

Es un sitio estatico sin build ni dependencias. Basta con servirlo con cualquier servidor HTTP simple, por ejemplo:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000/index.html` o `http://localhost:8000/rentas.html`.

> Abrir los archivos `.html` directamente con `file://` tambien funciona, pero algunos navegadores son mas estrictos con `file://`, por lo que se recomienda un servidor local.

## Como actualizar el contacto

El email y el numero de WhatsApp se definen una sola vez en `config.js`:

```js
const EVENTLAND_CONFIG = {
  contactEmail: "contacto@jecaaudio.com",
  whatsappNumber: "15025332210",
};
```

Cambialos ahi y se reflejan automaticamente en ambas paginas.

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

## Limitaciones conocidas

- No hay backend: el formulario de contacto abre el cliente de correo del usuario (`mailto:`) y el cotizador de rentas abre WhatsApp; no se guarda nada en un servidor.
- No hay suite de tests ni linting automatizado.
- Las imagenes de categoria usan URLs de Unsplash; si el servicio cae, las imagenes no cargan.
