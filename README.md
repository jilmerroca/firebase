# API Rest para Petfinder, buscador de mascotas perdidas

## Colección de mascotas

`/api/v1/animals`

Filtros
- specie
- status
- gender
- areaLastSeen
- dateStart
- dateEnd
- reward
- user

Paginación
- Límite: `limit = n`
- Último documento: `lastDoc`

### Endpoint listar todos

```bash
GET /api/v1/animals
```

### Endpoint para obtener por id

```bash
GET /api/v1/animals/:id
```

### Endpoint para ectualizar

```bash
PUT /api/v1/animals/:id
```

### Endpoint para eliminar

```bash
DELETE /api/v1/animals/:id
```


## Colección de especies

`/api/v1/species`

Paginación
- Límite: `limit = n`
- Último documento: `lastDoc`

### Endpoint listar todos

```bash
GET /api/v1/animals
```

### Endpoint para obtener por id

```bash
GET /api/v1/species/:id
```

### Endpoint para ectualizar

```bash
PUT /api/v1/species/:id
```

### Endpoint para eliminar

```bash
DELETE /api/v1/species/:id
```


## Colección de guardados a favoritos

`/api/v1/saved`

Filtros
- user

Paginación
- Límite: `limit = n`
- Último documento: `lastDoc`

### Endpoint listar todos

```bash
GET /api/v1/saved
```

### Endpoint para obtener por id

```bash
GET /api/v1/saved/:id
```

### Endpoint para ectualizar

```bash
PUT /api/v1/saved/:id
```

### Endpoint para eliminar

```bash
DELETE /api/v1/saved/:id
```


## Colección de usuarios

`/api/v1/users`

Filtros
- provider

Paginación
- Límite: `limit = n`
- Último documento: `lastDoc`

### Endpoint listar todos

```bash
GET /api/v1/users
```

### Endpoint para obtener por id

```bash
GET /api/v1/users/:id
```

### Endpoint para ectualizar

```bash
PUT /api/v1/users/:id
```

### Endpoint para eliminar

```bash
DELETE /api/v1/users/:id
```
