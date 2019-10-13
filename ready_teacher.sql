-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 13, 2019 at 01:34 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ready_teacher`
--

-- --------------------------------------------------------

--
-- Table structure for table `qualification`
--

DROP TABLE IF EXISTS `qualification`;
CREATE TABLE IF NOT EXISTS `qualification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qualification`
--

INSERT INTO `qualification` (`id`, `name`) VALUES
(1, 'Diplom'),
(2, 'Post-Diploma'),
(3, 'HR');

-- --------------------------------------------------------

--
-- Table structure for table `specialization`
--

DROP TABLE IF EXISTS `specialization`;
CREATE TABLE IF NOT EXISTS `specialization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qualification_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `specialization`
--

INSERT INTO `specialization` (`id`, `qualification_id`, `name`) VALUES
(1, 1, 'Applied Linguistics'),
(2, 1, 'Information Technology'),
(3, 1, 'Applied Physcis');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_details`
--

DROP TABLE IF EXISTS `teacher_details`;
CREATE TABLE IF NOT EXISTS `teacher_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(30) NOT NULL,
  `mobile` varchar(30) NOT NULL,
  `city` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_details`
--

INSERT INTO `teacher_details` (`id`, `user_id`, `first_name`, `last_name`, `dob`, `email`, `mobile`, `city`) VALUES
(1, 1, 'Upal', 'Roy', '1992-09-23', 'upal.roy@gmail.com', '0989889889', 'Melbourne'),
(2, 1, 'Upal', 'Roy', '1992-09-23', 'upal.roy@gmail.com', '0989889889', 'Melbourne');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_qualification`
--

DROP TABLE IF EXISTS `teacher_qualification`;
CREATE TABLE IF NOT EXISTS `teacher_qualification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_details_id` int(11) NOT NULL,
  `experience_year` int(11) NOT NULL,
  `experience_month` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_qualification`
--

INSERT INTO `teacher_qualification` (`id`, `teacher_details_id`, `experience_year`, `experience_month`) VALUES
(1, 1, 3, 5),
(2, 1, 3, 5),
(3, 1, 3, 5),
(4, 1, 3, 5);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_qualification_specialization`
--

DROP TABLE IF EXISTS `teacher_qualification_specialization`;
CREATE TABLE IF NOT EXISTS `teacher_qualification_specialization` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_qualification_id` int(11) NOT NULL,
  `qulification_id` int(11) NOT NULL,
  `specialization_id` int(11) NOT NULL,
  `major` varchar(255) NOT NULL,
  `minor` varchar(255) DEFAULT NULL,
  `course_completion_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_qualification_specialization`
--

INSERT INTO `teacher_qualification_specialization` (`id`, `teacher_qualification_id`, `qulification_id`, `specialization_id`, `major`, `minor`, `course_completion_date`) VALUES
(1, 1, 1, 1, 'Tesol', '', '2001-09-23'),
(2, 1, 1, 1, 'Tesol', '', '2000-05-22'),
(3, 2, 1, 1, 'Tesol', '', '2001-09-23'),
(4, 2, 1, 1, 'Tesol', '', '2000-05-22'),
(5, 3, 1, 1, 'Tesol', '', '2001-09-23'),
(6, 3, 1, 1, 'Tesol', '', '2000-05-22'),
(7, 4, 1, 1, 'Tesol', '', '2001-09-23'),
(8, 4, 1, 1, 'Tesol', '', '2000-05-22');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_qualification_unit`
--

DROP TABLE IF EXISTS `teacher_qualification_unit`;
CREATE TABLE IF NOT EXISTS `teacher_qualification_unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_qualification_specialization_id` int(11) NOT NULL,
  `unit` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_qualification_unit`
--

INSERT INTO `teacher_qualification_unit` (`id`, `teacher_qualification_specialization_id`, `unit`) VALUES
(1, 5, 'Structure of Language'),
(2, 5, 'Concepts in Applied Linguistics'),
(3, 6, 'Research Methods'),
(4, 6, 'Teaching Languages in a Global Context'),
(5, 7, 'Structure of Language'),
(6, 7, 'Concepts in Applied Linguistics'),
(7, 8, 'Research Methods'),
(8, 8, 'Teaching Languages in a Global Context');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
