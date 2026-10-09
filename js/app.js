import { getVisibleMovies, normalizeMovies } from './movies.js';
import { loadFavorites, saveFavorites } from './favorites.js';

const SEARCH_DEBOUNCE_MS = 150;

const movieList = document.getElementById('movie-list');
const movieTemplate = document.getElementById('movie-template');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const favoritesOnly = document.getElementById('favorites-only');
const statusMessage = document.getElementById('status-message');

let movies = [];
const favoriteMovies = loadFavorites();

function createMovieCard(movie) {
    const card = movieTemplate.content.cloneNode(true);
    const image = card.querySelector('.movie-image');
    const title = card.querySelector('.movie-title');
    const meta = card.querySelector('.movie-meta');
    const genre = card.querySelector('.movie-genre');
    const favoriteButton = card.querySelector('.favorite-button');

    image.src = movie.image;
    image.alt = `Portada de ${movie.title}`;
    image.loading = 'lazy';
    title.textContent = movie.title;
    meta.textContent = `Año: ${movie.year}`;
    genre.textContent = movie.genre;
    favoriteButton.dataset.id = String(movie.id);
    updateFavoriteButton(favoriteButton, favoriteMovies.has(movie.id));

    return card;
}

function updateFavoriteButton(button, isFavorite) {
    button.textContent = isFavorite ? '★' : '☆';
    button.classList.toggle('is-favorite', isFavorite);
    button.setAttribute('aria-pressed', String(isFavorite));
    button.setAttribute('aria-label', isFavorite ? 'Quitar de favoritas' : 'Marcar como favorita');
}

function updateStatusMessage(count) {
    const plural = count !== 1;
    statusMessage.textContent = `${count} película${plural ? 's' : ''} encontrada${plural ? 's' : ''}.`;
}

function renderMovies() {
    const visibleMovies = getVisibleMovies(movies, {
        search: searchInput.value,
        sort: sortSelect.value,
        favoritesOnly: favoritesOnly.checked,
        favorites: favoriteMovies,
    });

    movieList.replaceChildren();

    if (visibleMovies.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No hay películas que coincidan con la búsqueda.';
        movieList.appendChild(emptyState);
    } else {
        const fragment = document.createDocumentFragment();
        visibleMovies.forEach((movie) => fragment.appendChild(createMovieCard(movie)));
        movieList.appendChild(fragment);
    }

    updateStatusMessage(visibleMovies.length);
}

async function loadMovies() {
    try {
        const response = await fetch('data/movies.json');
        if (!response.ok) {
            throw new Error(`Respuesta inesperada del servidor (HTTP ${response.status}).`);
        }
        movies = normalizeMovies(await response.json());
        renderMovies();
    } catch (error) {
        console.error('No se pudo cargar el catálogo de películas:', error);
        statusMessage.textContent = 'No se pudo cargar el catálogo de películas. Inténtalo de nuevo más tarde.';
    }
}

function toggleFavorite(movieId) {
    if (favoriteMovies.has(movieId)) {
        favoriteMovies.delete(movieId);
    } else {
        favoriteMovies.add(movieId);
    }

    saveFavorites(favoriteMovies);
    renderMovies();
}

function handleFavoriteClick(event) {
    const button = event.target.closest('.favorite-button');
    if (!button) {
        return;
    }

    const movie = movies.find((item) => String(item.id) === button.dataset.id);
    if (movie) {
        toggleFavorite(movie.id);
    }
}

function debounce(callback, delay) {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => callback(...args), delay);
    };
}

movieList.addEventListener('click', handleFavoriteClick);
searchInput.addEventListener('input', debounce(renderMovies, SEARCH_DEBOUNCE_MS));
sortSelect.addEventListener('change', renderMovies);
favoritesOnly.addEventListener('change', renderMovies);

loadMovies();
