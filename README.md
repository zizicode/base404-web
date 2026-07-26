# Base404-Web - Documentación de Arquitectura Frontend

## 📋 Descripción General

**Base404-Web** es una aplicación Next.js 15 que funciona como una guía interactiva de códigos de error de impresoras. La plataforma permite a los usuarios buscar, explorar y solucionar errores de impresoras de múltiples marcas (HP, Epson, Brother, Canon, Fujitsu, etc.) con contenido bilingüe (español e inglés).

**Tecnologías principales:**
- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript 5.8
- **Estilos:** SCSS + Tailwind CSS 4.1
- **Estado:** Zustand 5.0
- **HTTP Client:** Axios
- **Iconos:** Lucide React
- **i18n:** Sistema personalizado con diccionarios JSON

---

## 🏗️ Estructura del Proyecto

```
base404-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raíz con SEO y analytics
│   ├── page.tsx                 # Redirección a /es
│   ├── not-found.tsx            # Página 404 global
│   ├── [lang]/                  # Rutas con parámetro de idioma
│   │   ├── layout.tsx           # Layout por idioma
│   │   ├── page.tsx             # Homepage
│   │   ├── error/[slug]/        # Páginas de detalle de error
│   │   ├── marcas/[brand]/      # Páginas por marca
│   │   ├── categorias/[category]/ # Páginas por categoría
│   │   ├── buscar/              # Página de búsqueda
│   │   ├── privacidad/          # Página de privacidad
│   │   ├── terminos/            # Página de términos
│   │   └── robots.txt/          # Robots.txt dinámico
│   └── api/                     # API Routes (proxies)
│       ├── errors/[slug]/view/  # POST - Registrar vista
│       ├── errors/[slug]/vote/  # POST - Registrar voto
│       └── search/              # GET - Búsqueda
├── components/                  # Componentes React
│   ├── home/                    # Componentes del homepage
│   ├── browse/                  # Componentes de navegación
│   ├── site-navbar/             # Navegación principal
│   ├── site-footer/             # Footer
│   ├── error-engagement/        # Sistema de votos
│   ├── error-faqs/              # Preguntas frecuentes
│   ├── error-video-selector/    # Selector de videos
│   └── page-transition/         # Transiciones de página
├── lib/                         # Utilidades y lógica de negocio
│   ├── i18n.ts                  # Configuración de idiomas
│   ├── api/                     # Clientes de API
│   │   ├── client.ts            # Instancia de Axios
│   │   ├── types.ts             # Tipos TypeScript
│   │   ├── errors.ts            # Funciones de errores
│   │   ├── brands.ts            # Funciones de marcas
│   │   ├── categories.ts        # Funciones de categorías
│   │   ├── stats.ts             # Estadísticas del sitio
│   │   └── videos.ts            # Gestión de videos
│   └── markdownToHtml.ts        # Conversor Markdown → HTML
├── dictionaries/                # Traducciones i18n
│   ├── dictionaries.ts          # Cargador de diccionarios
│   ├── es.json                  # Traducciones español
│   └── en.json                  # Traducciones inglés
├── store/                       # Estado global
│   └── useLocaleStore.ts        # Store de idioma (Zustand)
├── styles/                      # Estilos globales
│   ├── global.scss              # Estilos base
│   ├── variables.scss           # Variables SCSS
│   └── _mixins.scss             # Mixins SCSS
├── content/                     # Contenido estático
│   └── legal/                   # Páginas legales (Markdown)
├── public/                      # Assets estáticos
│   ├── og.png                   # Imagen Open Graph
│   ├── favicon.ico              # Favicon
│   └── marcas/                  # Logos de marcas
├── base404-cron/                # Servicio de health check
├── package.json                 # Dependencias
├── next.config.ts               # Configuración de Next.js
├── tsconfig.json                # Configuración de TypeScript
├── middleware.ts                # Middleware de i18n
└── vercel.json                  # Configuración de Vercel
```

---

## 🌐 Sistema de Internacionalización (i18n)

### Idiomas Soportados
- **Español (es)** - Idioma por defecto
- **Inglés (en)**

### Arquitectura i18n

#### 1. **Middleware** (`middleware.ts`)
- Detecta el idioma preferido del usuario mediante:
  - Cookie `NEXT_LOCALE`
  - Header `Accept-Language` (usando `negotiator`)
  - Redirección automática a `/{locale}` si no hay locale en la URL
- Establece el header `x-locale` para uso en Server Components

#### 2. **Layout por Idioma** (`app/[lang]/layout.tsx`)
- Carga el diccionario correspondiente
- Inicializa el componente `LocaleInitializer` para sincronizar el estado cliente-servidor
- Renderiza navbar y footer con traducciones

