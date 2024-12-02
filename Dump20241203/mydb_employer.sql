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
-- Table structure for table `employer`
--

DROP TABLE IF EXISTS `employer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employer` (
  `employer_id` int NOT NULL AUTO_INCREMENT,
  `lastName` varchar(50) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) DEFAULT NULL,
  `province` varchar(50) NOT NULL,
  `municipality` varchar(50) NOT NULL,
  `barangay` varchar(50) NOT NULL,
  `zipCode` char(6) NOT NULL,
  `mobileNumber` char(11) NOT NULL,
  `companyName` varchar(100) DEFAULT NULL,
  `status_id` int DEFAULT '3',
  `progress_id` int DEFAULT '3',
  `validId` blob NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `birthday` date DEFAULT NULL,
  PRIMARY KEY (`employer_id`),
  KEY `fk_employer_progress` (`progress_id`),
  KEY `fk_status_employer` (`status_id`),
  CONSTRAINT `fk_employer_progress` FOREIGN KEY (`progress_id`) REFERENCES `progress` (`id`),
  CONSTRAINT `fk_status_employer` FOREIGN KEY (`status_id`) REFERENCES `status_lookup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employer`
--

LOCK TABLES `employer` WRITE;
/*!40000 ALTER TABLE `employer` DISABLE KEYS */;
INSERT INTO `employer` VALUES (29,'Bautista','Anna','Isabel','Batangas','Lipa City','Balintawak','4217','09451234567','Bautista INC',3,3,_binary '1733167661990.png','anna.bautista.balintawak4217@gmail.com','$2b$10$QYNAScwnPXtbdwlMNRYrlOhoGt4GbFlXFCrKZ9RsX2jIIZCNPbBHu','2000-04-04'),(30,'Mendoza','Carlo','Jose','Iloilo','Iloilo City','Jaro','5000','09561234567','Mendoza Coop',3,3,_binary '1733167729040.png','carlo.mendoza.jaro5000@yahoo.com','$2b$10$X1xVbWxQMmyir/w2SCDeV.J0wHHK8l6Pjq.ExjoAldTugL9R48eiK','2000-05-05'),(31,'Santos','Karen','Mae','Pampanga','Angeles City','Pulungbulu','2009','09671234567','Santos INC',3,3,_binary '1733167794837.png','karen.santos.pulungbulu2009@outlook.com','$2b$10$nUC4Sy3oSnR4jaIFgSwaceSbbOUqOh3/A5QIGcfnJtYueg/HyilFG','2000-06-06');
/*!40000 ALTER TABLE `employer` ENABLE KEYS */;
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
