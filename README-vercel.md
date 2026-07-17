# Deploy a Vercel

## Variables de entorno en Vercel
Agrega estas variables en Vercel > Project Settings > Environment Variables:

- NEXT_PUBLIC_API_URL: URL base del backend, por ejemplo https://api.tudominio.com/v1
- NEXT_PUBLIC_SITE_URL: URL pública del frontend, por ejemplo https://tu-dominio.com

## Build settings
- Framework Preset: Next.js
- Build Command: pnpm build
- Output Directory: .next

## Recomendaciones
- Usar Node.js 20.x o 22.x
- Asegurarse de que el backend permita CORS para el dominio de Vercel
- Si el API está en localhost, no funcionará en producción; debe apuntar a un host público

## Comandos locales
```bash
pnpm install
pnpm build
```
