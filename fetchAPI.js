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

// Fetch Trending Movies for featured movie section
fetch(`https://api.themoviedb.org/3/trending/movie/day?language=${lang}`, options)
    .then(response => response.json())
    .then(response => {
        const featuredMovies = response.results.slice(0, 12);

        featuredMovies.forEach((movie, index) => {
            const movieID = movie.id;
            const moviePoster = document.querySelectorAll(".featured-movie-img")

            const imgAttributes = {
                src: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
                alt: `${movie.title}`,
                "data-modal-target": `#modal`
            }

            setMultipleAttributesOnElement(moviePoster[index], imgAttributes)

            // Render Movie Detail Card on Click of a movie poster image
            moviePoster[index].addEventListener("click", () => {
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

                // Fetch Movie Genres
                fetch(`https://api.themoviedb.org/3/genre/movie/list?language=${lang}`, options)
                    .then(response => response.json())
                    .then(response => {
                        const movieGenres = response.genres.filter(genre => movie.genre_ids.includes(genre.id))
                        // Change Movie Genres Text
                        document.querySelectorAll(".modal-body-header .movie-genre > p").forEach(((genreText, index) => genreText.innerHTML = `${movieGenres[index].name ? movieGenres[index].name  : "Genres"}`))
                        console.log(movieGenres)
                    })
                    .catch(err => console.error(err));

                // Fetch the Movie Credits (Cast & Crew)
                fetch(`https://api.themoviedb.org/3/movie/${movieID}/credits?language=${lang}`, options)
                    .then(response => response.json())
                    .then(response => {
                        const movieCast = response.cast.slice(0, 5).map(cast => cast.name)
                        const movieProducer = response.crew.filter(crewMember => crewMember.job == "Executive Producer").slice(0, 1)[0]
                        // Set paragraph to Producer name
                        document.querySelector(".modal-body .modal-body-description .movie-cast > p:first-of-type > span + span").innerHTML = ` ${movieProducer.name ? movieProducer.name : ""}`
                        // Set paragraph to Cast name
                        document.querySelector(".modal-body .modal-body-description .movie-cast > p:nth-of-type(2) > span + span").innerHTML = ` ${movieCast.join(", ")}`
                    })
                    .catch(err => console.error(err));
                openModal(modal)
            })

            closeModalButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const modal = btn.closest(".modal")
                    closeModal(modal)
                })
            })
        });
    })
    .catch(err => console.error(err));