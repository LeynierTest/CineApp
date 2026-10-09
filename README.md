# CineApp

Catálogo de películas con búsqueda, ordenamiento y favoritos.

## Cómo arrancar

Las películas se cargan con `fetch` desde `data/movies.json`, así que hay que
servir el proyecto con un servidor local. Si abres `index.html` haciendo doble
clic, el catálogo no carga.

Con Node instalado:

```
npm install
npm start
```

Luego abre http://localhost:5173

Si prefieres no usar npm, cualquier servidor estático sirve, por ejemplo:

```
python3 -m http.server 5173
```
