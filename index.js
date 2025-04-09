const express = require("express");
const cors = require("cors");
const fs = require("fs")
const { movie } = require("./models/movies.model");
const app = express();
const { initializeDatabase } = require("./db/db.connect");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
    console.log("This server is running");
});


// function to get all movies
async function getAllMovies() {
    const movies = await movie.find();
    return { movies: movies };
}

// function to get movie by title
async function getMovieByTitle(movieTitle) {
    const movieData = await movie.findOne({ title: movieTitle });
    if (! movieData) {
        return null;
    }
    return { movie: movieData };
}

// function to get all movies by director
async function getMoviesByDirector(directorName) {
    const movies = await movie.find({ director: directorName });
    return { movies: movies };
}

// function to get movies by genre
async function getMoviesByGenre(movieGenre) {
    const movies = await movie.find();
    const filteredMovies = movies.filter((movie) => movie.genre.includes(movieGenre) === true);
    return { movies: filteredMovies };
}

// api to get all movies
app.get("/movies", async (req, res) => {
    try {
        const response = await getAllMovies();
        if (response.movies.length === 0) {
            return res.status(404).json({ message: "Movies not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// api to get movie by title
app.get("/movies/title/:title", async (req, res) => {
    const movieTitle = req.params.title;
    try {
        const response = await getMovieByTitle(movieTitle);
        if (response === null) {
            return res.status(400).json({ message: "Movie not found"});
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
}); 

// api to get movies by director
app.get("/movies/director/:director", async (req, res) => {
    const directorName = req.params.director;
    try {
        const response = await getMoviesByDirector(directorName);
        if (response.movies.length === 0) {
            return res.status(404).json({ message: "Movies not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

// api to get movies by genre
app.get("/movies/genre/:genre", async (req, res) => {
    const movieGenre = req.params.genre;
    try {
        const response = await getMoviesByGenre(movieGenre);
        if (response.movies.length === 0) {
            return res.status(404).json({ message: "Movies not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

initializeDatabase();
