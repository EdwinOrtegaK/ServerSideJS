import bcrypt from 'bcrypt';
import conn from './conn.js'

// Constante para la cantidad de salt rounds
const saltRounds = 10;

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

// Crear un nuevo usuario
export async function createUser(username, password) {
  const hash = await bcrypt.hash(password, saltRounds);
  const [result] = await conn.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hash]
  );
  return result.insertId;
}

// Verificar usuario
export async function verifyUser(username, password) {
  const [rows] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
  return null;
}