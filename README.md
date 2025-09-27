# 📌 Prueba Capta - API de Cálculo de Horas/Días Hábiles

Este proyecto es una API en **Node.js + TypeScript** que permite calcular fechas sumando **horas o días hábiles** a partir del momento actual (hora de Colombia).  
La API devuelve como respuesta la **fecha y hora resultante en formato UTC**.

---

## ⚙️ Requisitos previos

Antes de empezar asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

---

## 🚀 Instalación

Clona este repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/danielcruz94/prueba-Capta.git
cd prueba_capta

instala las dependencias con el siguiente comando
npm install


Para correr la API en modo desarrollo con recarga automática:
npm run dev


## 📡 Ejemplo de petición a la API

La API permite calcular la fecha resultante sumando días hábiles a una fecha específica.

### Endpoint de ejemplo:

```http
GET http://localhost:3000/api/calculate?days=1&date=2025-09-26T17:30:00.000Z

{
  "date": "2025-09-29T17:00:00.000Z"
}
