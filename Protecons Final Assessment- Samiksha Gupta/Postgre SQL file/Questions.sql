

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER REFERENCES subjects(id),
    question Varchar(300) NOT NULL,
    option1 Varchar(300) NOT NULL,
    option2 varchar(300) NOT NULL,
    option3 Varchar(300) NOT NULL,
    option4 Varchar(300) NOT NULL,
    correct_answer Varchar(300) NOT NULL
);

  
INSERT INTO questions (subject_id, question, option1, option2, option3, option4, correct_answer) VALUES
    (1, 'What is HTML?', 'HTML describes the structure of a webpage', 'HTML is the standard markup language mainly used to create web pages', 'HTML consists of a set of elements that helps the browser how to view the content', 'All of the mentioned', 'All of the mentioned'),
    (1, 'Who is the father of HTML?', 'Rasmus Lerdorf', 'Tim Berners-Lee', ' Brendan Eich', ' Sergey Brin', 'Tim Berners-Lee'),
    (1, 'HTML stands for __________', 'HyperText Markup Language', 'HyperText Machine Language', 'HyperText Marking Language', 'HighText Marking Language', 'HyperText Markup Language'),
    (1, 'What is the correct syntax of doctype in HTML5?', '</doctype html>', '<doctype html>', '<doctype html!>', '<!doctype html>', '<!doctype html>'),
    
    (2, 'What is tag use for adding CSS?', '<css>', '<!DOCTYPE html>', '<script>', '<style>', '<style>'),
    (2, 'Which of the following CSS selectors are used to specify a group of elements?', 'tag', ' id', 'class', 'both class and tag', 'class'),
    (2, 'Which of the following has introduced text, list, box, margin, border, color, and background properties?', 'HTML', 'PHP', 'CSS', 'Ajax', 'CSS'),
    (2, ' Which of the following CSS framework is used to create a responsive design?', 'django', 'rails', 'larawell', 'Bootstrap', 'Bootstrap'),
    
    (3, 'Which type of JavaScript language is ___', 'Object-Oriented', 'Object-Based', 'Assembly-language', 'High-level', 'Object-Based'),
    (3, 'Which one of the following also known as Conditional Expression', 'Alternative to if-else', 'Switch statement', 'If-then-else statement', 'immediate if', 'immediate if'),
    (3, 'The "function" and " var" are known as:', 'Keywords', 'Data types', 'Declaration statements', 'Prototypes', 'Declaration statements'),
    (3, 'When interpreter encounters an empty statements, what it will do:', 'Shows a warning', 'Prompts to complete the statement', 'Throws an error', 'Ignores the statements', 'Ignores the statements')

    select* from questions

    drop table questions 
     