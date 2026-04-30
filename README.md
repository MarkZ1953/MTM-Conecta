# MTM-Conecta

Bienvenido al repositorio de **MTM-Conecta**, una plataforma integral y moderna para la Fundación MTM, desarrollada para gestionar donaciones, beneficiarios, voluntarios y proyectos de manera centralizada.

## 🚀 Estado Actual del Proyecto

El sistema ha sido refactorizado para separar el Front-End y Back-End, permitiendo un alto nivel de escalabilidad y mantenibilidad.

### Tecnologías
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Django + Django REST Framework (DRF)
- **Autenticación**: JWT (JSON Web Tokens)
- **Base de Datos**: SQLite (En desarrollo) / PostgreSQL (Producción planeada)

## 🛠 Instalación y Ejecución Local

Para los desarrolladores que se unan al proyecto, sigan estos pasos para ejecutar el entorno localmente:

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd MTM-Conecta
```

### 2. Configurar el Backend (Django)
Abre una terminal y ejecuta los siguientes comandos:

```bash
cd backend
python -m venv .venv
# En Windows:
.venv\Scripts\activate
# En Mac/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py runserver
```
El backend estará disponible en: `http://localhost:8000`

### 3. Configurar el Frontend (React)
Abre **otra** terminal y ejecuta:

```bash
cd frontend
npm install
npm run dev
```
El frontend estará disponible en: `http://localhost:5173` (o el puerto que indique Vite).

## 🔑 Credenciales por Defecto (Entorno de Desarrollo)

Para ingresar al **Panel Administrativo**, usa el siguiente usuario super-administrador de prueba:

- **Email:** `admin@mtm.org`
- **Contraseña:** `Admin2026!`

*Nota: Asegúrate de no subir contraseñas de producción en el código o repositorios públicos.*

## ✨ Últimas Mejoras y Correcciones (Patch Notes)

En la última sesión de desarrollo se implementaron integraciones Full-Stack clave para que el sistema funcione con datos reales:

- **Autenticación Real (JWT):** Se eliminó el *mocking* del login. El inicio de sesión ahora requiere credenciales verificadas en la base de datos de Django y el ciclo de vida de los tokens (Access y Refresh) se maneja de forma segura.
- **Módulos Conectados a Base de Datos:** Las pantallas de `Donaciones`, `Donantes`, `Beneficiarios`, `Proyectos` y `Voluntarios` han dejado de usar datos estáticos. Ahora consumen la API usando el hook centralizado `useData()`.
- **Módulo de Voluntarios Completado:** Se habilitó el registro público desde la *Landing Page* enviando los datos directamente a `/api/v1/public/voluntarios/`. En el panel de control, ahora existe una sección para visualizar voluntarios y la tarjeta de estadísticas cuenta los voluntarios no rechazados en tiempo real.
- **Ajustes de UI/UX:**
  - Se corrigió el problema de legibilidad del logo del panel de administrador que se veía transparente.
  - Se previno que los gráficos estadísticos (como el de donaciones) cortaran la lectura de algunas palabras (ej. "opa" en lugar de "ropa").
  - Se arregló el espaciado visual en el formulario público de voluntarios.
- **Resolución de Bugs Críticos:**
  - Se ajustó el orden de las importaciones `@import` de Tailwind v4 en el CSS que impedían la compilación de Vite.
  - Solucionado el problema con el Logout que no limpiaba correctamente el contexto.
  - Se corrigió el archivo de configuración `api.config.ts` que pisaba la URL base quitando la terminación `/api/v1/`.

## 🤝 Flujo de Trabajo (Git)

Las ramas de este proyecto siguen un flujo estructurado. La rama principal es `main`. Las integraciones se hacen en `integration`, y los desarrollos de funcionalidad en ramas de "features".

> *"Juntos conectamos recursos con quienes más lo necesitan."* - **Fundación MTM**
