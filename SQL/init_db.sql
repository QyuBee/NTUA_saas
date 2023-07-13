CREATE DATABASE IF NOT EXISTS ntua_saas;

USE ntua_saas;

CREATE TABLE users (
  email VARCHAR(255) NOT NULL PRIMARY KEY,
  credits INT(11) NOT NULL,
  lastConnection VARCHAR(255) NOT NULL
);

CREATE TABLE `charts` (
  `id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created` varchar(255) DEFAULT NULL,
  `path_html` varchar(255) DEFAULT NULL,
  `path_pdf` varchar(255) DEFAULT NULL,
  `path_png` varchar(255) DEFAULT NULL,
  `path_svg` varchar(255) DEFAULT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`email`)
);

GRANT ALL ON ntua_saas.* TO 'saas_app'@'%';