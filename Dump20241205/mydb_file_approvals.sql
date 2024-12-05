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
-- Table structure for table `file_approvals`
--

DROP TABLE IF EXISTS `file_approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_approvals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `resume_is_approved` tinyint NOT NULL DEFAULT '0',
  `resume_approval_date` timestamp NULL DEFAULT NULL,
  `validID_is_approved` tinyint NOT NULL DEFAULT '0',
  `validID_approval_date` timestamp NULL DEFAULT NULL,
  `birthCertificate_is_approved` tinyint NOT NULL DEFAULT '0',
  `birthCertificate_approval_date` timestamp NULL DEFAULT NULL,
  `passport_is_approved` tinyint NOT NULL DEFAULT '0',
  `passport_approval_date` timestamp NULL DEFAULT NULL,
  `file_type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_employee_file` (`employee_id`,`file_type`),
  UNIQUE KEY `unique_employee_id` (`employee_id`),
  CONSTRAINT `file_approvals_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_approvals`
--

LOCK TABLES `file_approvals` WRITE;
/*!40000 ALTER TABLE `file_approvals` DISABLE KEYS */;
INSERT INTO `file_approvals` VALUES (9,72,1,'2024-12-05 13:25:29',1,'2024-12-05 13:25:31',1,'2024-12-05 13:25:33',1,'2024-12-05 13:25:35','resume'),(21,73,1,'2024-12-05 11:49:23',1,'2024-12-05 11:49:25',1,'2024-12-05 11:49:26',1,'2024-12-05 11:49:29','resume');
/*!40000 ALTER TABLE `file_approvals` ENABLE KEYS */;
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
