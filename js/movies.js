export function isValidMovie(movie) {
    return (
        movie !== null &&
        typeof movie === 'object' &&
        (typeof movie.id === 'number' || typeof movie.id === 'string') &&
        typeof movie.title === 'string' &&
        movie.title.trim() !== '' &&
        Number.isFinite(movie.year) &&
        typeof movie.genre === 'string' &&
        typeof movie.image === 'string'
    );
}

export function normalizeMovies(data) {
    if (!Array.isArray(data)) {
        throw new TypeError('El catálogo no tiene el formato esperado (se esperaba un array).');
    }

    return data.filter((movie, index) => {
        const valid = isValidMovie(movie);
        if (!valid) {
            console.warn(`Se omitió la película en la posición ${index}: datos incompletos o inválidos.`, movie);
        }
        return valid;
    });
}

export function filterMovies(movies, { search = '', favoritesOnly = false, favorites = new Set() } = {}) {
    const term = search.trim().toLowerCase();

    return movies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(term);
        const matchesFavorites = !favoritesOnly || favorites.has(movie.id);
        return matchesSearch && matchesFavorites;
    });
}

export function sortMovies(movies, sort) {
    const sorted = [...movies];

    switch (sort) {
        case 'title-asc':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'title-desc':
            return sorted.sort((a, b) => b.title.localeCompare(a.title));
        case 'year-asc':
            return sorted.sort((a, b) => a.year - b.year);
        case 'year-desc':
            return sorted.sort((a, b) => b.year - a.year);
        default:
            return sorted;
    }
}

export function getVisibleMovies(movies, options = {}) {
    return sortMovies(filterMovies(movies, options), options.sort);
}
