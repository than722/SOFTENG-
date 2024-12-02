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
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `applications_id` int NOT NULL AUTO_INCREMENT,
  `job_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `apply_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `firstName` varchar(45) DEFAULT NULL,
  `status_id` int DEFAULT '3',
  `employer_id` int DEFAULT NULL,
  PRIMARY KEY (`applications_id`),
  KEY `job_id` (`job_id`),
  KEY `employee_id` (`employee_id`),
  KEY `applications_ibfk_3_idx` (`email`),
  KEY `applications_ibfk_4_idx` (`lastName`),
  KEY `applications_ibfk_5_idx` (`firstName`),
  KEY `applications_ibfk_7_idx` (`employer_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`job_id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_3` FOREIGN KEY (`email`) REFERENCES `employee` (`email`),
  CONSTRAINT `applications_ibfk_4` FOREIGN KEY (`lastName`) REFERENCES `employee` (`lastName`),
  CONSTRAINT `applications_ibfk_5` FOREIGN KEY (`firstName`) REFERENCES `employee` (`firstName`),
  CONSTRAINT `applications_ibfk_7` FOREIGN KEY (`employer_id`) REFERENCES `job_postings` (`employer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (17,9,73,'2024-12-02 11:38:31','juan.delacruz.tresdemayo8002@gmail.com','Dela Cruz','Juan',4,29);
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
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
