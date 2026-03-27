# 🗳️ Sistema de Votación - API REST

## 📌 Descripción

API desarrollada en Node.js con Express y MongoDB para gestionar un sistema de votación. Permite registrar votantes, candidatos, emitir votos y obtener estadísticas.

---

## 🚀 Tecnologías

* Node.js
* Express
* MongoDB (Mongoose)

---

## 📦 Instalación

```bash
npm install
npm run dev
```

Servidor corriendo en:

```
http://localhost:3000
```

---

## 📌 Endpoints

### 👤 Votantes

* **POST /voters** → Crear votante
* **GET /voters** → Listar votantes
* **GET /voters/:id** → Obtener votante
* **DELETE /voters/:id** → Eliminar votante

---

### 🧑‍⚖️ Candidatos

* **POST /candidates** → Crear candidato
* **GET /candidates** → Listar candidatos
* **GET /candidates/:id** → Obtener candidato
* **DELETE /candidates/:id** → Eliminar candidato

---

### 🗳️ Votos

* **POST /votes** → Emitir voto
* **GET /votes** → Ver todos los votos

---

### 📊 Estadísticas

* **GET /votes/statistics**

Retorna:

* Total de votos
* Total de votantes que votaron
* Votos por candidato
* Porcentaje por candidato

---

## ✅ Validaciones implementadas

* Un votante no puede votar más de una vez
* Validación de IDs
* Validación de campos obligatorios
* Email único en votantes
* Un votante no puede ser candidato y viceversa

---

## 🧪 Pruebas

Se utilizó Postman para probar todos los endpoints.

---

## 👨‍💻 Autor

Desarrollado por Jorge Elias Builes Chavarria
