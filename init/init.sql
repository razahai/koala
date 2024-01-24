DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id          uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    username    VARCHAR(255) UNIQUE NOT NULL,
    pwd         BYTEA NOT NULL,
    projects    TEXT[] DEFAULT ARRAY[]::TEXT[]
);