// Get the Location of Current Page
const global = {
    currentpage: window.location.pathname,
    search: {
        term: '',
        type: '',
        page: 1,
        totalPages: 1,
        totalResults: 0,
    },
    api: {
        apiKey: 'b0780f12a6f4d3e3c69be2b5d9763af1',
        apiUrl: 'https://api.themoviedb.org/3/'
    }
}

// Declaring the Variable
const search_value = document.querySelector('#search-term');
const movieRadio = document.getElementById("movie");
const tvRadio = document.getElementById("tv");
const speak_btn = document.querySelector('#speak-btn');

// Displaying the Popular Movie
async function displayPopularMovie() {
    const { results } = await fetchAPIData('movie/popular');
    results.forEach(movie => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML =
            `
        <a href="movie-details.html?id=${movie.id}">
          ${movie.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
            />`: `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
          />`
            }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>`;

        document.querySelector('#popular-movies').appendChild(div);
    });
}

// Displaying the Popular TV Shows
async function displayPopularShows() {
    const { results } = await fetchAPIData('tv/popular');
    results.forEach(show => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML =
            `
        <a href="tv-details.html?id=${show.id}">
          ${show.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
            />`: `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
            }
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Air: ${show.first_air_date}</small>
          </p>
        </div>`;

        document.querySelector('#popular-shows').appendChild(div);
    });
}

// Display Movie Details
async function displayMovieDetails() {
    const movieId = window.location.search.split('=')[1];
    const movie = await fetchAPIData(`movie/${movieId}`);
    // Overlay for BackGround Image
    displayBackgroundImage('movie', movie.backdrop_path);

    const div = document.createElement('div');
    div.innerHTML =
        `<div class="details-top">
    <div>
    ${movie.poster_path
            ? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
        />`: `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}"
      />`
        }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>${movie.overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      <a href="#" class="btn" id="trailor">Watch Trailor</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNum(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNum(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} min</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
  </div>`;

    document.querySelector('#movie-details').appendChild(div);
    showTrailor(movieId);
}

// Function to Open the Trailor of Show modal
async function showTrailor(movieId) {
    // Get the Data From The API
    const { results } = await fetchAPIData(`movie/${movieId}/videos`);
    const trailerKey = results.find(result => result.type === "Trailer");
    document.querySelector('#trailor').addEventListener('click', (event) => {
        const elemid = event.target.id;
        if (elemid === 'trailor') {
            document.querySelector('#movie-trailor-modal').classList.add('modal-open');
            document.querySelector('#background-overlay').classList.add('overlay-active');
        }
        displayTrailor(trailerKey);
    });
    document.querySelector('#background-overlay').addEventListener('click', closeTrailor);
    document.querySelector('#close-btn').addEventListener('click', closeTrailor);
}

// Display The Trailer When Click On The Button 
function displayTrailor(trailerKey) {
    if (trailerKey) {
        // Put The Trailer Key in an iframe
        const div = document.createElement('div');
        div.classList.add('iframe');
        div.innerHTML = `<iframe class="youtube-trailer" id="youtube-trailer" width="560" height="315" src="https://www.youtube.com/embed/${trailerKey.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe controls>`;
        document.querySelector('#iframe').appendChild(div);
    } else {
        // If no trailer key is found, display a message
        const noTrailerMessage = document.createElement('p');
        noTrailerMessage.textContent = "No Trailer Found";
        noTrailerMessage.classList.add('no-trailor');
        document.querySelector('#iframe').appendChild(noTrailerMessage);
    }
}

// Function to Close the Trailor of Show Modal
function closeTrailor() {
    document.querySelector('#movie-trailor-modal').classList.remove('modal-open');
    document.querySelector('#background-overlay').classList.remove('overlay-active');
    document.querySelector('#iframe').innerHTML = '';
}

