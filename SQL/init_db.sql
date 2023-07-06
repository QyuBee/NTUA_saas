CREATE DATABASE IF NOT EXISTS ntua_saas;

USE ntua_saas;

CREATE TABLE `users` (
  `email` text NOT NULL UNIQUE,
  `credits` int(11) NOT NULL,
  `lastConnection` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

GRANT ALL ON ntua_saas.* TO 'saas_app'@'%';