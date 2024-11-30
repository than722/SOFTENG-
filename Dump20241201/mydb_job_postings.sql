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
-- Table structure for table `job_postings`
--

DROP TABLE IF EXISTS `job_postings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_postings` (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `jobName` varchar(255) NOT NULL,
  `jobOverview` text,
  `jobDescription` text NOT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `datePosted` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `employer_id` int DEFAULT NULL,
  PRIMARY KEY (`job_id`),
  KEY `fk_employer_id_idx` (`employer_id`),
  CONSTRAINT `fk_employer_id` FOREIGN KEY (`employer_id`) REFERENCES `employer` (`employer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_postings`
--

LOCK TABLES `job_postings` WRITE;
/*!40000 ALTER TABLE `job_postings` DISABLE KEYS */;
INSERT INTO `job_postings` VALUES (1,'Domestic Helper','The chief information security officer‘s job description comprises an experienced and skilled professional responsible for developing and implementing security strategies that protect the company’s data and systems from cyber threats. They ensure the company’s IT security system adheres to regulatory requirements and analyze security threats to the computer system in real time.\n\nThe ideal candidate must have a strong background in information security, a deep understanding of relevant regulations and industry standards, and the ability to lead a team of security professionals.','Caretaker',400.00,'Malaysia','2024-10-09 14:46:13',NULL),(2,'Driver','qweqweqweqwe','WQeqweqe',100.00,'Malaysia','2024-11-04 14:15:50',NULL),(4,'Simple Gardener','Simple Gardener','Simpler Gardener',200.00,'Malaysia','2024-11-16 17:54:05',25),(5,'Housekeeper','Simple Housekeeper','Simple Housekeeper',300.00,'Thailand','2024-11-16 17:56:04',25),(6,'Dishwasher','simple dishwaser','SImple dishwasher',150.00,'Japan','2024-11-16 17:56:40',25),(7,'Guard','Simple Guard','Simple Guard',200.00,'Malaysia','2024-11-16 18:09:34',24);
/*!40000 ALTER TABLE `job_postings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-01  0:17:53
