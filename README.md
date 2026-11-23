# MOCHERITO — Carta digital

Carta digital editorial y responsive para **MOCHERITO — TABERNA CRIOLLA**.

## Ejecutar localmente

No requiere instalación ni compilación:

```bash
python -m http.server 8080
```

Luego abre `http://localhost:8080`.

También puedes publicar directamente el contenido de esta carpeta en Cloudflare Pages o GitHub Pages.

## Actualizar el contenido

Los datos gastronómicos están separados del diseño en `menu-data.js`. Para modificar un plato, precio, descripción o bebida, cambia únicamente el objeto correspondiente dentro de `window.MOCHERITO_MENU`.

## Publicar en Cloudflare Pages

1. Crea un repositorio en GitHub y sube todos los archivos.
2. En Cloudflare Dashboard, abre **Workers & Pages**.
3. Selecciona **Create application > Pages > Connect to Git**.
4. Elige el repositorio.
5. Usa:
   - Build command: vacío
   - Build output directory: `/`
6. Despliega.

## Publicar en GitHub Pages

1. Crea un repositorio público en GitHub.
2. Sube todos los archivos a la rama principal.
3. Abre **Settings > Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige la rama principal y la carpeta `/ (root)`.
6. Guarda. GitHub generará la URL HTTPS pública.

## Dominio personalizado y QR

Para usar `carta.mocherito.com`, configura un dominio personalizado en Cloudflare Pages o GitHub Pages y agrega los registros DNS indicados por el proveedor.

Mantén esta ruta permanente como portada:

```text
https://carta.mocherito.com/
```

Genera el código QR con una URL HTTPS definitiva. Para conservar el QR cuando se actualice la carta, no cambies el dominio ni la URL de la portada.

## Texto señalado para revisión

- `Cabrito en Brasas` conserva la descripción proporcionada en el documento, aunque allí aparece repetida la descripción de `Pasta a lo Alfredo y Nuggets`.
