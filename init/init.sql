DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS projects;

CREATE TABLE users (
    id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    username    VARCHAR(255) UNIQUE NOT NULL,
    pwd         BYTEA NOT NULL
);

CREATE TABLE projects (
    id          SERIAL PRIMARY KEY,
    user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(255) NOT NULL,
    description VARCHAR(100) NOT NULL
);