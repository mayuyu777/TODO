-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 21, 2020 at 02:52 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pastebin`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL,
  `deleted` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `uuid`, `username`, `password`, `created`, `updated`, `deleted`) VALUES
(1, 'IMJGTz3s2QkfdV5kjHgtYPx7fkAys0og', 'Amber', '$2b$10$LqvePQfbKdPbYLyCDO.FOeFhzjclFFtWccWz3vPhnVMaVu6losGmW', '2020-10-19 00:00:00', NULL, NULL),
(2, '7Jq5yIlSl6EsusczBnkzUxNiKmWa2NeC', 'Maber', '$2b$10$GDwPDuhT5EJ1McBcSHrN.uIdWxrses7xWwn3prwVlzBj/Z5g85OLW', '2020-10-21 00:00:00', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `textfiles`
--

CREATE TABLE `textfiles` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `account_uuid` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `isPinned` int(11) NOT NULL DEFAULT 0,
  `created` datetime NOT NULL,
  `updated` datetime DEFAULT NULL,
  `deleted` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `textfiles`
--

INSERT INTO `textfiles` (`id`, `uuid`, `account_uuid`, `title`, `content`, `status`, `isPinned`, `created`, `updated`, `deleted`) VALUES
(1, 'saymKbi18AS7LLbuHRi7tYH73uD9gBXx', 'IMJGTz3s2QkfdV5kjHgtYPx7fkAys0og', 'MY FIRST NOTE!', 'This is my first note.', 'OPEN', 0, '2020-10-21 20:30:51', NULL, NULL),
(2, '6pJjCaYdg9OUrbHFqSPSX2dSfF3egwWO', 'IMJGTz3s2QkfdV5kjHgtYPx7fkAys0og', 'STICKY NOTE', 'This note is pinned to the top of the list', 'OPEN', 1, '2020-10-21 20:31:08', NULL, NULL),
(3, 'DIdpS8OvpP7yJUIYLni8097CDuK9703C', 'IMJGTz3s2QkfdV5kjHgtYPx7fkAys0og', 'DUMMY NOTE', 'This note will be deleted', 'DELETED', 0, '2020-10-21 20:31:26', NULL, '2020-10-21 20:31:28'),
(4, 'X2uuAjwxMMKv1JjF2aojDMjOGXq3dNSB', 'IMJGTz3s2QkfdV5kjHgtYPx7fkAys0og', 'NOTE #2- Updated!', 'This is another note! And its updated!', 'OPEN', 0, '2020-10-21 20:31:40', '2020-10-21 20:34:16', NULL),
(5, 'h0Yrv51bkbezAx4NKTvhIl3fxMctjs1G', 'IMJGTz3s2QkfdV5kjHgtYPx7fkAys0og', 'SECRET NOTE', 'Archive me!', 'OPEN', 0, '2020-10-21 20:31:56', NULL, NULL),
(6, 'fwc6uDHoqKKidxRUhNZAjocMJ1qiYDWW', 'IMJGTz3s2QkfdV5kjHgtYPx7fkAys0og', 'VOTE WISELY', 'Upvote me!', 'OPEN', 0, '2020-10-21 20:32:51', NULL, NULL),
(7, 'CcmfFe5mqjXrfwQfT65j8ZAE2uO7OPjy', 'IMJGTz3s2QkfdV5kjHgtYPx7fkAys0og', 'HIDDEN NOTE', 'This note is archived. Try restoring it!', 'ARCHIVED', 0, '2020-10-21 20:34:57', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `textfile_uuid` varchar(255) NOT NULL,
  `vote_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `account_id`, `textfile_uuid`, `vote_type`) VALUES
(1, 1, 'fwc6uDHoqKKidxRUhNZAjocMJ1qiYDWW', 'upvote'),
(2, 2, 'fwc6uDHoqKKidxRUhNZAjocMJ1qiYDWW', 'upvote'),
(3, 1, 'h0Yrv51bkbezAx4NKTvhIl3fxMctjs1G', 'downvote'),
(4, 1, 'CcmfFe5mqjXrfwQfT65j8ZAE2uO7OPjy', 'upvote');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `textfiles`
--
ALTER TABLE `textfiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_uuid_fk` (`account_uuid`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id_fk` (`account_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `textfiles`
--
ALTER TABLE `textfiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `textfiles`
--
ALTER TABLE `textfiles`
  ADD CONSTRAINT `account_uuid_fk` FOREIGN KEY (`account_uuid`) REFERENCES `accounts` (`uuid`);

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `account_id_fk` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
