DROP TABLE appointments;

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY, 
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  animal TEXT NOT NULL,
  breed TEXT NOT NULL,
  reason TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT NOT NULL
);

DROP TABLE users;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

DROP TABLE employee;

CREATE TABLE IF NOT EXISTS employee (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  password TEXT NOT NULL
);