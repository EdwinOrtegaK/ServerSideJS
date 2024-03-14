# API del Blog Pokémon

## Descripción

Este proyecto es una API RESTful diseñada para gestionar un blog centrado en Pokémon. Permite a los usuarios crear, leer, actualizar y eliminar posts sobre diferentes Pokémon, incluyendo detalles como el nombre del Pokémon, tipo, habilidades, y más.

## Inicio Rápido

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado Node.js y npm en tu sistema. Esta API también requiere una base de datos MySQL.

### Instalación

1. Clona este repositorio y navega al directorio del proyecto
2. Instala las dependencias utilizando `npm install`
3. Configura tu base de datos MySQL siguiendo las instrucciones en config/database.js.
4. Inicia el servidor utilizando `npm start`

### Uso
La API está ahora accesible en `http://localhost:5000/.`

### Endpoints Disponibles
`GET /posts`: Obtiene todos los posts.
`POST /posts`: Crea un nuevo post.
`GET /posts/{postId}`: Obtiene un post por su ID.
`PUT /posts/{postId}`: Actualiza un post existente.
`DELETE /posts/{postId}`: Elimina un post específico.

### Ejemplos
Crear un nuevo post:

curl -X POST http://localhost:5000/posts -H 'Content-Type: application/json' -d '{
  "title": "Mi Experiencia con Pikachu",
  "content": "Pikachu es un Pokémon increíble por las siguientes razones...",
  "pokemonName": "Pikachu",
  "tipoPokemon": "Eléctrico",
  "grupo": "Mouse Pokémon",
  "cualidad": "Electricidad Estática",
  "region": "Kanto",
  "descripcion": "Pikachu, que puede generar electricidad potente, tiene mejillas rojas que son extra suaves y super adorables."
}'

## Contribución
Si deseas contribuir a este proyecto, por favor envía un Pull Request con tus mejoras o abre un issue para discutir los cambios propuestos.

## Licencia
Este proyecto se distribuye bajo la licencia UVG. Consulta el archivo LICENSE para más detalles.

## Agradecimientos
Gracias a PokéAPI por proporcionar una gran cantidad de datos sobre Pokémon que inspiraron este proyecto.
Agradecimientos especiales a todos los contribuyentes del proyecto.
