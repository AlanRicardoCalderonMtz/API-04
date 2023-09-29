//Crear el servidor
const { json } = require('express');
const express = require('express');
const app = express();
// Que tome el puerto establecido a la nube (render )
const puerto = process.env.PORT || 3000;

// Midleware - Intermediario
app.use(express.json())

//Arreglo de objeto de Películas
let peliculas = [
    {
        id: 1,
        titulo: "Toy Story",
        director: "John Lasseter",
        año_lanzamiento: "1995",
        genero: "Animación/Comedia",
        clasificacion: "8.3"
    },
    {
        id: 2,
        titulo: "Finding Nemo", 
        director: "Andrew Stanton",
        año_lanzamiento: "2003",
        genero: "Animación/Aventura",
        clasificacion: "8.1"
    },
    {
        id: 3,
        titulo: "The Lion King",
        director: "Roger Allers, Rob Minkoff",
        año_lanzamiento: "1994",
        genero: "Animación/Aventura",
        clasificacion: "8.5"
    },
    {
        id: 4,
        titulo: "Frozen",
        director: "Chris Buck, Jennifer Lee",
        año_lanzamiento: "2013",
        genero: "Animación/Aventura",
        clasificacion: "7.4"
    },
    {
        id: 5,
        titulo: "Shrek",
        director: "Andrew Adamson, Vicky Jenson",
        año_lanzamiento: "2001",
        genero: "Animación/Comedia",
        clasificacion: "7.8"
    },
    {
        id: 6,
        titulo: "Moana",
        director: "Ron Clements, John Musker",
        año_lanzamiento: "2016",
        genero: "Animación/Aventura",
        clasificacion: "7.6"
    },
    {
        id: 7,
        titulo: "The Godfather",
        director: "Francis Ford Coppola",
        año_lanzamiento: "1972",
        genero: "Crimen/Drama",
        clasificacion: "9.2"
    },
    {
        id: 8,
        titulo: "Cars",
        director: "John Lasseter, Joe Ranft",
        año_lanzamiento: "2006",
        genero: "Animación/Aventura",
        clasificacion: "7.1"
    },
    {
        id: 9,
        titulo: "The Incredibles",
        director: "Brad Bird",
        año_lanzamiento: "2004",
        genero: "Animación/Acción",
        clasificacion: "8.0"
    },
    {
        id: 10,
        titulo: "Coco",
        director: "Lee Unkrich, Adrian Molina",
        año_lanzamiento: "2017",
        genero: "Animación/Aventura",
        clasificacion: "8.4"
    }
]

//Solicitud , respuesta
app.get('/socios/v1/peliculas', (req, res) => {
    //1° Verificar si existe películas
    if (peliculas.length > 0) {
        //Existen películas
        res.status(200).json({
            estado: 1,
            mensaje: "Existen Películas",
            //var : contenido
            pelis: peliculas
        })
    } else {
        //No existen películas
        res.status(404).json({
            estado: 0,
            mensaje: "No se encontraron películas",
            pelis: null

        })
    }
})

app.get('/socios/v1/peliculas/:id', (req, res) => {
    //  Solo una película

    // Obtener el ID de la película desde los parámetros de la URL
    const PeliculaId = req.params.id;

    // Buscar la película por su ID en tu arreglo 
    const peliculaEncontrada = peliculas.find(pelicula => pelicula.id == PeliculaId);
    if (peliculaEncontrada) {
        // Si se encontró la película, devolverla en formato JSON
        res.status(200).json({
            estado: 1,
            mensaje: "Película encontrada",
            peli: peliculaEncontrada
        });
    } else {
        // Si no se encontró la película, devolver un mensaje de error en JSON
        res.status(404).json({
            estado: 0,
            mensaje: "Película no encontrada",
            peli: null
        });
    }
});

// Crear un recurso - Crear una pelicula
app.post('/socios/v1/peliculas', (req, res) => {
    const { titulo, director, año_lanzamiento, genero, clasificacion } = req.body
    const id = Math.round(Math.random() * 1000);

    if (titulo == undefined || director == undefined || año_lanzamiento == undefined || genero == undefined || clasificacion == undefined) {
        //Hay un error en la solicitud por parte del programador
        res.status(400).json({
            estado: 0,
            mensaje: "Faltan parametros en la solicitud",
        })
    } else {
        const movie = { id: id, titulo: titulo, director: director, año_lanzamiento: año_lanzamiento, genero: genero, clasificacion: clasificacion }
        const longitud_inicial = peliculas.length;
        peliculas.push(movie)
        if (peliculas.length > longitud_inicial) {
            //All bien por parte del cliente y servidor
            // 200 (todo ok) y 201(creado)
            res.status(201).json({
                estado: 1,
                mensaje: "Pelicula creada",
                pelis: movie
            })
        } else {
            //Error del servidor -> 'creador de la API o de la BD, Quien configura el servidor'
            // 500 -> error interno
            res.status(500).json({
                estado: 0,
                mensaje: "Ocurrio un error desconocido"
            })
        }
    }
})

// Actualizar un recurso - Actualizar una película
app.put('/socios/v1/peliculas/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, director, año_lanzamiento, genero, clasificacion } = req.body;
    //verificar que titulo, director, año_lanzamiento, genero, clasificacion vengan en el body
    if (titulo == undefined || director == undefined || año_lanzamiento == undefined || genero == undefined || clasificacion == undefined) {
        res.status(400).json({
            estado: 0,
            mensaje: "Faltan parametros en la solicitud"
        })
    } else {
        const posActualizar = peliculas.findIndex(pelicula => pelicula.id == id)
        if (posActualizar != -1) {
            //Si encontro la película con el id buscado
            //Actualizar la película
            peliculas[posActualizar].titulo = titulo;
            peliculas[posActualizar].director = director;
            peliculas[posActualizar].año_lanzamiento = año_lanzamiento;
            peliculas[posActualizar].genero = genero;
            peliculas[posActualizar].clasificacion = clasificacion;
            res.status(200).json({
                estado: 1,
                mensaje: "Película actualizada correctamente"
            });
        } else {
            res.status(404).json({
                estado: 0,
                mensaje: "Película no encontrada"
            })
        }
    }
})

//Eliminar un recurso - Eliminar una película
app.delete('/socios/v1/peliculas/:id', (req, res) => {
    const { id } = req.params;

    // Buscar la posición de la película en el array 'películas' por su ID
    const posEliminar = peliculas.findIndex(pelicula => pelicula.id == id);

    if (posEliminar != -1) {
        // Si se encontró la película con el ID buscado, eliminarla del array
        peliculas.splice(posEliminar, 1);

        res.status(201).json({
            estado: 1,
            mensaje: "Pelicula eliminada correctamente"
        });
    } else {
        res.status(404).json({
            estado: 0,
            mensaje: "Película no encontrada"
        });
    }
})

app.listen(puerto, () => {
    console.log('Servidor corriendo en el puerto: ', puerto);
})