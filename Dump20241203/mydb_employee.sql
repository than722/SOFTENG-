-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.35

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
  `progress_id` int DEFAULT '3',
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthday` date DEFAULT NULL,
  `nbi_clearance` blob,
  PRIMARY KEY (`employee_id`),
  KEY `idx_email` (`email`),
  KEY `idx_firstName` (`firstName`),
  KEY `idx_lastName` (`lastName`),
  KEY `idx_status_id` (`status_id`),
  KEY `fk_employee_progress` (`progress_id`),
  CONSTRAINT `fk_employee_progress` FOREIGN KEY (`progress_id`) REFERENCES `progress` (`id`),
  CONSTRAINT `fk_status` FOREIGN KEY (`status_id`) REFERENCES `status_lookup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (73,'Dela Cruz','Juan','Santos','Davao del Sur','Digos City','Tres de Mayo','8002','09171234567',NULL,_binary '1733167336651.png',_binary '1733167336654.pdf',_binary '1733167336645.png',_binary '1733167336655.png',_binary '1733167336659.png',NULL,4,1,'juan.delacruz.tresdemayo8002@gmail.com','$2b$10$bUJuCQQcpldlNAZ6mjE/jeadDNkVfHIw6LxAF4jctFUCEO4ZwKNgW','2000-01-01',NULL),(74,'Garcia','Maria','Lourdes','Cebu','Lapu-Lapu City','Pusok','6015','09281234567',NULL,_binary '1733167477148.png',_binary '1733167477153.pdf',_binary '1733167477144.png',_binary '1733167477153.png',_binary '1733167477156.png',NULL,1,1,'maria.lourdes.garcia.pusok6015@yahoo.com','$2b$10$WnSWFWYRK/FG46zSZrTZ0ewm5DrK5leH6hwS5XkFkW0Y.UZhHerUK','2000-02-02',NULL),(75,'Reyes','Mark','Angelo','Laguna','Calamba City','Halang','4027','09391234567',NULL,_binary '1733167570279.png',_binary '1733167570284.pdf',_binary '1733167570273.png',_binary '1733167570284.png',_binary '1733167570287.png',NULL,3,3,'mark.reyes.halang4027@outlook.com','$2b$10$bJoaJCX3wWz3dRlMtKdQou2YNBFTFWDlqOA82heGTyCBLtx6X.Xe.','2000-03-03',NULL);
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

-- Dump completed on 2024-12-03  4:49:15
