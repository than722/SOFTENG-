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
-- Table structure for table `job_postings`
--

DROP TABLE IF EXISTS `job_postings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_postings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jobName` varchar(255) NOT NULL,
  `jobOverview` text NOT NULL,
  `jobDescription` text,
  `salary` int DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `datePosted` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_postings`
--

LOCK TABLES `job_postings` WRITE;
/*!40000 ALTER TABLE `job_postings` DISABLE KEYS */;
INSERT INTO `job_postings` VALUES (1,'Domestic Helper','','Caretaker',400,'Malaysia',NULL),(2,'Domestic Helper','','Personal driver',500,'Singapore',NULL),(3,'Domestic Helper','To apply for the role please submit a link to your resume and a short Loom video introducing yourself and highlighting your skills and experience relevant to the role. This video will give us a better understanding of your communication style and how you can contribute to our team.\n\nPlease feel free to record a brief video (no more than 2 minute) addressing the following points:\nIntroduce yourself and share why you are interested in this role.\nHighlight any previous experience you have as a Conversion Rate Optimisation (CRO) Expert.\nDiscuss any specific skills or qualifications that you believe make you a strong candidate for this position.\nOnce you\'ve recorded your video, please share the Loom link with.\n\n*Please follow instructions, those that didn\'t will not be reviewed*','Caretaker',400,'Malaysia',NULL),(4,'Domestic Helper','To apply for the role please submit a link to your resume and a short Loom video introducing yourself and highlighting your skills and experience relevant to the role. This video will give us a better understanding of your communication style and how you can contribute to our team.\n\nPlease feel free to record a brief video (no more than 2 minute) addressing the following points:\nIntroduce yourself and share why you are interested in this role.\nHighlight any previous experience you have as a Conversion Rate Optimisation (CRO) Expert.\nDiscuss any specific skills or qualifications that you believe make you a strong candidate for this position.\nOnce you\'ve recorded your video, please share the Loom link with.\n\n*Please follow instructions, those that didn\'t will not be reviewed*\n\n----------------------------------------------------------------------------------------------------\n\nWe are seeking a technically skilled CRO Specialist to optimise our website\'s performance, enhancing user experience and driving higher ','Caretaker',400,'Malaysia',NULL),(5,'Domestic Helper','To apply for the role please submit a link to your resume and a short Loom video introducing yourself and highlighting your skills and experience relevant to the role. This video will give us a better understanding of your communication style and how you can contribute to our team.\n\nPlease feel free to record a brief video (no more than 2 minute) addressing the following points:\nIntroduce yourself and share why you are interested in this role.\nHighlight any previous experience you have as a Conversion Rate Optimisation (CRO) Expert.\nDiscuss any specific skills or qualifications that you believe make you a strong candidate for this position.\nOnce you\'ve recorded your video, please share the Loom link with.\n\n*Please follow instructions, those that didn\'t will not be reviewed*\n\n----------------------------------------------------------------------------------------------------\n\nWe are seeking a technically skilled CRO Specialist to optimise our website\'s performance, enhancing user experience and driving higher ','Caretaker',400,'Malaysia','2024-10-09 00:00:00'),(6,'Domestic Helper','To apply for the role please submit a link to your resume and a short Loom video introducing yourself and highlighting your skills and experience relevant to the role. This video will give us a better understanding of your communication style and how you can contribute to our team.\n\nPlease feel free to record a brief video (no more than 2 minute) addressing the following points:\nIntroduce yourself and share why you are interested in this role.\nHighlight any previous experience you have as a Conversion Rate Optimisation (CRO) Expert.\nDiscuss any specific skills or qualifications that you believe make you a strong candidate for this position.\nOnce you\'ve recorded your video, please share the Loom link with.\n\n*Please follow instructions, those that didn\'t will not be reviewed*\n\n----------------------------------------------------------------------------------------------------\n\nWe are seeking a technically skilled CRO Specialist to optimise our website\'s performance, enhancing user experience and driving higher ','Caretaker',400,'Malaysia','2024-10-09 16:41:31');
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

-- Dump completed on 2024-10-09 22:50:40