#### 3. **Diccionarios** (`dictionaries/`)
- Archivos JSON por idioma (`es.json`, `en.json`)
- Carga dinámica con `import()` para code-splitting
- Estructura jerárquica por secciones (nav, footer, hero, brands, etc.)

#### 4. **Store de Estado** (`store/useLocaleStore.ts`)
- Estado global del idioma con Zustand
- Persistencia en `localStorage` y cookie
- Sincronización entre cliente y servidor

#### 5. **Utilidades** (`lib/i18n.ts`)
```typescript
- LOCALES: ['es', 'en']
- DEFAULT_LOCALE: 'es'
- isValidLocale(): Valida si un valor es un locale permitido
- getAppLocale(): Resuelve el locale con prioridad:
  1. URL param
  2. Zustand state
  3. localStorage
  4. navigator.language
  5. Default 'es'
```

---

## 🛣️ Sistema de Rutas

### Rutas Públicas

| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/` | Redirección a `/es` | `app/page.tsx` |
| `/{lang}` | Homepage | `app/[lang]/page.tsx` |
| `/{lang}/error/{slug}` | Detalle de error | `app/[lang]/error/[slug]/page.tsx` |
| `/{lang}/marcas` | Listado de marcas | `app/[lang]/marcas/page.tsx` |
| `/{lang}/marcas/{brand}` | Errores por marca | `app/[lang]/marcas/[brand]/page.tsx` |
| `/{lang}/categorias` | Listado de categorías | `app/[lang]/categorias/page.tsx` |
| `/{lang}/categorias/{category}` | Errores por categoría | `app/[lang]/categorias/[category]/page.tsx` |
| `/{lang}/buscar` | Búsqueda | `app/[lang]/buscar/page.tsx` |
| `/{lang}/privacidad` | Política de privacidad | `app/[lang]/privacidad/page.tsx` |
| `/{lang}/terminos` | Términos y condiciones | `app/[lang]/terminos/page.tsx` |

### Rutas API (Proxies)

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/errors/{slug}/view` | POST | Registra una vista de error |
| `/api/errors/{slug}/vote` | POST | Registra un voto de utilidad |
| `/api/search` | GET | Búsqueda de errores, marcas y categorías |

**Nota:** Todas las rutas API son proxies que reenvían las solicitudes a la API backend (`https://api.vimazdev.com/v1` por defecto).

---

## 🧩 Componentes Principales

### Componentes de Layout
- **`SiteNavbar`** - Navegación principal con selector de idioma y búsqueda
- **`SiteFooter`** - Footer con enlaces legales y copyright
- **`PageTransitionProvider`** - Proveedor de contexto para transiciones
- **`PageTransition`** - Animaciones de transición entre páginas
- **`LocaleInitializer`** - Sincroniza el idioma entre cliente y servidor

### Componentes del Homepage
- **`Hero`** - Sección principal con búsqueda y CTAs
- **`BrandsGrid`** - Grid de marcas populares
- **`CategoriesGrid`** - Grid de categorías de dispositivos
- **`PopularGuides`** - Lista de guías populares
- **`TrustStats`** - Estadísticas de confianza (errores, marcas, categorías)
- **`FinalCta`** - Call-to-action final

### Componentes de Navegación
- **`BrowseHeader`** - Encabezado de páginas de navegación
- **`BrowseShell`** - Contenedor con filtros y resultados
- **`ErrorCard`** - Tarjeta de error en listados

### Componentes de Error
- **`ErrorEngagement`** - Sistema de votos (útil/no útil) y contador de vistas
- **`ErrorFaqs`** - Sección de preguntas frecuentes
- **`ErrorVideoSelector`** - Selector de videos tutoriales

### Componentes de Utilidad
- **`SearchOverlay`** - Overlay de búsqueda con autocompletado
- **`SiteLogo`** - Logo del sitio
- **`LegalPage`** - Componente para páginas legales

---

## 🔌 API Backend

### Configuración
- **URL Base:** `NEXT_PUBLIC_API_URL` (por defecto: `https://api.vimazdev.com/v1`)
- **Cliente HTTP:** Axios con timeout de 8 segundos
- **Autenticación:** No requiere autenticación (API pública)

### Tipos de Datos Principales

#### `Brand` (Marca)
```typescript
{
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
}
```

#### `Category` (Categoría)
```typescript
{
  id: number;
  name: string;
  slug: string;
  deviceType: string;
  icon: string;
}
```

#### `ErrorListItem` (Error en listado)
```typescript
{
  id: number;
  slug: string;
  title: string;
  errorCode: string;
  model: string | null;
  brandName: string;
  categoryName: string;
  views: number;
  updatedAt: string;
}
```