// Display Show Details
async function displayShowDetails() {
    const showId = window.location.search.split('=')[1];
    const show = await fetchAPIData(`tv/${showId}`);

    // Overlay for BackGround Image
    displayBackgroundImage('tv', show.backdrop_path);

    const div = document.createElement('div');
    div.innerHTML =
        `<div class="details-top">
    <div>
    ${show.poster_path
            ? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
        />`: `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${show.name}"
      />`
        }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
      <p>${show.overview}</p>
      <h5>Genres</h5>
      <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${show.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episode:</span>${show.number_of_episodes}</li>
      <li><span class="text-secondary">Last Episode To Air: </span>${show.last_episode_to_air.name.toLowerCase()}</li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li> 
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}</div>
  </div>`;

    document.querySelector('#show-details').appendChild(div);
}

// Display BackDrop On Details Page
function displayBackgroundImage(type, backdrop_path) {
    // Setting the BackDrop Path Of The Image
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backdrop_path})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';

    // Checking the Type Of BackDrop
    if (type === 'movie')
        document.querySelector('#movie-details').appendChild(overlayDiv);
    else
        document.querySelector('#show-details').appendChild(overlayDiv);
}

// Search Movies/shows
async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    global.search.type = urlParams.get('type');
    global.search.term = urlParams.get('search-term');

    if (global.search.term !== '' && global.search.term !== null) {
        // @todo - make request and display results
        const { results, total_pages, page, total_results } = await searchAPIData();

        global.search.page = page;
        global.search.totalPages = total_pages;
        global.search.totalResults = total_results;


        if (results.length === 0) {
            showAlert('No Results Found', 'alert-error');
            return;
        }

        displaySearchResults(results);

        document.querySelector('#search-term').value = '';

    } else {
        // If Search Term is Null it Will Show the Error
        showAlert('Please Enter a Search Term', 'alert-error');
    }
}

// Function to display the Search Results
function displaySearchResults(results) {
    // Clear The Previous Results
    document.querySelector('#search-results').innerHTML = '';
    document.querySelector('#search-results-heading').innerHTML = '';
    document.querySelector('#pagination').innerHTML = '';

    results.forEach(result => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML =
            `
        <a href="${global.search.type}-details.html?id=${result.id}">
          ${result.poster_path
                ? `<img
            src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
            />`: `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
          />`
            }
        </a>
        <div class="card-body">
          <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${global.search.type === "movie" ? result.release_date : result.first_air_date}</small>
          </p>
        </div>`;

        document.querySelector('#search-results-heading').innerHTML = `<h2>${results.length} of ${global.search.totalResults}</h2>`;

        document.querySelector('#search-results').appendChild(div);
    });

    displayPagination();

}

// Search the filter Data
async function searchFilterData(value, type) {
    let searchvalue = value.replace(' ', '+');
    global.search.type = type;
    if (searchvalue !== '') {
        const { results } = await searchFilterAPIData(searchvalue);
        if (results.length === 0) {
            document.querySelector('#search-list').classList.remove('search-list');
            document.querySelector('#search-list').innerHTML = '';
        }
        else {
            displayFilterData(results);
            document.querySelector('#search-list').classList.add('search-list');
        }
    } else {
        document.querySelector('#search-list').classList.remove('search-list');
        document.querySelector('#search-list').innerHTML = '';
    }
}

function displayFilterData(results) {
    document.querySelector('#search-list').innerHTML = '';
    results.forEach((result) => {
        let li = document.createElement('li');
        li.innerHTML = `<a class="search-icon" href="${global.search.type}-details.html?id=${result.id}">
        ${result.poster_path ?
                `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${global.search.type === 'movie' ? result.title : result.name}" width="30" class="search-image"></img>` :
                `<img src="images/no-image.jpg" alt="${global.search.type === 'movie' ? result.title : result.name}" width="30" class="search-image"></img>`
            }
      ${global.search.type === "movie" ? result.title : result.name}</a>`
        document.querySelector('#search-list').appendChild(li);
    });
}

// Create Display Pagination for Search
function displayPagination() {
    const div = document.createElement('div');
    div.classList.add('pagination');
    div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalResults}</div>`;
    document.querySelector('#pagination').appendChild(div);

    // Disable Previous Button If The User Is In Page 1
    if (global.search.page === 1) {
        document.querySelector('#prev').disabled = true;
    }

    // Disable The Next Button If the User is in Last Page
    if (global.search.page === global.search.totalPages) {
        document.querySelector('#next').disabled = true;
    }

    // Next Page
    document.querySelector('#next').addEventListener('click', async () => {
        global.search.page++;
        const { results, total_pages } = await searchAPIData();
        displaySearchResults(results);
    });

    // Previous Page
    document.querySelector('#prev').addEventListener('click', async () => {
        global.search.page--;
        const { results, total_pages } = await searchAPIData();
        displaySearchResults(results);
    });

}

