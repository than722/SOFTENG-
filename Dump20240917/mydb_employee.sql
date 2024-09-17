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
  `id` int NOT NULL AUTO_INCREMENT,
  `lastName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `province` varchar(50) NOT NULL,
  `municipality` varchar(50) NOT NULL,
  `barangay` varchar(50) NOT NULL,
  `zipCode` char(6) NOT NULL,
  `mobileNumber` char(11) NOT NULL,
  `picture` blob NOT NULL,
  `resume` blob NOT NULL,
  `status_id` int DEFAULT NULL,
  `progress_id` int DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_status` (`status_id`),
  KEY `fk_employee_progress` (`progress_id`),
  CONSTRAINT `fk_employee_progress` FOREIGN KEY (`progress_id`) REFERENCES `progress` (`id`),
  CONSTRAINT `fk_status` FOREIGN KEY (`status_id`) REFERENCES `status_lookup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (23,'Doe','Jon','Stewart','1600 Fake Street','Davao City','Talomo','94043','6019521325',_binary '1724857019362.png',_binary '1724857019365.pdf',1,NULL,'',''),(25,'Leibniz','Gottfried','Wilhelm','Erfundene Straße 33','Davao','Talomo','80732','030303986',_binary '1724857670551.jpg',_binary '1724857670554.pdf',NULL,3,'',''),(26,'Ofamin','Christian','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424',_binary '1726492966587.jpg',_binary '1726492966591.pdf',2,NULL,'cdtsmooth@gmail.com','1234'),(27,'Gil','Jon','Arcena','Davao del Sur','Davao City','Talomo','8000','09312332121',_binary '1726494557662.png',_binary '1726494557680.pdf',2,NULL,'gilethan722@gmail.com','123456'),(28,'Gil','George','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',_binary '1726495779425.png',_binary '1726495779432.pdf',2,NULL,'gilethan722@gmail.com','654321'),(29,'Gil','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',_binary '1726495830255.png',_binary '1726495830260.pdf',2,NULL,'eagil@adu.edu.ph','123456');
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

-- Dump completed on 2024-09-17 12:08:41
