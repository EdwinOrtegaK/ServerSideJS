CREATE USER IF NOT EXISTS 'andyortegak'@'%' IDENTIFIED BY 'kou12345';
GRANT ALL PRIVILEGES ON blog_db.* TO 'blog_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    pokemon_name VARCHAR(255),
    tipo_pokemon VARCHAR(255),
    grupo VARCHAR(255),
    cualidad VARCHAR(255),
    region VARCHAR(255),
    descripción VARCHAR(255)
);