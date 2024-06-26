import express from "express";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import {
  createUser,
  verifyUser,
  getAllPosts,
  createPost,
  getPostById,
  deletePost,
  updatePost,
} from "./db.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import { hashear, comparar } from "./Utils/authHelpers.js";

const app = express();
const JWT_SECRET = "patsnation";

app.use(express.json());
app.use(cors());

//Middleware de verificación
const verifyToken = (req, res, next) => {
  const openPaths = ['/login', '/user', '/posts'];

  if (req.path === '/posts' && req.method === 'GET') {
    return next();
  }
  
  if (openPaths.includes(req.path)) {
    next();
  } else {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer Token

    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token inválido' });
      }
      next();
    });
  }
};

app.use(verifyToken);

// Carga documentación de la API
const swaggerDocument = YAML.load("./APIdocs/swagger.yaml");

// Levantar el server utilizando Swagger UI
app.use("/APIdocs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Autenticación de usuarios
app.get("/login", async (req, res) => {
  const { username, password } = req.headers;

  try {
    const usuario = await verifyUser(username);
    if (usuario && usuario.length > 0) {
      const contrasenaValida = await comparar(password, usuario[0].password);
      if (contrasenaValida) {
        const token = jwt.sign(
          { id: usuario[0].id, username: usuario[0].username },
          JWT_SECRET,
          { expiresIn: "30m" }
        );
        return res.status(200).json({ mensaje: "Bienvenido", token });
      } else {
        return res.status(401).json({ mensaje: "La contraseña es incorrecta" });
      }
    } else {
      return res.status(404).json({ mensaje: "El usuario no existe" });
    }
  } catch (error) {
    console.error("Error al autenticar el usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
});

//Creación de usuario
app.post("/user", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json("Se necesita tener los campos llenos");
  }

  const usuarioExistente = await verifyUser(username);

  if (usuarioExistente.length > 0) {
    return res.status(501).json({ mensaje: "El usuario ya existe" });
  }

  const contraHasheada = hashear(password);

  try {
    await createUser(username, contraHasheada);
    return res.status(200).json({ mensaje: "Se registro correctamente" });
  } catch (error) {
    console.log(error);
  }
});

// Obtener todos los posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await getAllPosts();
    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred");
  }
});

// Crear un nuevo post
app.post("/posts", async (req, res) => {
  const {
    title,
    content,
    pokemonName,
    tipoPokemon,
    grupo,
    cualidad,
    region,
    descripcion,
  } = req.body;

  if (
    !title ||
    !content ||
    !pokemonName ||
    !tipoPokemon ||
    !grupo ||
    !cualidad ||
    !region ||
    !descripcion
  ) {
    return res.status(400).send("Missing required fields or incorrect format");
  }

  try {
    const result = await createPost(
      title,
      content,
      pokemonName,
      tipoPokemon,
      grupo,
      cualidad,
      region,
      descripcion
    );
    return res.status(200).json({
      message: "Post created successfully",
      postId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred");
  }
});

// Obtener un post por ID
app.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await getPostById(postId);
    if (post) {
      return res.status(200).json(post);
    }
    return res.status(404).send("Post not found");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred");
  }
});

// Actualizar un post por ID
app.put("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const {
    title,
    content,
    pokemonName,
    tipoPokemon,
    grupo,
    cualidad,
    region,
    descripcion,
  } = req.body;

  if (
    !title ||
    !content ||
    !pokemonName ||
    !tipoPokemon ||
    !grupo ||
    !cualidad ||
    !region ||
    !descripcion
  ) {
    return res.status(400).send("Missing required fields or incorrect format");
  }

  try {
    const result = await updatePost(
      postId,
      title,
      content,
      pokemonName,
      tipoPokemon,
      grupo,
      cualidad,
      region,
      descripcion
    );
    if (result.affectedRows > 0) {
      return res.status(200).json({
        message: "Post updated successfully",
      });
    }
    return res.status(404).send("Post not found");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred");
  }
});

// Borrar un post por ID
app.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await deletePost(postId);
    if (result.affectedRows > 0) {
      return res.status(204).send();
    }
    return res.status(404).send("Post not found");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred");
  }
});

const logRequest = (req, res, next) => {
  const { method, path: routePath, body } = req;
  const logMessage = `${new Date().toISOString()} - 
  ${method} ${routePath} - Request Body: ${JSON.stringify(body)}\n`;
  fs.appendFile("log.txt", logMessage, (err) => {
    if (err) console.error("Error writing to log file", err);
  });

  // Intercepta la función original res.json para poder registrar la respuesta
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    const logResponse = `${new Date().toISOString()} - ${method} ${routePath} - Response Body: ${JSON.stringify(
      data
    )}\n`;
    fs.appendFile("log.txt", logResponse, (err) => {
      if (err) console.error("Error writing to log file", err);
    });
    return originalJson(data);
  };

  next();
};
app.use(logRequest);

// Middleware para métodos HTTP no implementados
app.use((req, res) => {
  res.status(501).json({ message: "Método HTTP no implementado" });
});

// Middleware para manejar los errores 404 Not Found
app.use((req, res) => {
  res.status(404).send("The resource you are looking for could not be found");
});

// Middleware para manejar errores
app.use((error, req, res) => {
  const status = error.status || 500;
  console.error(error);
  res.status(status).send(error.message || "An unexpected error occurred");
});

const port = 22305;

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`);
});