#### `ErrorPageResponse` (Página de detalle)
```typescript
{
  id: number;
  slug: string;
  locale: "es" | "en";
  errorCode: string;
  model: string | null;
  brand: { name: string; slug: string; logoUrl: string | null };
  category: { name: string; slug: string };
  seo: {
    title: string;
    metaDescription: string;
    canonicalUrl: string;
    og: { title: string; description: string; image: string };
    schemaJsonLd: Record<string, unknown>;
    robots: string;
  };
  hreflangAlternates: { locale: "es" | "en"; url: string }[];
  content: {
    summary: string;
    markdownSolutions: string;
    causes: string[];
    stepsHowTo: HowToStep[];
    faqs: Faq[];
    videos: VideoEmbed[];
  };
  hasVideo: boolean;
  engagement: { views: number; helpfulVotes: number; unhelpfulVotes: number };
  relatedErrors: RelatedError[];
  isIndexable: boolean;
  status: "draft" | "published" | "archived" | "flagged";
  updatedAt: string;
}
```

### Funciones de API Disponibles

#### Errores (`lib/api/errors.ts`)
- `searchErrors(params)` - Búsqueda de errores con filtros
- `getErrorBySlug(slug, locale)` - Obtiene detalle de un error

#### Marcas (`lib/api/brands.ts`)
- `getBrands()` - Lista todas las marcas
- `getBrandBySlug(slug)` - Obtiene una marca por slug
- `getBrandErrors(slug, locale, limit)` - Errores de una marca

#### Categorías (`lib/api/categories.ts`)
- `getCategories(locale)` - Lista todas las categorías
- `getCategoryBySlug(slug, locale)` - Obtiene una categoría
- `getCategoryErrors(slug, locale, limit)` - Errores de una categoría
- `getCategoryBrandErrors(params)` - Errores por categoría y marca

#### Estadísticas (`lib/api/stats.ts`)
- `getStats()` - Estadísticas globales del sitio

#### Videos (`lib/api/videos.ts`)
- `getPreferredVideos(videos, locale)` - Filtra videos por idioma

---

## 🎨 Estilos y Diseño

### Arquitectura de Estilos
- **SCSS Modules** para estilos por componente
- **Tailwind CSS 4.1** para utilidades
- **Variables SCSS** en `styles/variables.scss`
- **Mixins SCSS** en `styles/_mixins.scss`

### Convenciones de Nomenclatura
- Archivos de estilos: `{ComponentName}.module.scss`
- Variables: `$nombre-variable: valor;`
- Mixins: `@mixin nombre-mixin { }`

---

## 🔍 SEO y Metadatos

### Estrategia SEO
- **Metadatos dinámicos** por página usando `generateMetadata()`
- **Open Graph** configurado para redes sociales
- **Twitter Cards** con imagen preview
- **JSON-LD** para structured data en páginas de error
- **Hreflang** para versiones en español e inglés
- **Sitemaps** dinámicos generados en `/app/sitemap-*.xml/`
- **Robots.txt** dinámico

### Metadatos Globales
- Título por defecto: "Vimazdev — Soluciona Códigos de Error de Impresoras"
- Descripción optimizada para SEO
- Keywords en español e inglés
- Verificación de Bing (`msvalidate.01`)

### Analytics
- **Google Analytics 4** (G-RFE65C9EFH)
- **Google Tag Manager** (GTM-T5FPRGC5)

---

## 🗄️ Estado Global

### Store de Idioma (`store/useLocaleStore.ts`)
```typescript
{
  locale: Locale;        // Idioma actual
  setLocale: (locale) => void;  // Cambiar idioma
}
```

**Características:**
- Persistencia en `localStorage`
- Cookie `NEXT_LOCALE` con 1 año de expiración
- Sincronización automática entre cliente y servidor

---

## 🔄 Flujo de Datos

### Página de Error (Flujo Completo)

1. **Usuario accede a** `/{lang}/error/{slug}`
2. **Middleware** valida el locale en la URL
3. **Layout** carga el diccionario y componentes globales
4. **Página** ejecuta en servidor:
   - `getErrorBySlug(slug, locale)` - Obtiene datos del error
   - `getDictionary(locale)` - Carga traducciones
   - `getPreferredVideos()` - Filtra videos por idioma
5. **Renderizado**:
   - JSON-LD para SEO
   - Breadcrumb de navegación
   - Hero con código, modelo y badge de video
   - Secciones: Causas, Soluciones, Pasos, Videos, FAQs
   - Sidebar con metadatos y errores relacionados
6. **Interacciones cliente**:
   - Voto de utilidad → `POST /api/errors/{slug}/vote`
   - Registro de vista → `POST /api/errors/{slug}/view`

### Página de Home (Flujo Completo)

1. **Usuario accede a** `/{lang}`
2. **Carga paralela** de datos:
   - `getDictionary(locale)` - Traducciones
   - `getBrands()` - Lista de marcas
   - `getCategories(locale)` - Categorías
   - `getErrors({ sort: 'popular', limit: 6 })` - Guías populares
   - `getStats()` - Estadísticas
