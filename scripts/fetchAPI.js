const API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTFiYjEyMDNmN2VjMGI1NjY1YjJhMWE1OTAxOTEyYSIsIm5iZiI6MTczMjUzMzUyNy45OTgzMDE1LCJzdWIiOiI2NzQ0MzIxNjlhMmYzODJjYmQzNWY0YjIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.I9FganDmmhQqyYYEiXvLhxrLV-AvR6MfrBNzJ9onbXA";
const lang = "en-US";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

const closeModalButtons = document.querySelectorAll("[data-close-button]");

closeModalButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    closeModal(modal);
  });
});

const openModal = (modal) => {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
};

const closeModal = (modal) => {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
};

// Fetch Movie Credits
const getMovieCredits = async (media_type, movieID) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${media_type}/${movieID}/credits?language=${lang}`,
      options
    );
    const responseJSON = await response.json();

    const movieCast = responseJSON.cast.slice(0, 5).map((cast) => cast.name);
    const movieProducer =
      responseJSON.crew.filter(
        (crewMember) => crewMember.job == "Executive Producer"
      ).length > 0 ?
      responseJSON.crew
      .filter((crewMember) => crewMember.job == "Executive Producer")
      .slice(0, 1)[0].name :
      responseJSON.crew.filter(
        (crewMember) => crewMember.job == "Executive Producer"
      );

    const movieCredit = [movieCast, movieProducer];

    return movieCredit;
  } catch (error) {
    console.log(error);
  }
};

// Fetch Movie Genres
const getMovieGenre = async (media_type, movie) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/${media_type}/list?language=${lang}`,
      options
    );
    const responseJSON = await response.json();

    const movieGenres = await responseJSON.genres.filter((genre) =>
      movie.genre_ids.includes(genre.id)
    );
    return movieGenres;
  } catch (error) {
    console.log(error);
  }
};

// Fetch All Movies
const getAllMovies = async (section_type, media_type, page, sort_media) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/${section_type}/${media_type}?language=${lang}&page=${page}${sort_media}`,
      options
    );

    const responseJSON = await response.json();
    const allMovies = await responseJSON.results;
    return allMovies;
  } catch (error) {
    console.log(error);
  }
};

const renderAllMovies = async (section_type, media_type, page, sort_media) => {
  const allMovies = await getAllMovies(
    section_type,
    media_type,
    page,
    sort_media
  );
  const allMoviesContainer = document.querySelector(
    `.discover-content.${media_type}`
  );
  allMoviesContainer ? (allMoviesContainer.innerHTML = "") : null;

  try {
    allMovies.forEach((movie, index) => {
      const movieID = movie.id;
      const movieCard = `
                <div class="movie-card">
                    <img src="https://image.tmdb.org/t/p/original${
                      movie.poster_path
                    }" alt="${media_type === "tv" ? movie.name : movie.title}">
                    <div class="movie-description">
                        <div>
                            <h2>${
                              media_type === "tv" ? movie.name : movie.title
                            }</h2>
                            <p>${
                              media_type === "tv"
                                ? movie.first_air_date
                                : movie.release_date
                            }</p>
                        </div>
                        <div>
                            <i class="fa-regular fa-square-plus"></i>
                            <i class="fa-regular fa-thumbs-up"></i>
                            <i class="fa-regular fa-thumbs-down"></i>
                        </div>
                    </div>
                </div>
            `;
      allMoviesContainer ? (allMoviesContainer.innerHTML += movieCard) : null;
    });
  } catch (error) {
    console.log("Error !");
    console.log(error);
  }
};

// Load More Movies on click of button
const loadMore = async (section_type, media_type, page, sort_media) => {
  const allMovies = await getAllMovies(
    section_type,
    media_type,
    page,
    sort_media
  );
  const allMoviesContainer = document.querySelector(
    `.discover-content.${media_type}`
  );
  const loadMoreBtn = document.querySelector(".load-more");
  let currentItems = allMovies ? allMovies.length : 0;

  try {
    loadMoreBtn.addEventListener("click", (e) => {
      let elementList = [
        ...document.querySelectorAll(
          `.discover-content.${media_type} > .movie-card`
        ),
      ];
      e.target.classList.add("show-loader");

      for (let i = currentItems; i < currentItems + 20; i++) {
        setTimeout(async () => {
          page++;
          const newMovies = await getAllMovies(
            section_type,
            media_type,
            page,
            sort_media
          );
          // let newAllMovies =
          elementList = elementList.concat(newMovies);
          e.target.classList.remove("show-loader");
          if (elementList[i]) {
            const movieCard = `
                            <div class="movie-card">
                                <img src="https://image.tmdb.org/t/p/original${
                                  elementList[i].poster_path
                                }" alt="${
              media_type === "tv" ? elementList[i].name : elementList[i].title
            }">
                                <div class="movie-description">
                                    <div>
                                        <h2>${
                                          media_type === "tv"
                                            ? elementList[i].name
                                            : elementList[i].title
                                        }</h2>
                                        <p>${
                                          media_type === "tv"
                                            ? elementList[i].first_air_date
                                            : elementList[i].release_date
                                        }</p>
                                    </div>
                                    <div>
                                        <i class="fa-regular fa-square-plus"></i>
                                        <i class="fa-regular fa-thumbs-up"></i>
                                        <i class="fa-regular fa-thumbs-down"></i>
                                    </div>
                                </div>
                            </div>
                        `;
            allMoviesContainer.innerHTML += movieCard;
          }
        }, 1500);
      }
      currentItems += 20;

      // hide load button after fully load
      if (currentItems >= elementList.length) {
        e.target.classList.add("loaded");
      }
    });
  } catch (error) {
    console.log("Error !");
    console.log(error);
  }
};

// Fetch Trending Movies & Series
const getTrendigMovies = async (media_type, period) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/${media_type}/${period}?language=${lang}`,
      options
    );
    const responseJSON = await response.json();
    const trendingMovies = await responseJSON.results.slice(0, 18);

    return trendingMovies;
  } catch (error) {
    console.log(error);
  }
};

