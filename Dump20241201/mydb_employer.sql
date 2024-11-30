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
  PRIMARY KEY (`employer_id`),
  KEY `fk_employer_progress` (`progress_id`),
  KEY `fk_status_employer` (`status_id`),
  CONSTRAINT `fk_employer_progress` FOREIGN KEY (`progress_id`) REFERENCES `progress` (`id`),
  CONSTRAINT `fk_status_employer` FOREIGN KEY (`status_id`) REFERENCES `status_lookup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employer`
--

LOCK TABLES `employer` WRITE;
/*!40000 ALTER TABLE `employer` DISABLE KEYS */;
INSERT INTO `employer` VALUES (6,'Doe','Jon','Stewart','1600 Fake Street','Davao City','Talomo','94043','6019521325','Fake Company',NULL,3,'','',''),(7,'García Flores','Christ','Man','1600 Fake Street','Davao City','Talomo','8000','09312332121','Fake Company',2,NULL,'','gilethan@ymail.com','123456'),(8,'Gil','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',2,NULL,'','gilethan@ymail.com','12345'),(10,'Doe','Christian','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',2,NULL,'','gilethan724@gmail.com','123456'),(11,'Ofamin','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Jak Comapn',2,NULL,'','gilethan524@gmail.com','$2b$10$LVCFOAG0B820GbeiFETC/eHST67Kam0IlRhnRt9LLhoujIHEpz2b.'),(12,'García Flores','Christian','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',2,NULL,'','cdtsmooth312@gmail.com','$2b$10$0sjvraVjMuzYKncNwKKv3eA7YIHHl7tjtIIcWQLDOH22x9m.0MVre'),(13,'Ofamin','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Jak Comapn',2,NULL,'','gilethan7994@gmail.com','$2b$10$5aXg4uWcGjCr99fKfCM79ehYYZpBEVN0ZAndTbTYEolhguyFFLEOG'),(14,'García Flores','Christian','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Jak Comapnu',2,NULL,'','gilethan7244@gmail.com','$2b$10$4Cq7XvJTELuoCCSDU7wPceT8ZtJEz0HUlawq33vbDxvuEX/aiVS1a'),(15,'Kay','John','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424','Jak Comapnuee',2,NULL,'','gilethan7244@gmail.com','$2b$10$8dVxdMDaaEYwoaVt3NXhUu8ADHTewoZxDMEkMrtmIm4ppurK8qotm'),(16,'García Flores','Jon','Man','Davao del Sur','Davao City','Talomo','8000','09232143424','Jakret',2,NULL,'','gilethan72321@gmail.com','$2b$10$3.jimFMsw40Tyw.pNHCCRei6FmVp3LKPtxiiDtordOWYAhd1mCEra'),(17,'García Flores','Jon','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',2,NULL,'','gilethan72023@gmail.com','$2b$10$Li/.sw4ZKoC6gVOfLq3aD.2TlpZ6gqg1RO5niCHBTXIzhOyUpBVnW'),(18,'Doe','Tom','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Jak Comapne',2,NULL,'','gilethan7200@gmail.com','$2b$10$UH5LYfh6ZBsOYmkJZ2LUzu13ylDfLUBc1jqd7STFn/CdB6V3MUbye'),(19,'García Flores','Christian','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',2,NULL,'','cdtsmooth029@gmail.com','$2b$10$Kf3g5ZhrNRK3h13CJfjnBepEDqKv90D0/3w0hErQlr6sJFGuDzuJW'),(20,'Gil','Jon','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',2,NULL,'','gilethan72213@gmail.com','$2b$10$RBjnphqZ9UWSYjEAf9oD8exlj4oiMhbB3Z4fISqU.dWilhJkyAcJ2'),(21,'Ofamin','Ethan','Arcena','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',2,NULL,'','gilethan72467@gmail.com','$2b$10$h5toh3ZA43MA6PcM6jrgtuXT0LCz1bGxA8ZLsP.vxSWf.R1FiV5li'),(22,'Doe','Christian','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424','Jak Comapny',2,NULL,'','cdtsmooth2321@gmail.com','$2b$10$958BooUyn2B8pIIZBeY4.uayh7LBMkd7sB4mRSHrzsF32GAefA7ri'),(23,'Doe','Christian','Stewart','1600 Fake Street','Davao City','Talomo','8000','09232143424','Fake Company',2,NULL,'','gilethan231@gmail.com','$2b$10$0CAAmXzA7jb7Bbv4UkvNTuMxIDFuQMtMRWvfXArq2krf0t/pUuDqC'),(24,'García Flores','Tom','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',NULL,1,'','gilethan723234@gmail.com','$2b$10$CsRmZ9BIKuNgpMox0vN3Duq2ChyCWKn0T8N2tTt4dXMvfsl0NqxTW'),(25,'García Flores','Ray','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',3,3,'','gilethan7203231@gmail.com','$2b$10$Bv7Nak8z/TALtBdbkxObIuaHH2i4GB4LmaQR5Jn4MPDtXW0Wy093y'),(26,'García','Christian','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',3,3,_binary '1732370661460.jpg','gilethan7223123456@gmail.com','$2b$10$mL5F/KVIj7lKMYKWtQbMm.QY/A0SrP1OwOMcTHbQRgsPEcs6mXpRy'),(27,'Cartman','Eric','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424','Fake Company',3,3,_binary '1732372130220.png','themployer241@gmail.com','$2b$10$s58bfgehtBU.Sc1ktpyZWuMvO34pa6tLahNEzJqKracCkI7CUUhIi'),(28,'Doe','Patrick','Stewart','Davao del Sur','Davao City','Talomo','8000','09232143424','Jak Comapnu',3,3,_binary '1732384795469.jpg','themployer24231@gmail.com','$2b$10$ORUvykfFbAKpgr8NFtFzr.vdZIII5twCcr/KHTjluC00vUDt8cX2S');
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

-- Dump completed on 2024-12-01  0:17:53
