# watch-resolution

Página única para consultar la **resolución de pantalla de los dispositivos de los clientes**. Muestra el ancho y el alto del viewport en tiempo real, en tema oscuro con verde como color primario.

## Qué muestra

- **Ancho y alto** del viewport, actualizados en vivo al redimensionar o rotar la ventana.
- **Vista previa** del dispositivo con la proporción real (2:3, 16:9, …).
- **Detalles**: resolución de pantalla, relación de aspecto, orientación y densidad de píxeles (DPR).
- **Selector de idioma** español / inglés, con la preferencia guardada en `localStorage`.

## Puesta en marcha

```bash
pnpm install
pnpm dev      # servidor de desarrollo
pnpm build    # compila TypeScript y genera dist/
pnpm preview  # sirve la build de producción
pnpm lint     # ESLint
```

## Estructura

```
src/
  App.tsx     # vista principal y lógica de resolución
  App.css     # estilos de la página (tema oscuro + acento verde)
  index.css   # variables globales, reset y tipografía
  i18n.ts     # diccionario ES/EN y persistencia del idioma
  main.tsx    # punto de entrada
```

## Notas de implementación

Dos detalles que conviene conocer antes de tocar el código:

**`screen.*` no es fiable con monitores rotados.** En vertical, `window.screen.width/height` devuelve los valores en la orientación original del panel, así que puede reportar un área *más pequeña* que el viewport real. Por eso `App.tsx` normaliza la orientación y toma el valor efectivo por eje (`Math.max` entre lo reportado y el viewport).

**Nada de división en `calc()`.** El tamaño de la vista previa se calcula en JavaScript y se aplica con dimensiones explícitas en píxeles. La división dentro de `calc()` no está soportada en todos los navegadores y, al descartarse la declaración, el marco colapsaba a una línea de 2px.

El idioma por defecto es español. Para detectar el idioma del navegador en su lugar, cambia el `return 'es'` de `detectLanguage()` en `src/i18n.ts`.
