-- Create the blogs table 
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

-- Insert new blogs into the blogs table
INSERT INTO blogs (author, url, title) 
VALUES ('Richard Couzens', 'https://github.com/arecouz', 'My Github');

INSERT INTO blogs (author, url, title) 
VALUES ('Richard Couzens', 'https://letterboxd.com/couzens/', 'My Movies');

-- View the updated table
SELECT * FROM blogs;
