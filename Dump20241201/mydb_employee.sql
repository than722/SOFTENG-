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
  `progress_id` int DEFAULT '3',
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `idx_email` (`email`),
  KEY `idx_firstName` (`firstName`),
  KEY `idx_lastName` (`lastName`),
  KEY `idx_status_id` (`status_id`),
  KEY `fk_employee_progress` (`progress_id`),
  CONSTRAINT `fk_employee_progress` FOREIGN KEY (`progress_id`) REFERENCES `progress` (`id`),
  CONSTRAINT `fk_status` FOREIGN KEY (`status_id`) REFERENCES `status_lookup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (23,'Doe','Jon','Stewart','1600 Fake Street','Davao City','Talomo','94043','6019521325',NULL,_binary '1724857019362.png',_binary '1724857019365.pdf','','','','',1,1,'',''),(25,'Leibniz','Gottfried','Wilhelm','Erfundene Straße 33','Davao','Talomo','80732','030303986',NULL,_binary '1724857670551.jpg',_binary '1724857670554.pdf','','','','',NULL,3,'',''),(26,'Ofamin','Christian','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1726492966587.jpg',_binary '1726492966591.pdf','','','','',2,2,'cdtsmooth@gmail.com','1234'),(28,'Gil','George','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1726495779425.png',_binary '1726495779432.pdf','','','','',2,2,'gilethan722@gmail.com','654321'),(30,'Gil','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1728398850121.jpg',_binary '1728398850122.pdf','','','','',2,NULL,'gilethan@ymail.com','12345'),(31,'Doe','Jon','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1728406525712.jpg',_binary '1728406525713.pdf','','','','',2,NULL,'gilethan722@gmail.com','12345'),(32,'Gil','Ethan','Man','Davao del Sur','Davao City','Talomo','8000','09312332121',NULL,_binary '1728406674372.png',_binary '1728406674374.pdf','','','','',2,NULL,'gilethan722@gmail.com','12345'),(34,'Gil','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1728407351247.jpg',_binary '1728407351247.pdf','','','','',2,NULL,'gilethan@ymail.com','12345'),(36,'Gil','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1728407693988.jpg',_binary '1728407693988.pdf','','','','',2,NULL,'gilethan@ymail.com','12345'),(38,'Gil','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1728409242117.jpg',_binary '1728409242117.pdf','','','','',2,NULL,'gilethan@ymail.com','123456'),(39,'Gil','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1728409534353.jpg',_binary '1728409534354.pdf','','','','',2,NULL,'gilethan722@gmail.com','12345'),(40,'Doe','Christian','Stewart','Davao del Sur','Davao','talomo','8000','09321354123',NULL,_binary '1728485233729.jpg',_binary '1728485233730.pdf','','','','',2,NULL,'gilethan@ymail.com','12345'),(41,'Gil','Jon','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1728485358981.jpg',_binary '1728485358981.pdf','','','','',2,NULL,'gilethan722@gmail.com','12345'),(43,'Doe','Jon','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1728486748413.jpg',_binary '1728486748414.pdf','','','','',2,NULL,'cdtsmooth@gmail.com','123456'),(44,'García Flores','George','Man','1600 Fake Street','Davao City','Talomo','8000','09232143424',NULL,_binary '1728487221293.jpg',_binary '1728487221294.pdf','','','','',2,NULL,'gilethan@ymail.com','123456'),(45,'Kay','Tom','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1728487743446.png',_binary '1728487743446.pdf','','','','',2,NULL,'gilethan@720gmail.com','1234567'),(46,'Doe','Jon','Man','1600 Fake Street','Davao City','Talomo','8000','09232143424',NULL,_binary '1728490292203.png',_binary '1728490292204.pdf','','','','',2,NULL,'eagil@adu.edu.ph','1234567'),(47,'García Flores','John','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1730034045995.jpg',_binary '1730034045997.pdf','','','','',2,NULL,'gilethan789@gmail.com','1234567'),(48,'Doe','Tom','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1730034213729.jpg',_binary '1730034213729.pdf','','','','',2,NULL,'gilethan789@gmail.com','1234567'),(49,'Ofamin','Jon','ASdasd','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1730034269655.jpg',_binary '1730034269656.pdf','','','','',2,NULL,'gilethan789@gmail.com','1234567'),(50,'García Flores','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1730034688278.jpg',_binary '1730034688279.pdf','','','','',2,NULL,'gilethan724@gmail.com','1234567'),(51,'Doe','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1730218695043.jpg',_binary '1730218695043.pdf','','','','',2,NULL,'gilethan72123@gmail.com','$2b$10$oJicQ7tePsIGIBCohN9MX.fEffnqSPc7aw.7gWeByg1GLSCDZhX/.'),(52,'Ofamin','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1730218754745.jpg',_binary '1730218754746.pdf','','','','',2,NULL,'eagil21@adu.edu.ph','$2b$10$5B1W5lStKfUgPG5U3MxUfeuPwrMIeWdryRrURJ9lRJ.hbiZ2RgL2K'),(53,'Gil','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1730219020349.png',_binary '1730219020350.pdf','','','','',2,NULL,'gilethan7299@gmail.com','$2b$10$R2xYZjkkG6X.Qgb0Sl6MA.DcYIcfCdgUtvyU7I23CnChr.44pMeiW'),(54,'Doe','Ethan','Stewart','1600 Fake Street','Davao City','Talomo','8000','09232143424',NULL,_binary '1730219162636.png',_binary '1730219162637.pdf','','','','',2,NULL,'eagil33@adu.edu.ph','$2b$10$aJM92EDPYT1XPmHeoVLMmO9oz6owk5VmTOnunHruV/FPJ1M/eVCla'),(55,'Doe','Tom','Man','1600 Fake Street','Davao City','Talomo','8000','09232143424',NULL,_binary '1730219325323.png',_binary '1730219325327.pdf','','','','',2,NULL,'gilethan7222@gmail.com','$2b$10$cbrx/Nfef7y/fdR9LE7rjOhwb4h6xHjtecWzIYvsXgccZgCZiqvEG'),(58,'Doe','Ethan','Man','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1a9dedc5e9b61a3df78bae63990f3ff6',_binary 'e620aa160561531f8a15d7b96b431d08','','','','',2,NULL,'gilethan73122@gmail.com','$2b$10$w2VgBtIANS1Af/soeCz2r.MqxwE9Ssoxaoz90enTSVRawDTtfWlaO'),(59,'Ofamin','Jon','Man','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary 'a3305e8c37ef8f9d31212917ec898710',_binary '70d40974e9a0f7300441d033f4d58c9c','','','','',2,NULL,'gilethan7290@gmail.com','$2b$10$MIcJORaTtXWE/.Z65jSyDeiCkHJankity8TG/WN/FUtCwxdrK6TB6'),(60,'García Flores','Jon','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '917cfc91a963a318039492daf469b4b8',_binary 'f70ea1608993604a920c9811832cb82b','','','','',4,2,'eagil322@adu.edu.ph','$2b$10$78eAlV0wjwGzr4d2WzQgQ.fRTGNJbJFPFdPcrn/KdpDXPnxRh117S'),(61,'García Flores','Ethan','Arcena','Davao del Sur','Davao City','Talomo','94043','09232143424',NULL,_binary '85eb4d7198071a60c1bdde98468524af',_binary '84e83efc365d14afbb2917c87d12ccd6','','','','',4,NULL,'gilethan72332@gmail.com','$2b$10$EhxfAWtFxQMNUk31nuvryuU2ZHCQ7JjQViTSE23LCXYwuNVzslGNi'),(62,'García Flores','Ryan','Man','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1731770695635.png',_binary '1731770695640.pdf','','','','',NULL,NULL,'gilethan313321@gmail.com','$2b$10$xCvxy.ErJl/tVlM6HTZwu.NiFn/D8kfM2goUpBOTc2lhyn.NnlEgG'),(63,'García Flores','John','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1731771795623.png',_binary '1731771795626.pdf','','','','',5,3,'gilethan7203221@gmail.com','$2b$10$zEseX4dOu5M/8BUztAxi2.bl0tbfcwVh9jt5snEM7m7PEZ1R5QmI6'),(64,'Parable','Stanley','Gian','Davao del Sur','Davao City','Talomo','9404','09232143424',NULL,_binary '1732372408446.png',_binary '1732372408448.pdf',_binary '1732372408439.jpg',_binary '1732372408466.png',_binary '1732372408467.png',_binary '1732372408468.png',5,1,'theemployee324@gmail.com','$2b$10$3oS6zLNnHbIcRhDAzCo8DOIBm5xFVLnrgUIy13m3pYFh7D6l3vBka'),(65,'Sanchez','Rick','Einstein','Davao del Sur','Davao City','Talomo','8000','09232143424',NULL,_binary '1732977681160.png',_binary '1732977681163.pdf',_binary '1732977681159.jpg',_binary '1732977681168.png',NULL,NULL,5,3,'theemployeeoftheday@gmail.com','$2b$10$TTrhAeiudBKAKVFCK4zVlOGtDfLcV8WPK1pbu0PfLw9sWx.ruC.ge');
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

-- Dump completed on 2024-12-01  0:17:53
