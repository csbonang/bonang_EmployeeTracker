DROP DATABASE IF EXISTS employee_managementDB;

CREATE DATABASE employee_managementDB;

USE employee_managementDB;

CREATE TABLE department (
    -- don't need to add in values bc it auto increments 
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL, 
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Administration");

INSERT INTO department (name)
VALUES ("Instruction");

INSERT INTO department (name)
VALUES ("Cafeteria");




-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);
