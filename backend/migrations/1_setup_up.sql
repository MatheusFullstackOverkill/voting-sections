CREATE TABLE IF NOT EXISTS "user" (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topic (
    topic_id SERIAL PRIMARY KEY,
    creator_id INT,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    session_started_at TIMESTAMP,
    duration_minutes INT
);

CREATE TABLE IF NOT EXISTS vote (
    vote_id SERIAL PRIMARY KEY,
    user_id INT,
    topic_id INT,
    approved BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW()
);