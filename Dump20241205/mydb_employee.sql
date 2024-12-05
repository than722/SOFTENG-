-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `lastName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `province` varchar(50) NOT NULL,
  `municipality` varchar(50) NOT NULL,
  `barangay` varchar(50) NOT NULL,
  `zipCode` char(6) NOT NULL,
  `mobileNumber` char(11) NOT NULL,
  `civil_status` varchar(20) DEFAULT NULL,
  `picture` blob NOT NULL,
  `resume` blob NOT NULL,
  `validId` blob NOT NULL,
  `birth_certificate` blob NOT NULL,
  `passport` blob,
  `marriage_contract` blob,
  `status_id` int DEFAULT '3',
  `progress_id` int DEFAULT '1',
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthday` date DEFAULT NULL,
  `nbi_clearance` blob,
  `medical_certificate` blob,
  `tesda_certificate` blob,
  PRIMARY KEY (`employee_id`),
  KEY `idx_email` (`email`),
  KEY `idx_firstName` (`firstName`),
  KEY `idx_lastName` (`lastName`),
  KEY `idx_status_id` (`status_id`),
  KEY `fk_employee_progress` (`progress_id`),
  CONSTRAINT `fk_employee_progress` FOREIGN KEY (`progress_id`) REFERENCES `progress` (`id`),
  CONSTRAINT `fk_status` FOREIGN KEY (`status_id`) REFERENCES `status_lookup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (72,'Dela Cruz','Juan','Santos','Davao del Sur','Lucena City','Gulang-Gulang','8002','09171234567',NULL,_binary '1733249861540.png',_binary '1733249861547.pdf',_binary '1733249861531.png',_binary '1733249861548.png',_binary '1733249861552.png',NULL,1,1,'juan.delacruz.tresdemayo8002@gmail.com','$2b$10$xQI.KtgnZuEJdmiMKVl6weE2ApcjoGefwP5nwo53ry2iIKAAQ1prO','2000-01-01',NULL,NULL,NULL),(73,'Kent','Clark','John','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1733257755814.png',_binary '1733257755817.pdf',_binary '1733257755813.png',_binary '1733257755821.jpg',_binary '1733257755834.png',NULL,1,1,'testemployee@gmail.com','$2b$10$SFZ8vPV8GMGgBLzKPGHgSO8/7xPNLyM0Aip2fQtC6pxPtTTgv75TW','2000-11-11',NULL,NULL,NULL);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-05 21:43:13
