const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzhiMjUxMTdiNmJhMDY0ZjgxMWQ2OWU3MjY3YWQzZCIsInN1YiI6IjY0ZWYyMDU1NGIwYzYzMDBjNDI2NGYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iAgZVTi_8cXMHN0j4Euli6sT-EQt-2tT1qqQwVupZeg"
const lang = "en-US"


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_TOKEN}`
    }
};


const setMultipleAttributesOnElement = (elem, elemAttributes) => {
    Object.keys(elemAttributes).forEach(attribute => {
        elem.setAttribute(attribute, elemAttributes[attribute]);

    });

}

// Movie details popup card close btn
const closeModalButtons = document.querySelectorAll("[data-close-button]")

closeModalButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const modal = btn.closest(".modal")
        closeModal(modal)
    })
})

const openModal = (modal) => {
    if (modal == null) return
    modal.classList.add("active")
    overlay.classList.add("active")
}

const closeModal = (modal) => {
    if (modal == null) return
    modal.classList.remove("active")
    overlay.classList.remove("active")
}

// Fetch Movie Credits
const getMovieCredits = async (media_type, movieID) => {
    const response = await fetch(`https://api.themoviedb.org/3/${media_type}/${movieID}/credits?language=${lang}`, options)
    const responseJSON = await response.json()

    const movieCast = responseJSON.cast.slice(0, 5).map(cast => cast.name)
    const movieProducer = (responseJSON.crew.filter(crewMember => crewMember.job == "Executive Producer").length > 0 ? responseJSON.crew.filter(crewMember => crewMember.job == "Executive Producer").slice(0, 1)[0].name : responseJSON.crew.filter(crewMember => crewMember.job == "Executive Producer"))

    const movieCredit = [movieCast, movieProducer]

    return movieCredit
}


// Fetch Movie Genres
const getMovieGenre = async (media_type, movie) => {
    const response = await fetch(`https://api.themoviedb.org/3/genre/${media_type}/list?language=${lang}`, options);
    const responseJSON = await response.json();

    const movieGenres = await responseJSON.genres.filter(genre => movie.genre_ids.includes(genre.id))
    return movieGenres;
}

// Fetch Trending Movies & Series
const getTrendigMovies = async (media_type, period) => {
    const response = await fetch(`https://api.themoviedb.org/3/trending/${media_type}/${period}?language=${lang}`, options);
    const responseJSON = await response.json();
    const trendingMovies = await responseJSON.results.slice(0, 12);

    return trendingMovies;
}

const renderTrendingMovies = async (media_type, period) => {
    const trendingMovies = await getTrendigMovies(media_type, period)

    try {
        trendingMovies.forEach((movie, index) => {
            const movieID = movie.id
            const moviePoster = document.querySelectorAll(".featured-movie-img")

            const imgAttributes = {
                src: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                alt: `${movie.title}`,
                "data-modal-target": `#modal`
            }
            setMultipleAttributesOnElement(moviePoster[index], imgAttributes)

            moviePoster[index].addEventListener("click", async () => {
                const modal = document.querySelector(moviePoster[index].dataset.modalTarget)
                const modalHeader = document.querySelector(".modal-header")

                modalHeader.style.cssText = `
                    background: linear-gradient(
                        0deg,
                        rgba(11, 11, 12, 0.7),
                        rgba(105, 105, 105, 0.3)
                      ),
                      url(https://image.tmdb.org/t/p/original${movie.poster_path});
                      background-repeat: no-repeat;
                    background-position: center;
                    background-size: cover;
                    `;

                // Update Text of the Modal with API content
                document.querySelector(".modal-header > div .movie-type").innerHTML = `${movie.media_type}`
                document.querySelector(".modal-body-header .movie-title > h2").innerHTML = `${movie.title}`
                document.querySelector(".modal-body-header .movie-title > .rating > .movie-release").innerHTML = `${movie.release_date}`
                document.querySelector(".modal-body .modal-body-description .movie-summary > p").innerHTML = `${movie.overview}`
                document.querySelector(".modal-body-header .movie-title > .rating .movie-rating > i").innerHTML = `  ${movie.vote_average}`
                document.querySelector(".modal-body-header .movie-title > .rating .movie-popularity").innerHTML = `  ${movie.popularity}`

                try {
                    // Fetch Movie Genres
                    const movieGenres = await getMovieGenre(media_type, movie)

                    // Fetch Movie Credits: Casts and Producer
                    const movieCredit = await getMovieCredits(media_type, movieID)

                    // Change Movie Genres Text
                    let movieGenreContainer = document.querySelector(".modal-body-header .movie-genre")
                    movieGenreContainer.innerHTML = ""
                    movieGenres.forEach((genre, index) => {
                        const genreText = `<p>${genre.name}</p>`
                        movieGenreContainer.innerHTML += genreText

                    })

                    // Set paragraph to Producer name
                    document.querySelector(".modal-body .modal-body-description .movie-cast > p:first-of-type").innerHTML = `<span>Director:</span><span>${movieCredit[1]}</span>`
                    // Set paragraph to Cast name
                    document.querySelector(".modal-body .modal-body-description .movie-cast > p:nth-of-type(2)").innerHTML = `<span>Cast:</span><span>${movieCredit[0].join(", ")}</span>`
                } catch (error) {
                    console.log("Error !")
                    console.log(error)
                }

                openModal(modal)
            })

            closeModalButtons.forEach(btn => {
                const modal = btn.closest(".modal")
                closeModal(modal)
            })
        })
    } catch (error) {
        console.log("Error !")
        console.log(error)
    }
}

renderTrendingMovies("movie", "day");