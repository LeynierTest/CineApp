export const FAVORITES_STORAGE_KEY = 'cineapp-favorites';

export function loadFavorites(storage = globalThis.localStorage) {
    try {
        const stored = JSON.parse(storage.getItem(FAVORITES_STORAGE_KEY) || '[]');
        return new Set(Array.isArray(stored) ? stored : []);
    } catch (error) {
        console.error('No se pudieron leer las favoritas guardadas; se iniciará sin favoritas.', error);
        return new Set();
    }
}

export function saveFavorites(favorites, storage = globalThis.localStorage) {
    try {
        storage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]));
        return true;
    } catch (error) {
        console.error('No se pudieron guardar las favoritas.', error);
        return false;
    }
}
