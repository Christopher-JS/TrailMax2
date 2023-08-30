const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzhiMjUxMTdiNmJhMDY0ZjgxMWQ2OWU3MjY3YWQzZCIsInN1YiI6IjY0ZWYyMDU1NGIwYzYzMDBjNDI2NGYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iAgZVTi_8cXMHN0j4Euli6sT-EQt-2tT1qqQwVupZeg"
const lang = "en-US"


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_TOKEN}`
    }
};


// Fetch Trending Movies for featured movie section
const setMultipleAttributesOnElement = (elem, elemAttributes) => {
    Object.keys(elemAttributes).forEach(attribute => {
        elem.setAttribute(attribute, elemAttributes[attribute]);

    });

}

fetch(`https://api.themoviedb.org/3/trending/movie/week?language=${lang}`, options)
    .then(response => response.json())
    .then(response => {
        const trendingMovies = response.results
        const featuredMovies = trendingMovies.slice(0, 12);

        featuredMovies.forEach((movie, index) => {
            const moviePoster = document.querySelectorAll(".featured-movie-img")

            const imgAttributes = {
                src: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
                alt: `${movie.title}`,
                "data-modal-target": `#modal`
            }

            setMultipleAttributesOnElement(moviePoster[featuredMovies.indexOf(movie)], imgAttributes)
        });
    })
    .catch(err => console.error(err));