const renderTrendingMovies = async (media_type, period) => {
  const trendingMovies = await getTrendigMovies(media_type, period);
  const trendingMovieContainer = document.querySelector(
    `.slider.${media_type}`
  );
  trendingMovieContainer.innerHTML = "";
  // console.log(trendingMovies)
  // console.log(trendingMovieContainer)

  try {
    trendingMovies.forEach((movie, index) => {
      const movieID = movie.id;
      const movieCard = `
                <div class="movie-poster" data-modal-target="#modal">
                    <img src="https://image.tmdb.org/t/p/original${
                      movie.poster_path
                    }" alt="${movie.title}"  class="featured-movie-img">
                    <p>${media_type === "movie" ? movie.title : movie.name}</p>
                </div>
            `;

      trendingMovieContainer
        ?
        (trendingMovieContainer.innerHTML += `${movieCard}`) :
        null;
      // console.log(movie)
    });
  } catch (error) {
    console.log("Error !");
    console.log(error);
  }
};

const renderMovieDescriptionModal = async (media_type, period) => {
  const trendingMovies = await getTrendigMovies(media_type, period);
  const moviePoster = document.querySelectorAll(
    `.slider.${media_type} > .movie-poster`
  );

  try {
    trendingMovies.forEach((movie, index) => {
      const movieID = movie.id;

      moviePoster[index].addEventListener("click", async () => {
        const modal = document.querySelector(
          moviePoster[index].dataset.modalTarget
        );
        const modalHeader = document.querySelector(".modal-header");

        console.log(movie);

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
        document.querySelector(
          ".modal-header > div .movie-type"
        ).innerHTML = `${movie.media_type}`;
        document.querySelector(
          ".modal-body-header .movie-title > h2"
        ).innerHTML = `${media_type === "tv" ? movie.name : movie.title}`;
        document.querySelector(
          ".modal-body-header .movie-title > .rating > .movie-release"
        ).innerHTML = `${
          media_type === "tv" ? movie.first_air_date : movie.release_date
        }`;
        document.querySelector(
          ".modal-body .modal-body-description .movie-summary > p"
        ).innerHTML = `${movie.overview}`;
        document.querySelector(
          ".modal-body-header .movie-title > .rating .movie-rating > i"
        ).innerHTML = `  ${movie.vote_average}`;
        document.querySelector(
          ".modal-body-header .movie-title > .rating .movie-popularity"
        ).innerHTML = `  ${movie.popularity}`;

        // Fetch Movie Genres
        const movieGenres = await getMovieGenre(media_type, movie);
        // console.log(movieGenres)

        // Fetch Movie Credits: Casts and Producer
        const movieCredit = await getMovieCredits(media_type, movieID);

        // Change Movie Genres Text
        let movieGenreContainer = document.querySelector(
          ".modal-body-header > .movie-genre"
        );
        movieGenreContainer.innerHTML = "";
        movieGenres.forEach((genre, index) => {
          const genreText = `<p>${genre.name}</p>`;
          movieGenreContainer.innerHTML += genreText;
          console.log(genre.name);
        });

        // Set paragraph to Producer name
        document.querySelector(
          ".modal-body .modal-body-description .movie-cast > p:first-of-type"
        ).innerHTML = `<span>Director:</span><span>${movieCredit[1]}</span>`;
        // Set paragraph to Cast name
        document.querySelector(
          ".modal-body .modal-body-description .movie-cast > p:nth-of-type(2)"
        ).innerHTML = `<span>Cast:</span><span>${movieCredit[0].join(
          ", "
        )}</span>`;

        openModal(modal);
      });

      closeModalButtons.forEach((btn) => {
        const modal = btn.closest(".modal");
        closeModal(modal);
      });
    });
  } catch (error) {
    console.log("Error !");
    console.log(error);
  }
};

if (location.href.toString().includes("/pages/all-movies.html")) {
  renderAllMovies("discover", "movie", 1, "&sort_by=popularity.desc");
  loadMore("discover", "movie", 1, "&sort_by=popularity.desc");
} else if (location.href.toString().includes("/pages/all-series.html")) {
  renderAllMovies("discover", "tv", 1, "&sort_by=popularity.desc");
  loadMore("discover", "tv", 1, "&sort_by=popularity.desc");
} else if (location.href.toString().includes("/pages/upcoming.html")) {
  renderAllMovies("movie", "upcoming", 1, "");
  loadMore("movie", "upccoming", 1, "");
}

if (location.toString().includes("/index.html")) {
  window.addEventListener("load", async () => {
    renderTrendingMovies("movie", "day");
    renderTrendingMovies("tv", "day");
    await renderMovieDescriptionModal("movie", "day");
    await renderMovieDescriptionModal("tv", "day");
  });
}