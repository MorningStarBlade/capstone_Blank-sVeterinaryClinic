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