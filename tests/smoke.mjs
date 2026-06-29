// Prueba automatica basica: abre cada pagina en un navegador real (sin pantalla)
// y falla si hay errores de JavaScript o si las partes clave no funcionan.
// Esto sirve como red de seguridad antes de publicar cambios.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const port = 8932;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

const server = createServer(async (req, res) => {
  try {
    const filePath = join(root, decodeURIComponent(req.url.split("?")[0]));
    const data = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});

function listen() {
  return new Promise((resolve) => server.listen(port, resolve));
}

let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FALLO: ${message}`);
}

function ok(message) {
  console.log(`OK: ${message}`);
}

async function withErrorTracking(page, label, run) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await run();
  if (errors.length) {
    fail(`${label}: errores de JavaScript en la pagina -> ${errors.join(" | ")}`);
  } else {
    ok(`${label}: sin errores de JavaScript`);
  }
}

async function testIndex(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await withErrorTracking(page, "index.html", async () => {
    await page.goto(`http://localhost:${port}/index.html`, { waitUntil: "networkidle" });
  });

  const navHiddenInitially = await page.evaluate(() => !document.querySelector("#main-nav").classList.contains("open"));
  if (!navHiddenInitially) fail("index.html: el menu deberia empezar cerrado en celular");
  else ok("index.html: el menu empieza cerrado en celular");

  await page.click("#menu-toggle");
  const navOpenAfterClick = await page.evaluate(() => document.querySelector("#main-nav").classList.contains("open"));
  if (!navOpenAfterClick) fail("index.html: el menu no se abre al tocar el boton hamburguesa");
  else ok("index.html: el menu se abre al tocar el boton hamburguesa");

  await page.click("text=Contacto");
  const navClosedAfterLink = await page.evaluate(() => !document.querySelector("#main-nav").classList.contains("open"));
  if (!navClosedAfterLink) fail("index.html: el menu no se cierra al elegir una seccion");
  else ok("index.html: el menu se cierra al elegir una seccion");

  await page.close();
}

async function testRentas(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await withErrorTracking(page, "rentas.html", async () => {
    await page.goto(`http://localhost:${port}/rentas.html`, { waitUntil: "networkidle" });
  });

  const productCount = await page.locator(".product-card").count();
  if (productCount < 1) fail("rentas.html: no se mostro ningun producto en la categoria inicial");
  else ok(`rentas.html: se muestran ${productCount} productos`);

  await page.locator(".product-card .button.primary.full").first().click();
  const quoteItemCount = await page.locator(".quote-item").count();
  if (quoteItemCount < 1) fail("rentas.html: agregar un producto no lo sumo a la lista de cotizacion");
  else ok("rentas.html: agregar un producto si lo suma a la lista de cotizacion");

  const sendEnabled = await page.locator("#send-quote").isEnabled();
  if (!sendEnabled) fail("rentas.html: el boton de enviar por WhatsApp deberia activarse al tener articulos");
  else ok("rentas.html: el boton de enviar por WhatsApp se activa correctamente");

  await page.close();
}

async function main() {
  await listen();
  const browser = await chromium.launch(
    process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {}
  );
  try {
    await testIndex(browser);
    await testRentas(browser);
  } finally {
    await browser.close();
    server.close();
  }

  if (failures > 0) {
    console.error(`\n${failures} prueba(s) fallaron.`);
    process.exit(1);
  }
  console.log("\nTodas las pruebas pasaron correctamente.");
}

main();
