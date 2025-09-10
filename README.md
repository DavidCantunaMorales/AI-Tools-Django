# AI Tools - Django (Frontend + Backend)

## Resumen

Proyecto demo que combina:

- Frontend: Next.js (carpeta `assistant`) — UI y rutas API cliente.
- Backend: Django REST API (carpeta `backend/assistant_back`) — lógica, modelos y endpoints server-side.

Objetivo: mostrar una aplicación full‑stack con interfaces de chat/completion/stream y herramientas auxiliares para experimentos con IA.

## Mini‑asistente (tool calling)

Construcción de un mini‑asistente capaz de invocar herramientas (tool calling) mediante Vercel AI SDK y resolver acciones reales contra una API Django. El asistente orquesta varios pasos de herramienta y produce una respuesta final coherente para el usuario, incluyendo streaming de la respuesta cuando aplica.

Herramientas principales usadas:

- Next.js (frontend y rutas de API en el cliente)
- Django (backend REST API)
- Vercel AI SDK (orquestación de llamadas a herramientas y streaming)

## Historia de usuario

Como agente de soporte de una pyme, quiero consultar y actualizar información de clientes (consultar saldo, crear ticket, registrar pago) con lenguaje natural, para resolver casos sin ir a múltiples sistemas.

## Estado

- Desarrollo — uso local. Base de datos SQLite incluida (`backend/db.sqlite3`).
- Hecho: estructura básica de frontend, backend y ejemplos de rutas API. Ajustes de despliegue pueden ser necesarios para producción.

## Requisitos

- Node.js (v16+ recomendado) y npm o pnpm.
- Python 3.10+ (o 3.11+) y pip.
- Windows PowerShell (instrucciones provistas para PowerShell).

## Estructura relevante

- `assistant/` — Next.js frontend.
- `backend/assistant_back/` — Django project.
- `backend/db.sqlite3` — base de datos SQLite (dev).
- `backend/manage.py` — comandos Django.

## Variables de entorno (ejemplo)

Crear archivos de entorno separados para frontend y backend:

- Frontend (`assistant/.env.local`):

  - NEXT_PUBLIC_API_URL=http://localhost:8000/api
  - Otros keys según `template.env.txt` en `assistant/`.

- Backend (`backend/.env` o configurar en `backend/assistant_back/settings.py`):
  - DJANGO_SECRET_KEY=<tu_clave_secreta>
  - DJANGO_DEBUG=True
  - ALLOWED_HOSTS=localhost,127.0.0.1
  - Si usas PostgreSQL en prod, añade DATABASE_URL o configura `DATABASES`.

## Instalación y ejecución (PowerShell)

1. Frontend (Next.js)

- Ir a la carpeta del frontend e instalar dependencias:

```powershell
cd .\assistant
npm install
# o si usas pnpm:
# pnpm install
```

- Ejecutar en modo desarrollo:

```powershell
npm run dev
# Por defecto Next.js estará en http://localhost:3000
```

- Build y start (producción):

```powershell
npm run build
npm run start
```

2. Backend (Django)

- Crear y activar entorno virtual:

```powershell
cd ..\backend\assistant_back
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

- Instalar dependencias:

```powershell
# Si tienes requirements.txt:
pip install -r ..\requirements.txt
# Si no, instalar lo mínimo:
pip install django djangorestframework python-dotenv
```

- Migraciones y superusuario:

```powershell
python ..\manage.py migrate
python ..\manage.py createsuperuser
```

- Ejecutar servidor de desarrollo:

```powershell
python ..\manage.py runserver
# Por defecto en http://127.0.0.1:8000
```

- Ejecutar tests:

```powershell
python ..\manage.py test
```

## Endpoints y contrato mínimo

El repo contiene rutas API en dos lugares:

- Frontend API (Next.js app routes): `assistant/app/api/*` — usadas por la UI del cliente.

  - Ejemplos: `/api/chat/`, `/api/completion/`, `/api/stream/`, `/api/tools/` (consultar `assistant/app/api/*` para detalles).

- Backend Django API (posible prefijo `/api/`):
  - Revisa `backend/assistant_back/urls.py` y `backend/core/urls.py` para la lista completa.
  - Contrato típico (ejemplo de uso genérico):
    - POST /api/chat/
      - Request JSON: { "message": "Hola" }
      - Response JSON: { "reply": "Respuesta generada", "meta": { ... } }

Ejemplo simple usando PowerShell Invoke-RestMethod

```powershell
$body = @{ message = "Hola" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/chat/" -Body $body -ContentType "application/json"
```

## Cómo conectar frontend con backend

- Configura `NEXT_PUBLIC_API_URL` en `assistant/.env.local` apuntando a la URL del backend (por ejemplo `http://localhost:8000/api`).
- Reinicia el servidor de Next.js si cambias env vars.

### Contracto (mini‑spec)

- Inputs: JSON con campos mínimos (ej. `message` para endpoints de chat).
- Outputs: JSON con `reply` o `result`. Errores devuelven status codes HTTP adecuados (400/500) con mensaje.
- Errores y edge cases: payloads vacíos, tiempos de espera de IA externa, validación de formato.

## Despliegue (breves notas)

- Frontend:
  - Build con `npm run build`. Deploy en Vercel u otro proveedor estático con soporte Node/Next.
- Backend:
  - Ajustar `DEBUG=False`, configurar `ALLOWED_HOSTS`, usar PostgreSQL en producción.
  - Usar Gunicorn + Nginx o una plataforma PaaS (Heroku, Render, Railway).
  - Ejecutar `collectstatic` si sirve archivos estáticos.

## Contribuir

- Fork y PR.
- Seguir estilo del código (Next.js + Django).
- Añadir tests en `backend/core/tests.py` y pruebas para componentes React/Next.
- Abrir issues con repro steps.

## Autor

David Cantuña

## Licencia

Este proyecto se publica bajo la licencia MIT.

```
MIT License

Copyright (c) 2025 David Cantuña

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Archivos útiles a revisar

- `assistant/package.json` — scripts del frontend.
- `assistant/template.env.txt` — variables de entorno del frontend.
- `backend/assistant_back/settings.py` — configuración Django.
- `backend/manage.py` — comandos útiles.
