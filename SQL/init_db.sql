CREATE TABLE `users` (
  `email` text NOT NULL UNIQUE,
  `credits` int(11) NOT NULL,
  `lastConnection` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
