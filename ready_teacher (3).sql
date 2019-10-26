-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 26, 2019 at 07:42 AM
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
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `qualification`
--

INSERT INTO `qualification` (`id`, `name`) VALUES
(1, 'Diplom'),
(2, 'Post-Diploma'),
(3, 'HR'),
(5, 'HR');

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_details`
--

INSERT INTO `teacher_details` (`id`, `user_id`, `first_name`, `last_name`, `dob`, `email`, `mobile`, `city`) VALUES
(1, 1, 'Upal', 'Roy', '1992-09-23', 'upal.roy@gmail.com', '0989889889', 'Melbourne'),
(2, 2, 'Upal', 'Roy', '1992-09-23', 'upal.roy@gmail.com', '0989889889', 'Melbourne');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_qualification`
--

DROP TABLE IF EXISTS `teacher_qualification`;
CREATE TABLE IF NOT EXISTS `teacher_qualification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_details_id` int(11) NOT NULL,
  `techer_qualification_cv_id` int(11) NOT NULL,
  `experience_year` int(11) NOT NULL,
  `experience_month` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_qualification`
--

INSERT INTO `teacher_qualification` (`id`, `teacher_details_id`, `techer_qualification_cv_id`, `experience_year`, `experience_month`) VALUES
(1, 1, 4, 3, 5),
(2, 1, 0, 3, 5),
(3, 1, 0, 3, 5),
(4, 1, 0, 3, 5),
(5, 1, 0, 3, 5),
(6, 1, 0, 3, 5),
(7, 1, 0, 3, 5),
(8, 1, 0, 3, 5),
(9, 1, 0, 3, 5),
(10, 1, 0, 3, 5);

-- --------------------------------------------------------

--
-- Table structure for table `teacher_qualification_cv`
--

DROP TABLE IF EXISTS `teacher_qualification_cv`;
CREATE TABLE IF NOT EXISTS `teacher_qualification_cv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teacher_qualification_cv`
--

INSERT INTO `teacher_qualification_cv` (`id`, `file_name`, `file_path`) VALUES
(4, 'teacherCV.pdf', 'uploads\\1572049499930teacherCV.pdf'),
(3, 'teacherCV.pdf', 'uploads\\1572048937289teacherCV.pdf');

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
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

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
(8, 4, 1, 1, 'Tesol', '', '2000-05-22'),
(9, 5, 1, 1, 'Tesol', '', '2001-09-23'),
(10, 5, 1, 1, 'Tesol', '', '2000-05-22'),
(11, 10, 1, 1, 'Tesol', NULL, '2001-09-23');

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
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

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
(8, 8, 'Teaching Languages in a Global Context'),
(9, 9, 'Structure of Language'),
(10, 9, 'Concepts in Applied Linguistics'),
(11, 10, 'Research Methods'),
(12, 10, 'Teaching Languages in a Global Context'),
(13, 11, 'Structure of Language'),
(14, 11, 'Concepts in Applied Linguistics');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`) VALUES
(1, 'upal@gmail.com', 'hello'),
(2, 'asif@gmail.com', 'hello'),
(4, 'test@gmail.com', 'test'),
(5, 'upal2@gmail.com', 'hello'),
(6, 'upal23@gmail.com', 'hello'),
(7, 'upal24@gmail.com', 'hello'),
(8, 'upal27@gmail.com', '$2b$10$L4C8XU0rCXvplgbMK2n60eNly6t4LJ9CXJqv4IG3FZKBCchdYa8au'),
(9, 'upal27@gmail.com', 'hello');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
