# Instrucciones para Desplegar en Hostinger

## 📋 Pasos para el Despliegue

### 1. Preparar el Proyecto
```bash
# Limpiar y reconstruir
npm run build
```

### 2. Archivos a Subir a Hostinger
Después de ejecutar `npm run build`, sube estos archivos a tu hosting:

```
📁 public_html/ (o tu directorio web)
├── 📄 index.html
├── 📁 assets/
│   ├── 📄 index-[hash].js
│   ├── 📄 index-[hash].css
│   └── 📄 [otros archivos con hash]
├── 🖼️ icono.png
├── 🖼️ banner.jpg
└── 📄 .htaccess
```

### 3. Configuración de Hostinger

#### Opción A: Subir archivos manualmente
1. Ve al **File Manager** de Hostinger
2. Navega a `public_html/`
3. Sube todos los archivos de la carpeta `dist/`
4. Asegúrate de que `.htaccess` esté en la raíz

#### Opción B: Usar FTP
1. Conecta por FTP a tu hosting
2. Sube todo el contenido de `dist/` a `public_html/`

### 4. Verificar la Configuración

#### Verificar que las imágenes se cargan:
- `https://tudominio.com/icono.png`
- `https://tudominio.com/banner.jpg`

#### Verificar que la app funciona:
- `https://tudominio.com/`

### 5. Solución de Problemas Comunes

#### ❌ Las imágenes no se ven
**Causa**: Rutas incorrectas o archivos no subidos
**Solución**: 
1. Verifica que `icono.png` y `banner.jpg` estén en la raíz
2. Revisa que `.htaccess` esté presente
3. Verifica los permisos de archivos (644 para archivos, 755 para carpetas)

#### ❌ La app no carga
**Causa**: Problema con React Router
**Solución**: 
1. Verifica que `.htaccess` esté presente
2. Revisa que las reglas de reescritura estén activas

#### ❌ Errores 404
**Causa**: Archivos no encontrados
**Solución**: 
1. Verifica que todos los archivos de `assets/` estén subidos
2. Revisa que las rutas en el código usen rutas relativas

### 6. Comandos Útiles

```bash
# Limpiar y reconstruir
rm -rf dist/
npm run build

# Verificar estructura
ls -la dist/

# Verificar que .htaccess se copió
ls -la dist/.htaccess
```

### 7. Estructura Final en Hostinger

```
public_html/
├── index.html
├── .htaccess
├── icono.png
├── banner.jpg
└── assets/
    ├── index-[hash].js
    ├── index-[hash].css
    └── [otros archivos]
```

## ✅ Checklist de Despliegue

- [ ] Ejecutar `npm run build`
- [ ] Verificar que `dist/` contiene todos los archivos
- [ ] Verificar que `.htaccess` está en `dist/`
- [ ] Subir todos los archivos a `public_html/`
- [ ] Verificar que las imágenes se cargan
- [ ] Verificar que la app funciona correctamente
- [ ] Probar todas las rutas de la aplicación

## 🔧 Configuración Adicional

Si tienes problemas con las rutas, puedes modificar `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/', // Para dominio raíz
  // o
  base: '/subdirectorio/', // Para subdirectorio
});
```

Y luego ejecutar `npm run build` nuevamente.