3. **Renderizado** de secciones:
   - Hero con búsqueda
   - Estadísticas de confianza
   - Grid de marcas
   - Grid de categorías
   - Guías populares
   - CTA final

---

## 🚀 Despliegue

### Variables de Entorno Requeridas

```env
NEXT_PUBLIC_API_URL=https://api.vimazdev.com/v1
NEXT_PUBLIC_SITE_URL=https://vimazdev.com
```

### Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linter
```

### Plataforma
- **Vercel** (configuración en `vercel.json`)
- **Health Check:** Servicio Python en `base404-cron/` para monitoreo

---

## 📦 Dependencias Principales

### Producción
- `next@15.3.3` - Framework React
- `react@19.1.0` - Librería UI
- `axios@1.9.0` - Cliente HTTP
- `zustand@5.0.14` - Estado global
- `lucide-react@1.24.0` - Iconos
- `negotiator@1.0.0` - Negociación de idiomas
- `@formatjs/intl-localematcher@0.8.11` - Matching de idiomas

### Desarrollo
- `typescript@5.8.0` - Tipado estático
- `sass@1.101.0` - Preprocesador CSS
- `tailwindcss@4.1.0` - Framework CSS
- `sharp@0.35.3` - Optimización de imágenes

---

## 🎯 Características Principales

### Para Usuarios
- ✅ Búsqueda de errores por código, marca o categoría
- ✅ Guías detalladas con soluciones paso a paso
- ✅ Videos tutoriales contextuales
- ✅ Sistema de votación de utilidad
- ✅ Interfaz bilingüe (español/inglés)
- ✅ Navegación por marcas y categorías
- ✅ Páginas legales (privacidad, términos)

### Para SEO
- ✅ URLs amigables con slugs
- ✅ Metadatos dinámicos por página
- ✅ Structured Data (JSON-LD)
- ✅ Hreflang para multi-idioma
- ✅ Sitemaps dinámicos
- ✅ Open Graph y Twitter Cards
- ✅ Robots.txt dinámico

### Técnicas
- ✅ SSR/SSG con Next.js App Router
- ✅ Server Components por defecto
- ✅ Client Components solo cuando es necesario
- ✅ Code splitting automático
- ✅ Optimización de imágenes con Next.js Image
- ✅ Cache estratégico (revalidate)
- ✅ Manejo de errores robusto
- ✅ TypeScript estricto

---

## 📝 Notas de Desarrollo

### Convenciones de Código
- **Componentes:** PascalCase (`ErrorPage.tsx`)
- **Utilidades:** camelCase (`getErrorBySlug`)
- **Tipos:** PascalCase (`ErrorPageResponse`)
- **Constantes:** UPPER_SNAKE_CASE (`DEFAULT_LOCALE`)

### Patrones Utilizados
- **Server Components** por defecto para mejor rendimiento
- **Client Components** solo para interactividad (`'use client'`)
- **Parallel Data Fetching** con `Promise.all()`
- **Error Boundaries** implícitos con try/catch
- **Proxy Pattern** en API Routes para seguridad

### Optimizaciones
- **ISR (Incremental Static Regeneration):** `revalidate = 3600` en homepage
- **Dynamic Rendering:** Páginas de error y marca con `force-dynamic`
- **Image Optimization:** Next.js Image con `unoptimized` para URLs externas
- **Font Optimization:** Google Fonts con `display: swap`

---

## 🔐 Seguridad

- **No exponer** API keys en el cliente
- **Validación** de parámetros de URL
- **Sanitización** de HTML en contenido Markdown
- **Headers de seguridad** en API Routes (`Cache-Control: no-store`)
- **Cookie flags:** `SameSite=Lax`, `Secure` en producción

---

## 📊 Monitoreo

- **Health Check:** Servicio Python en `base404-cron/pinger.py`
- **Logs:** `base404-cron/pinger.log`
- **Analytics:** Google Analytics 4 + GTM
- **Error Tracking:** Console.error con contexto estructurado

---

## 🚦 Próximos Pasos Sugeridos

1. **Agregar tests** unitarios y de integración
2. **Implementar** caché con Redis para respuestas de API
3. **Agregar** soporte para más idiomas
4. **Implementar** sistema de favoritos/guardados
5. **Agregar** filtros avanzados en búsqueda
6. **Implementar** comparador de errores
7. **Agregar** modo oscuro/claro
8. **Optimizar** Core Web Vitals (LCP, FID, CLS)

---

## 📄 Licencia

Privado - Todos los derechos reservados © Vimazdev

---

**Última actualización:** 26 de Enero, 2026
**Versión:** 0.1.0