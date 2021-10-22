///////////// App variables  //////////////////////

const mdbUrl = "https://api.themoviedb.org/3";
const apiKey = "eeccdddb353ca1b4e8f78b87bd59619a";
let genresData, searchWord;
let pageInfo = { current: 1, last: 0 };
let activeMovie = "";
let detailsData = {
  video: "",
  comments: [],
  similar: [],
};

///////////// Event Listeners  //////////////////////

window.addEventListener("scroll", () => infiniteScroll());

document
  .querySelector("#searchInput")
  .addEventListener("input", (e) =>
    e.target.value === ""
      ? (clearScreen(),
        fetchMovies(
          `${mdbUrl}/movie/now_playing?api_key=${apiKey}&page=${pageInfo.current}`
        ))
      : ((searchWord = e.target.value), searchCall(e.target.value))
  );

///////////// Initialise app  //////////////////////

window.onload = function show() {
  fetchGenres();
  fetchMovies();
  document.querySelector("#inTheaters").innerHTML = "In theaters";
};

///////////// Get movies  //////////////////////

const fetchMovies = async () => {
  fetch(
    `${mdbUrl}/movie/now_playing?api_key=${apiKey}&page=${pageInfo.current}`
  )
    .then((res) => res.json())
    .then((data) => {
      cardsCreator(data.results);
      pageInfo = { ...pageInfo, current: data.page, last: data.total_pages };
    })
    .catch((error) => {
      console.log("Not loaded : ", error);
    });
};

///////////// Get genres  //////////////////////

const fetchGenres = async () => {
  fetch(`${mdbUrl}/genre/movie/list?api_key=${apiKey}`)
    .then((res) => res.json())
    .then((data) => {
      genresData = data.genres;
    })
    .catch((error) => {
      console.log("Genres not loaded: ", error);
    });
};

///////////// Get Movie Details  //////////////////////

const fetchMovieDetails = async (id) => {
  const res = await Promise.all([
    fetch(`${mdbUrl}/movie/${id}/videos?api_key=${apiKey}`),
    fetch(`${mdbUrl}/movie/${id}/reviews?api_key=${apiKey}`),
    fetch(`${mdbUrl}/movie/${id}/similar?api_key=${apiKey}`),
  ])
    .then((response) => Promise.all(response.map((res) => res.json())))
    .then((data) => data)
    .catch((err) => console.log(err));
  return res;
};

///////////// Get Search  //////////////////////

const searchFetch = async () => {
  fetch(
    `${mdbUrl}/search/movie?api_key=${apiKey}&page=${pageInfo.current}&query=${searchWord}`
  )
    .then((res) => res.json())
    .then((data) => {
      cardsCreator(data.results);
      pageInfo = { ...pageInfo, current: data.page, last: data.total_pages };
      document.querySelector(
        "#inTheaters"
      ).innerHTML = `Found ${data.total_results} results`;
    })
    .catch((error) => {
      console.log("Not loaded : ", error);
    });
};

///////////// Infinite scroll  //////////////////////

const infiniteScroll = () => {
  if (
    document.documentElement.scrollHeight -
      (window.scrollY + window.innerHeight) <
      500 &&
    pageInfo.current < pageInfo.last
  ) {
    pageInfo = { ...pageInfo, current: pageInfo.current + 1 };

    document.querySelector("#searchInput").value
      ? searchFetch()
      : fetchMovies();
  }
  window.scrollY > window.innerHeight
    ? (document.querySelector(".goToTop").style.display = "block")
    : (document.querySelector(".goToTop").style.display = "none");
};

///////////// Search  //////////////////////

const searchCall = () => {
  searchWord.length > 2 && (clearScreen(), searchFetch());
};

///////////// Extra functions  //////////////////////

const clearScreen = () => {
  document.querySelector("#content").innerHTML = "";
  pageInfo = { current: 1, last: 0 };
  searchWord.length < 2 &&
    (document.querySelector("#inTheaters").innerHTML = "In theaters");
};

const handleItemClick = (id) => {
  activeMovie !== "" &&
    activeMovie !== id &&
    document.getElementById(`${activeMovie}`).classList.remove("active");

  activeMovie === id
    ? document.getElementById(`${activeMovie}`).classList.toggle("active")
    : (document.getElementById(`${id}`).classList.add("active"),
      fetchMovieDetails(id)
        .then(
          (res) =>
            (detailsData = {
              video: res[0].results[0].key,
              comments: res[1].results,
              similar: res[2].results,
            })
        )
        .then(() => {
          document.getElementById(`${id}`).querySelector(".details").innerHTML =
            "";
          detailsCreator(detailsData, id);
        }));

  activeMovie = id;
};

/////////////  Templates creators  //////////////////////

const cardsCreator = (dataArr) => {
  dataArr &&
    dataArr?.map((movie) => {
      document.querySelector("#content").insertAdjacentHTML(
        "beforeend",
        `
      <div class="card" key="{${movie.id}}" id="${movie.id}"> 
          <div class="ratingContainer">
            <p
            class="rating"
            style="background-color: ${
              movie.vote_average > 7.5
                ? "rgba(64, 170, 60,.8)"
                : movie.vote_average < 5.5
                ? "rgba(184, 44, 44,.8)"
                : "rgba(240, 128, 46,.8)"
            };
            "
            >
            ${movie.vote_average === 0 ? "-" : movie.vote_average}
            </p>
          </div>
          <div
           class="imgContainer"
           style="
           background-image: ${
             movie.poster_path
               ? "url('http://image.tmdb.org/t/p/w185/" +
                 movie.poster_path +
                 "');"
               : "url(assets/alt.jpg);"
           }
           }
        "
           >
           <div class="details" />
            
          </div>
            <div class="overview">
            <h3>Overview </h3>
              <p>${
                movie.overview ? movie.overview : "No overview available"
              }</p>
            </div>
          </div>
      
          <div class="cardInfo " >
            <h3 class="cardTitle" onclick="handleItemClick(${movie.id})">
             ${movie.original_title}
            <span>(${movie.release_date?.substring(0, 4)})</span>
            </h3>
            <div class="genres">
              ${movie.genre_ids
                .map(
                  (item) =>
                    "<p>" +
                    genresData?.find((el) => el.id === item).name +
                    "</p>"
                )
                .join(`<p>/</p>`)}            
            </div>
          </div>
      </div>
      `
      );
    });
};

const detailsCreator = (detailsData, id) => {
  detailsData &&
    document
      .getElementById(`${id}`)
      .querySelector(".details")
      .insertAdjacentHTML(
        "beforeend",
        `
            <iframe
              class="video "
              frameBorder="0"
              allow="fullscreen"
              src="https://www.youtube.com/embed/${
                detailsData?.video
              }?controls=0"
            ></iframe>

            <div class="comments" 
            style = 'display: ${detailsData?.comments?.length === 0 && "none"};'
            >
            <h3>Comments :</h3>
              ${
                detailsData?.comments &&
                detailsData?.comments
                  ?.slice(0, 2)
                  .map(
                    (item) =>
                      "<p>" + detailsData?.comments && item?.content + "<p>"
                  )
                  .join(`<hr/>`)
              }  
            </div>

            <div class="similar">
            <h3>Similar movies: </h3>
              ${
                detailsData?.similar &&
                detailsData?.similar
                  ?.map((item) => "<p>" + item.title + "</p>")
                  .join(``)
              }
            </div>
          `
      );
};
