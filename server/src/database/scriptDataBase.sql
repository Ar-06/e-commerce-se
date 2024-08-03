CREATE DATABASE my_store;
use my_store;

CREATE TABLE users (
	id INT auto_increment primary key,
    username varchar(100),
    email varchar(50),
    password varchar(100)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    image VARCHAR(255) NOT NULL
);  