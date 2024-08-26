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
  PRIMARY KEY (`id`),
  KEY `fk_status` (`status_id`),
  CONSTRAINT `fk_status` FOREIGN KEY (`status_id`) REFERENCES `status_lookup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Gil','Ethan','Arcena','Davao Del Sur','Davao','Talomo','8000','09123312323','','',NULL),(2,'','','','Davao del Sur','Davao City','Talomo','','','','',NULL),(3,'Gil','Ethan','Arcena','Davao Del Sur','Davao','Talomo','8000','09123312323','','',NULL),(4,'Gil','Ethan','Arcena','Davao Del Sur','Davao','Talomo','8000','09123312323','','',NULL),(5,'Gil','Ethan','Arcena','Davao Del Sur','Davao','Talomo','8000','09123312323','','',NULL),(6,'Ofamin','Christ','Man','Davao Del ','Davao','Talomo','8000','09213541213','','',NULL),(7,'Gil','Christ','ASdasd','Davao del Sur','Davao City','Talomo','8000','09232143424','','',NULL),(8,'eqweq','eqweqw','eqweq','eqwee','eqweq','eqweqwe','8000','093213431',_binary '1724678023341.jpg',_binary '1724678023344.pdf',NULL),(9,'Ofamin','George','ASdasd','Davao Del Sur','Davao','Talomo','8000','09232143424',_binary '1724678074174.jpg',_binary '1724678074178.pdf',NULL),(10,'Gil','Christian','Arcena','Davao Del Sur','Davao','talomo','8000','09232143424',_binary '1724678133234.jpg',_binary '1724678133238.pdf',NULL),(11,'Ofamin','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',_binary '1724678398727.jpg',_binary '1724678398731.pdf',NULL),(12,'Doe','Jon','Stewart','1600 Fake Street','Davao City','Talomo','94043','6019521325',_binary '1724678660563.jpg',_binary '1724678660567.pdf',NULL),(13,'Doe','Jon','Stewart','1600 Fake Street','Davao City','Talomo','94043','6019521325',_binary '1724678844701.jpg',_binary '1724678844704.pdf',NULL),(14,'Doe','Jon','Man','Davao del Sur','Davao City','Talomo','8000','6019521325',_binary '1724679259558.jpg',_binary '1724679259562.pdf',NULL),(15,'Doe','Jon','Stewart','1600 Fake Street','Davao City','Talomo','94043','6019521325',_binary '1724680182763.jpg',_binary '1724680182768.pdf',NULL),(16,'Doe','Jon','Stewart','1600 Fake Street','Davao City','Talomo','94043','6019521325',_binary '1724680463225.jpg',_binary '1724680463226.pdf',NULL),(17,'Doe','Jon','Stewart','1600 Fake Street','ekqwek','ewqeqk','94043','6019521325',_binary '1724680644233.jpg',_binary '1724680644238.pdf',NULL),(18,'Doe','Jon','Man','1600 Fake Street','ekqwek','ewqeqk','8000','6019521325',_binary '1724680935180.jpg',_binary '1724680935182.pdf',NULL);
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

-- Dump completed on 2024-08-27  0:25:49
