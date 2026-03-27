# 🗳️ Sistema de Votación - API REST

## 📌 Descripción

API REST desarrollada con Node.js, Express y MongoDB que permite gestionar votantes, candidatos y votos, incluyendo estadísticas de la votación.

---

## 🚀 Instalación y ejecución

1. Clonar repositorio:

```bash
git clone https://github.com/JorgeBuiles/prueba-tecnica-votacion.git
cd prueba-tecnica-votacion
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar servidor:

```bash
npm run dev
```

Servidor en:

```
http://localhost:3000
```

---

## 🔌 Ejemplos de uso (Postman)

### Crear votante

POST /voters

```json
{
  "name": "Ana Torres",
  "email": "ana@mail.com"
}
```

---

### Crear candidato

POST /candidates

```json
{
  "name": "Carlos Lopez",
  "email": "carlos@mail.com",
  "party": "Partido Azul"
}
```

---

### Emitir voto

POST /votes

```json
{
  "voter_id": "ID_VOTANTE",
  "candidate_id": "ID_CANDIDATO"
}
```

---

### Ver estadísticas

GET /votes/statistics

Ejemplo de respuesta:

```json
{
  "total_votes": 3,
  "total_voters_voted": 3,
  "results": [
    {
      "candidate": "Carlos Lopez",
      "votes": 2,
      "percentage": "66.67%"
    },
    {
      "candidate": "Jorge Builes",
      "votes": 1,
      "percentage": "33.33%"
    }
  ]
}
```

---

## 📸 Capturas

👉 Agregar capturas de Postman mostrando:

* Creación de votos
* Endpoint /votes/statistics

---

## ✅ Validaciones implementadas

* Un votante solo puede votar una vez
* Validación de IDs
* Validación de campos obligatorios
* Email único en votantes
* Un votante no puede ser candidato y viceversa

---

## 🧪 Pruebas

Probado con Postman.

---

## 👨‍💻 Autor

Jorge Builes
