CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL
);


INSERT INTO subjects (subject_name) VALUES 
    ('HTML'),
    ('CSS'),
    ('JavaScript');
    
