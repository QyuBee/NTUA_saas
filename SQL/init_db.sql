CREATE DATABASE IF NOT EXISTS ntua_saas;

USE ntua_saas;

CREATE TABLE users (
  email VARCHAR(255) NOT NULL PRIMARY KEY,
  credits INT(11) NOT NULL,
  lastConnection VARCHAR(255) NOT NULL
);

CREATE TABLE charts (
    id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255),
    type VARCHAR(255),
    name VARCHAR(255),
    created DATETIME,
    path_html VARCHAR(255),
    path_pdf VARCHAR(255),
    path_png VARCHAR(255),
    path_svg VARCHAR(255),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`email`)
);


GRANT ALL ON ntua_saas.* TO 'saas_app'@'%';