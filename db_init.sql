CREATE TABLE companies (
    id   INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE positions (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  company_id INTEGER NOT NULL,
  name VARCHAR(50) NOT NULL,
  position_type ENUM("Full-Time", "Part-Time", "Contractor", "Internship") NOT NULL,
  year YEAR NOT NULL,
  active BOOLEAN NOT NULL,
  link VARCHAR(1000),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

INSERT INTO companies (name) VALUES
  ('Apple'),
  ('Amazon'),
  ('Tiktok'),
  ('Bloomberg'),
  ('Oracle'),
  ('Deloitte'),
  ('Uber'),
  ('Meta');

INSERT INTO posts (company_id, name, position_type, year, active, link)
VALUES
    (1, "Software Engineer, Recent Grad", "Full-Time", 2022, true, ""),
    (2, "Software Development Engineer", "Full-Time", 2022, true, ""),
    (4, "New Software Engineer", "Part-Time", 2022, true, ""),

    (8, "Software Engineer, Recent Grad", "Full-Time", 2021, false, ""),,

    (5, "Software Engineer Intern", "Internship", 2022, true, ""),
    (6, "Software Engineer", "Contractor", 2022, true, "");