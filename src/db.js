import conn from './conn.js'

// Obtener post
export async function getAllPosts() {
  const [rows] = await conn.query('SELECT * FROM blog_posts')
  return rows
}

// Crear un nuevo post
export async function createPost(
  title,
  content,
  pokemonName,
  tipoPokemon,
  grupo,
  cualidad,
  region,
  descripcion,
) {
  const [result] = await conn.query(
    `INSERT INTO blog_posts 
    (title, content, pokemon_name, tipo_pokemon, grupo, cualidad, region, descripcion) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, content, pokemonName, tipoPokemon, grupo, cualidad, region, descripcion],
  )
  return result
}

// Borrar un post
export async function deletePost(id) {
  const [result] = await conn.query('DELETE FROM blog_posts WHERE id = ?', [id])
  return result
}

// Ver post individual
export async function getPostById(id) {
  const [rows] = await conn.query('SELECT * FROM blog_posts WHERE id = ?', [id])
  if (rows.length > 0) {
    return rows[0]
  }
  return null
}

// Actualizar post
export async function updatePost(
  id,
  title,
  content,
  pokemonName,
  tipoPokemon,
  grupo,
  cualidad,
  region,
  descripcion,
) {
  const [result] = await conn.query(
    `UPDATE blog_posts
    SET title = ?,
        content = ?,
        pokemon_name = ?,
        tipo_pokemon = ?,
        grupo = ?,
        cualidad = ?,
        region = ?,
        descripcion = ?
    WHERE id = ?`,
    [title, content, pokemonName, tipoPokemon, grupo, cualidad, region, descripcion, id],
  )
  return result
}

// Verificar usuario
export async function verifyUser(username, password) {
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  const [rows] = await conn.query(query, [username, password]);
  return rows.length > 0 ? rows[0] : null;
}