// Display Slider Movies
async function displaySlider() {
    const { results } = await fetchAPIData('movie/now_playing');
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `<a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
         </h4>`
        document.querySelector('.swiper-wrapper').appendChild(div);

        initSwiper();
    });
}

// Function To Move The Slider
// Source Credit Swiper js

function initSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        breakpoints: {
            500: {
                slidesPerView: 2,
            },
            700: {
                slidesPerView: 3,
            },
            1200: {
                slidesPerView: 4,
            }
        }
    });
}

// Fetch the Data From TMDB API
async function fetchAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    // Show Loader When API is requesting to the server
    showSpinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();

    // When API IS Retrieving The Data From The themoviedb It Remove The Loader
    hideSpinner();
    return data;
}

// Make Request to Search Filter Data
async function searchFilterAPIData(endpoint) {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&query=${endpoint}`);
    const data = await response.json();

    return data;
}

// Make Request to Search
async function searchAPIData() {
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;

    // Show Loader When API is requesting to the server
    showSpinner();

    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
    const data = await response.json();

    // When API IS Retrieving The Data From The themoviedb It Remove The Loader
    hideSpinner();
    return data;
}


// Show spinner
function showSpinner() {
    document.querySelector('.spinner').classList.add('show');
}

// Hide spinner
function hideSpinner() {
    document.querySelector('.spinner').classList.remove('show');
}

// Highlight the active links
function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if (link.getAttribute('href') === global.currentpage) {
            link.classList.add('active');
        }
    });
}

// Show Alert
function showAlert(message, classname) {
    const alertEl = document.createElement('div');
    alertEl.classList.add('alert', classname);
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector('#alert').appendChild(alertEl);

    setTimeout(() => { alertEl.remove() }, 3000);
}

function addCommasToNum(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Init App
function init() {

    // Set Up the Custom Routing for the movie app
    switch (global.currentpage) {
        case '/':
        case '/index.html':
            displayPopularMovie();
            displaySlider();
            break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            search();
            break;
    }

    // Automatically Highlight The Page When The DOM Is Loaded
    highlightActiveLink();
}

// Function to start Speech Recogination
async function startRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    let speak_data = ''
    // Set a maximum pause between speech recognition
    recognition.interimResults = true; // Enable interim results
    recognition.continuous = true; // Continue listening
    recognition.maxSilence = 5; // Set the maximum pause in seconds
    document.querySelector('#search-term').placeholder = "Speak Something...";
    recognition.onresult = (event) => {
        // Handle recognized speech here
        const transcript = event.results[0][0].transcript;
        console.log("Recognized: " + transcript.toLowerCase().replace(' ', '+'));
         // Check the search type
         if (movieRadio.checked) {
            searchFilterData(transcript.toLowerCase().replace(' ', '+'), movieRadio.value);
        }
        if (tvRadio.checked) {
            searchFilterData(transcript.toLowerCase().replace(' ', '+'), tvRadio.value);
        }
        // searchFilterData(transcript.toLowerCase().replace(' ', '+'));
        document.querySelector('#search-term').value = transcript.toLowerCase();
        setTimeout(() => {
            recognition.stop();
        }, 3000);
    };

    recognition.onend = () => {
        // Restart recognition after a pause
        console.log("Speech recognition ended. Restarting...");
    };

    // Start speech recognition
    recognition.start();

    recognition.onerror = (event) => {
        if (event.error === "no-speech") {
            document.querySelector('#search-term').placeholder = "Didn't hear that. Try again.";
        }
    };
}

// Search the Data From speech recogination
function speechRecogination() {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        speak_btn.addEventListener('click', () => {
            startRecognition();
        });
    }
}

// When DOM is loaded it initialize the event listner
function Init() {

    document.addEventListener('DOMContentLoaded', init);

    document.addEventListener('click', () => {
        document.querySelector('#search-list').innerHTML = '';
        document.querySelector('#search-list').classList.remove('search-list');
    })

    // Take the value from the search form
    search_value.addEventListener('keyup', (e) => {
        if (e.key) {
            // Check the search type
            if (movieRadio.checked) {
                searchFilterData(search_value.value, movieRadio.value);
            }
            if (tvRadio.checked) {
                searchFilterData(search_value.value, tvRadio.value);
            }
        }
    });
    document.querySelector("#search-term").addEventListener('click', () => {
        document.querySelector('#search-term').placeholder = "Enter search term";
    });
}
Init();
speechRecogination();
