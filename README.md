```
# 🤖 AI Sales Assistant - Backend (NestJS)

Este proyecto es una API REST robusta desarrollada con **NestJS** que simula un Asistente de Ventas Inteligente.

El sistema permite a los usuarios registrarse, iniciar sesión y mantener conversaciones con una Inteligencia Artificial (OpenAI) diseñada para tener una personalidad de ventas. Todo el historial de chat se persiste en una base de datos **PostgreSQL** utilizando **TypeORM** con una arquitectura escalable.

---

## 📋 Características Principales

* **Arquitectura Modular:** Basada en módulos de NestJS (`Auth`, `Chat`, `Users`).
* **Base de Datos Relacional:** PostgreSQL gestionado mediante TypeORM.
* **Migraciones:** Control de versiones de la base de datos (sin `synchronize: true`).
* **Autenticación:** JWT (JSON Web Tokens) y Hashing de contraseñas con Bcrypt.
* **Integración IA:** Conexión con OpenAI (GPT-3.5) con manejo de contexto conversacional.
* **Seguridad:** Guards para protección de rutas y CORS habilitado.

---

## 🛠 Prerrequisitos

Asegúrate de tener instalado en tu entorno:

1.  **Node.js** (v18 o superior).
2.  **npm** (Gestor de paquetes).
3.  **PostgreSQL** (Puede ser local o una instancia en la nube como Supabase).

---

## 🚀 Instalación y Configuración

Sigue estos pasos para levantar el proyecto localmente:

### 1. Clonar e Instalar Dependencias

```bash
# Instalar las librerías del proyecto
npm install

```

### 2\. Configurar Variables de Entorno

Crea un archivo llamado `.env` en la raíz del proyecto (al mismo nivel que `package.json`). Copia y pega la siguiente configuración, reemplazando con tus credenciales reales:

Fragmento de código

```
# --- Base de Datos (PostgreSQL / Supabase) ---
# Ejemplo: postgresql://postgres:password@db.supabase.co:5432/postgres
DATABASE_URL="tu_connection_string_aqui"

# --- Autenticación (JWT) ---
# Una frase secreta para firmar los tokens
JWT_SECRET="tu_secreto_super_seguro_y_largo"

# --- Inteligencia Artificial ---
# Tu API Key de OpenAI (requiere créditos disponibles)
OPENAI_API_KEY="sk-proj-tu-clave-de-openai"

```

### 3\. Ejecutar Migraciones (Base de Datos)

Este proyecto **no** sincroniza automáticamente las tablas al iniciar para evitar pérdida de datos en producción. Debes ejecutar las migraciones para crear las tablas (`users`, `conversations`, `messages`) y los índices.

Ejecuta el siguiente comando:

Bash

```
npm run migration:run

```

> **Verificación:** Si el comando es exitoso, verás en la consola mensajes indicando que las tablas y la extensión `uuid-ossp` han sido creadas.

* * * * *

▶️ Ejecución del Servidor
-------------------------

### Modo Desarrollo (Recomendado)

Inicia el servidor con recarga automática ("Hot Reload") al hacer cambios.

Bash

```
npm run start:dev

```

### Modo Producción

Compila el código y lo ejecuta de forma optimizada.

Bash

```
npm run build
npm run start:prod

```

El servidor se iniciará por defecto en: `http://localhost:3000`

* * * * *

📡 Documentación de la API (Endpoints)
--------------------------------------

Puedes importar la colección de Postman o probar manualmente los siguientes endpoints.

### 🔐 1. Módulo de Autenticación (`/auth`)

#### Registrar Usuario

-   **Método:** `POST`

-   **URL:** `/auth/register`

-   **Body (JSON):**

JSON

```
{
  "email": "usuario@test.com",
  "password": "password123"
}

```

#### Iniciar Sesión

-   **Método:** `POST`

-   **URL:** `/auth/login`

-   **Body (JSON):**

JSON

```
{
  "email": "usuario@test.com",
  "password": "password123"
}

```

-   **Respuesta:** Devuelve un `access_token` que debes usar en los siguientes endpoints.

### 💬 2. Módulo de Chat (`/chat`)

> ⚠️ **Importante:** Todos los endpoints de chat requieren el Header de autorización: `Authorization: Bearer <TU_TOKEN_JWT>`

#### Enviar Mensaje

Inicia una conversación o continúa una existente.

-   **Método:** `POST`

-   **URL:** `/chat/send`

-   **Body (JSON):**

JSON

```
{
  "message": "Hola, ¿qué servicios ofrecen?",
  "conversationId": "uuid-opcional-para-continuar-hilo"
}

```

#### Ver Historial

Obtiene todas las conversaciones del usuario logueado.

-   **Método:** `GET`

-   **URL:** `/chat/history`

* * * * *

📂 Estructura del Proyecto
--------------------------

Bash

```
src/
├── auth/           # Lógica de Login, Registro y Estrategias JWT
├── chat/           # Lógica del Chat, Servicio de OpenAI y Entidades (Conversation/Message)
├── users/          # Gestión de usuarios y Entidad User
├── migrations/     # Archivos de migración de base de datos
├── app.module.ts   # Módulo principal
└── main.ts         # Punto de entrada (Configuración de CORS y Puerto)

```

* * * * *

🐛 Solución de Problemas Comunes
--------------------------------

**Error: "relation 'users' does not exist"**

-   **Causa:** No has corrido las migraciones.

-   **Solución:** Ejecuta `npm run migration:run`.

**Error: "Unauthorized" al enviar mensaje**

-   **Causa:** Token inválido, expirado o no enviado.

-   **Solución:** Haz login de nuevo, copia el token y asegúrate de enviarlo como `Bearer Token` en los headers.

**Error: "You exceeded your current quota" (OpenAI)**

-   **Causa:** La API Key de OpenAI no tiene saldo.

-   **Solución:** Revisa tu facturación en platform.openai.com o cambia la API Key en el `.env`.
