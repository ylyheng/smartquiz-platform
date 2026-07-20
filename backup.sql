-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: smartquiz_platform_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('1a83c9e5-b142-4b12-a0ea-9900440d57dd','3ff0842d90199df37e23688bb5f16f5246c222b504a7c1ffafbd6c014c3a51f5','2026-06-13 10:23:11.293','20260613102311_init',NULL,NULL,'2026-06-13 10:23:11.237',1),('93ff6dfc-8572-4cf1-9330-468c6d89526a','bfa6f2754fcfae5e3146e9f9b5f77822df46fa80ea351f9c7754acf075fd45e6','2026-06-13 10:59:26.828','20260613105926_init',NULL,NULL,'2026-06-13 10:59:26.713',1),('959d3329-9d18-4702-91bf-375462aa33a0','8c6ab7d00dcb767017e7d079e3bd01afad5f535ebf205d378444d585a4d36563','2026-06-14 09:14:49.965','20260614091449_add_quiz_platform_models',NULL,NULL,'2026-06-14 09:14:49.264',1),('e3378637-f90c-4054-ae98-eba522aa2ae8','940442e3df96b38d31b3a70a66a799cc4df34443fcf0680d35be711525b3f17c','2026-06-14 07:22:38.713','20260614072238_add_timestamps',NULL,NULL,'2026-06-14 07:22:38.652',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attempt`
--

DROP TABLE IF EXISTS `attempt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attempt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quizId` int NOT NULL,
  `studentId` int NOT NULL,
  `score` int DEFAULT NULL,
  `totalPoints` int DEFAULT NULL,
  `startedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `submittedAt` datetime(3) DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'in-progress',
  PRIMARY KEY (`id`),
  KEY `Attempt_quizId_fkey` (`quizId`),
  KEY `Attempt_studentId_fkey` (`studentId`),
  CONSTRAINT `Attempt_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Attempt_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attempt`
--

LOCK TABLES `attempt` WRITE;
/*!40000 ALTER TABLE `attempt` DISABLE KEYS */;
INSERT INTO `attempt` VALUES (2,2,12,NULL,NULL,'2026-06-14 09:29:04.969',NULL,'in-progress'),(3,2,12,0,1,'2026-06-14 09:29:04.977','2026-06-14 09:29:09.780','submitted'),(4,2,14,NULL,NULL,'2026-06-14 09:31:37.210',NULL,'in-progress'),(5,2,14,1,1,'2026-06-14 09:31:37.211','2026-06-14 09:31:40.309','submitted'),(6,2,17,0,1,'2026-06-16 05:08:04.559','2026-06-16 05:08:08.407','submitted'),(7,2,17,NULL,NULL,'2026-06-16 05:08:04.559',NULL,'in-progress'),(8,3,25,1,1,'2026-07-19 10:07:27.273','2026-07-19 10:07:30.123','submitted'),(9,3,25,NULL,NULL,'2026-07-19 10:07:27.302',NULL,'in-progress'),(10,2,25,NULL,NULL,'2026-07-19 10:13:39.799',NULL,'in-progress'),(11,2,25,0,1,'2026-07-19 10:13:39.804','2026-07-19 10:13:42.713','submitted'),(12,4,26,NULL,NULL,'2026-07-19 17:29:45.409',NULL,'in-progress'),(13,4,26,14,14,'2026-07-19 17:29:45.422','2026-07-19 17:30:18.369','submitted'),(14,3,26,1,1,'2026-07-19 17:30:48.518','2026-07-19 17:30:52.562','submitted'),(15,3,26,NULL,NULL,'2026-07-19 17:30:48.522',NULL,'in-progress'),(16,2,26,NULL,NULL,'2026-07-19 17:31:06.272',NULL,'in-progress'),(17,2,26,1,1,'2026-07-19 17:31:06.280','2026-07-19 17:31:09.249','submitted'),(18,3,27,NULL,NULL,'2026-07-19 17:38:50.127',NULL,'in-progress'),(19,3,27,1,1,'2026-07-19 17:38:50.134','2026-07-19 17:39:04.952','submitted'),(20,2,27,1,1,'2026-07-19 17:43:41.855','2026-07-19 17:43:55.301','submitted'),(21,2,27,NULL,NULL,'2026-07-19 17:43:41.859',NULL,'in-progress'),(22,4,27,NULL,NULL,'2026-07-19 17:48:24.943',NULL,'in-progress'),(23,4,27,14,14,'2026-07-19 17:48:24.950','2026-07-19 17:48:51.699','submitted'),(24,3,28,1,1,'2026-07-20 03:34:07.927','2026-07-20 03:34:23.955','submitted'),(25,3,28,NULL,NULL,'2026-07-20 03:34:07.931',NULL,'in-progress'),(26,4,28,0,14,'2026-07-20 03:35:53.546','2026-07-20 03:36:15.410','submitted'),(27,4,28,NULL,NULL,'2026-07-20 03:35:53.552',NULL,'in-progress'),(28,2,28,NULL,NULL,'2026-07-20 03:56:36.192',NULL,'in-progress'),(29,2,28,NULL,NULL,'2026-07-20 03:56:36.193',NULL,'in-progress'),(30,6,30,7,8,'2026-07-10 09:00:00.000','2026-07-10 09:18:00.000','submitted'),(31,6,31,5,8,'2026-07-10 09:05:00.000','2026-07-10 09:28:00.000','submitted'),(32,7,30,5,6,'2026-07-12 14:00:00.000','2026-07-12 14:12:00.000','submitted'),(33,7,26,NULL,NULL,'2026-07-20 05:03:29.767',NULL,'in-progress'),(34,7,26,NULL,NULL,'2026-07-20 05:03:29.779',NULL,'in-progress'),(35,5,26,NULL,NULL,'2026-07-20 05:03:38.745',NULL,'in-progress'),(36,5,26,NULL,NULL,'2026-07-20 05:03:38.750',NULL,'in-progress');
/*!40000 ALTER TABLE `attempt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attemptanswer`
--

DROP TABLE IF EXISTS `attemptanswer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attemptanswer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attemptId` int NOT NULL,
  `questionId` int NOT NULL,
  `answer` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isCorrect` tinyint(1) DEFAULT NULL,
  `score` int DEFAULT NULL,
  `feedback` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `AttemptAnswer_attemptId_fkey` (`attemptId`),
  KEY `AttemptAnswer_questionId_fkey` (`questionId`),
  CONSTRAINT `AttemptAnswer_attemptId_fkey` FOREIGN KEY (`attemptId`) REFERENCES `attempt` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `AttemptAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attemptanswer`
--

LOCK TABLES `attemptanswer` WRITE;
/*!40000 ALTER TABLE `attemptanswer` DISABLE KEYS */;
INSERT INTO `attemptanswer` VALUES (13,12,5,NULL,NULL,NULL,NULL),(14,12,6,NULL,NULL,NULL,NULL),(15,12,7,NULL,NULL,NULL,NULL),(16,12,4,NULL,NULL,NULL,NULL),(18,13,5,'C',1,1,''),(20,13,7,'A',1,10,''),(21,13,6,'A',1,1,''),(22,13,4,'C',1,1,''),(32,22,4,NULL,NULL,NULL,NULL),(33,22,7,NULL,NULL,NULL,NULL),(34,22,6,NULL,NULL,NULL,NULL),(35,22,5,NULL,NULL,NULL,NULL),(36,23,6,'A',1,1,''),(37,23,7,'A',1,10,''),(38,23,4,'C',1,1,''),(39,23,5,'C',1,1,''),(43,26,6,'C',0,0,''),(44,26,7,'B',0,0,''),(45,26,5,'B',0,0,''),(47,26,4,'B',0,0,''),(49,27,6,NULL,NULL,NULL,NULL),(50,27,7,NULL,NULL,NULL,NULL),(51,27,4,NULL,NULL,NULL,NULL),(52,27,5,NULL,NULL,NULL,NULL),(55,30,21,'B',1,2,'Correct!'),(56,30,22,'B',1,1,'Correct!'),(57,30,23,'False',1,2,'Correct!'),(58,30,24,'A',0,0,'Incorrect. Merge sort requires O(n) space.'),(59,30,25,'True',1,1,'Correct!'),(60,31,21,'A',0,0,'Incorrect. Binary search is O(log n).'),(61,31,22,'B',1,1,'Correct!'),(62,31,23,'True',0,0,'Incorrect. BST can degrade to O(n).'),(63,31,24,'C',1,2,'Correct!'),(64,31,25,'True',1,1,'Correct!'),(65,32,26,'D',1,1,'Correct!'),(66,32,27,'B',1,2,'Correct!'),(67,32,28,'True',0,0,'Incorrect. The empty relation is a counterexample.'),(68,33,26,NULL,NULL,NULL,NULL),(69,33,27,NULL,NULL,NULL,NULL),(70,33,28,NULL,NULL,NULL,NULL),(71,34,26,NULL,NULL,NULL,NULL),(72,34,27,NULL,NULL,NULL,NULL),(73,34,28,NULL,NULL,NULL,NULL),(74,35,20,NULL,NULL,NULL,NULL),(75,35,19,NULL,NULL,NULL,NULL),(76,35,17,NULL,NULL,NULL,NULL),(77,35,18,NULL,NULL,NULL,NULL),(78,35,16,NULL,NULL,NULL,NULL),(79,36,16,NULL,NULL,NULL,NULL),(80,36,20,NULL,NULL,NULL,NULL),(81,36,19,NULL,NULL,NULL,NULL),(82,36,17,NULL,NULL,NULL,NULL),(83,36,18,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `attemptanswer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bankId` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `questionText` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correctAnswer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `explanation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `points` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `mediaUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Question_bankId_fkey` (`bankId`),
  CONSTRAINT `Question_bankId_fkey` FOREIGN KEY (`bankId`) REFERENCES `questionbank` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (4,3,'mcq','What is the primary responsibility of a Database Administrator (DBA)?','A. Creating computer hardware\nB. Writing mobile applications\nC. Managing and maintaining databases\nD. All of above','C','',1,'2026-07-19 17:19:43.651','2026-07-19 17:19:43.651',NULL),(5,3,'mcq','Which of the following is the main purpose of a database backup?','A. To increase internet speed\nB. To install new software\nC. To restore data in case of loss or failure\nD.  To improve monitor resolution','C','',1,'2026-07-19 17:21:23.475','2026-07-19 17:21:23.475',NULL),(6,3,'mcq','Which SQL command is commonly used to create a new database?','A. CREATE DATABASE \nB. NEW DATABASE\nC. ADD DATABASE\nD. MAKE DATABASE','A','',1,'2026-07-19 17:22:32.064','2026-07-19 17:22:32.064',NULL),(7,3,'true-false','Anyone should have administrator access to a production database.',NULL,'False','',1,'2026-07-19 17:25:55.636','2026-07-20 04:08:04.926',NULL),(9,3,'true-false','Granting users only the permissions they need is a good security practice.',NULL,'True','',1,'2026-07-20 04:07:52.759','2026-07-20 04:07:52.759',NULL),(10,4,'mcq','Which of the following is the primary role of backend development?','A. Designing user interfaces\nB.  Managing server-side logic and databases\nC. Creating animations\nD. Editing images','B','',1,'2026-07-20 04:12:25.615','2026-07-20 04:12:25.615',NULL),(11,4,'mcq','Which of the following is a backend programming language?','A. HTML\nB. CSS\nC. Javascript(Node.js)\nD. Bootstrap','C','',1,'2026-07-20 04:13:32.380','2026-07-20 04:13:32.380',NULL),(12,4,'mcq','Which database is commonly used with backend applications?','A. MySQL\nB. Miscrosoft Word\nC. PhotoShop\nD. PowerPoint','A','',1,'2026-07-20 04:14:39.962','2026-07-20 04:14:39.962',NULL),(13,4,'mcq','Which HTTP method is typically used to create a new resource?','A. GET\nB. POST\nC. DELETE \nD. HEAD','B','',1,'2026-07-20 04:16:23.299','2026-07-20 04:16:23.299',NULL),(14,4,'true-false','The GET HTTP method is typically used to retrieve data from a server.',NULL,'True','',1,'2026-07-20 04:16:30.815','2026-07-20 04:16:30.815',NULL),(15,4,'true-false','The POST HTTP method is commonly used to delete data from a database.',NULL,'False','',1,'2026-07-20 04:17:17.105','2026-07-20 04:17:17.105',NULL),(16,5,'mcq','What is Software Engineering?','A. The process of repairing computer hardware\nB. The systematic approach to developing, testing, and maintaining software\nC. Designing computer networks\nD. Installing operating systems','B','',1,'2026-07-20 04:24:54.764','2026-07-20 04:24:54.764',NULL),(17,5,'mcq','Which UML diagram is used to show interactions between users and the system?','A. Use Case Diagram\nB. Class Diagram\nC. Activity Diagram\nD. Sequence Diagram','A','',1,'2026-07-20 04:25:54.005','2026-07-20 04:25:54.005',NULL),(18,5,'mcq','Which document describes the functional and non-functional requirements of a system?','A. Software Requirements Specification (SRS)\nB. User Manual\nC. Test Report\nD. Source Code','A','',1,'2026-07-20 04:27:21.471','2026-07-20 04:27:21.471',NULL),(19,5,'true-false','Testing is performed only after the software is released.',NULL,'False','',1,'2026-07-20 04:27:48.031','2026-07-20 04:27:48.031',NULL),(20,5,'true-false','Maintenance is one of the phases in the Software Development Life Cycle (SDLC).',NULL,'True','',1,'2026-07-20 04:28:06.990','2026-07-20 04:28:06.990',NULL),(21,6,'mcq','What is the time complexity of binary search on a sorted array of n elements?','A. O(n)\nB. O(log n)\nC. O(n log n)\nD. O(1)','B','Binary search halves the search space with each comparison, resulting in O(log n) time complexity.',2,'2026-07-20 05:01:04.128','2026-07-20 05:01:04.128',NULL),(22,6,'mcq','Which data structure uses FIFO (First In, First Out) ordering?','A. Stack\nB. Queue\nC. Binary Tree\nD. Hash Table','B','A queue follows FIFO ordering where the first element inserted is the first one removed.',1,'2026-07-20 05:01:04.137','2026-07-20 05:01:04.137',NULL),(23,6,'true-false','A binary search tree (BST) guarantees O(log n) search time in all cases.',NULL,'False','A BST can degenerate into a linked list in the worst case (sorted input), resulting in O(n) search time. Self-balancing trees like AVL or Red-Black trees guarantee O(log n).',2,'2026-07-20 05:01:04.142','2026-07-20 05:01:04.142',NULL),(24,6,'mcq','What is the space complexity of merge sort?','A. O(1)\nB. O(log n)\nC. O(n)\nD. O(n log n)','C','Merge sort requires O(n) additional space for the temporary arrays used during the merge step.',2,'2026-07-20 05:01:04.147','2026-07-20 05:01:04.147',NULL),(25,6,'true-false','A stack data structure operates on the LIFO (Last In, First Out) principle.',NULL,'True','A stack always removes the most recently added element first, following LIFO ordering.',1,'2026-07-20 05:01:04.151','2026-07-20 05:01:04.151',NULL),(26,7,'mcq','Which of the following is NOT a valid logical connective?','A. AND\nB. OR\nC. IMPLIES\nD. DIVIDES','D','AND, OR, and IMPLIES are standard logical connectives. DIVIDES is a mathematical relation, not a logical connective.',1,'2026-07-20 05:01:04.155','2026-07-20 05:01:04.155',NULL),(27,7,'mcq','What is the negation of the statement \"For all x, P(x)\"?','A. For all x, not P(x)\nB. There exists x such that not P(x)\nC. There exists x such that P(x)\nD. Not P(x) for some x','B','The negation of a universal quantifier is an existential quantifier with the negated predicate: ¬(∀x P(x)) ≡ ∃x ¬P(x).',2,'2026-07-20 05:01:04.159','2026-07-20 05:01:04.159',NULL),(28,7,'true-false','Every relation that is symmetric and transitive is also reflexive.',NULL,'False','A relation can be symmetric and transitive without being reflexive. For example, the empty relation on a non-empty set is symmetric and transitive but not reflexive.',3,'2026-07-20 05:01:04.164','2026-07-20 05:01:04.164',NULL);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questionbank`
--

DROP TABLE IF EXISTS `questionbank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questionbank` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionbank`
--

LOCK TABLES `questionbank` WRITE;
/*!40000 ALTER TABLE `questionbank` DISABLE KEYS */;
INSERT INTO `questionbank` VALUES (3,'Database Adminisrtation','Test1','2026-07-19 11:17:20.947','2026-07-20 04:10:29.919'),(4,'BackEnd Development','Test2','2026-07-20 04:10:47.558','2026-07-20 04:10:47.558'),(5,'Software Engineering','Test3','2026-07-20 04:21:38.651','2026-07-20 04:21:38.651'),(6,'Data Structures & Algorithms','Fundamental concepts of data structures and algorithm analysis','2026-07-20 05:01:04.114','2026-07-20 05:01:04.114'),(7,'Discrete Mathematics','Logic, sets, relations, and graph theory','2026-07-20 05:01:04.123','2026-07-20 05:01:04.123');
/*!40000 ALTER TABLE `questionbank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lecturerId` int NOT NULL,
  `timeLimit` int NOT NULL,
  `shuffle` tinyint(1) NOT NULL DEFAULT '0',
  `showResults` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Quiz_lecturerId_fkey` (`lecturerId`),
  CONSTRAINT `Quiz_lecturerId_fkey` FOREIGN KEY (`lecturerId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` VALUES (2,'test','easyyy',13,30,0,1,'2026-06-14 09:27:39.610','2026-06-14 09:27:39.610'),(3,'fjfjf','fjjvvnvn',23,30,0,1,'2026-07-19 08:40:58.755','2026-07-19 08:40:58.755'),(4,'Test1','',23,3,1,1,'2026-07-19 17:29:15.787','2026-07-19 17:29:15.787'),(5,'Software Engineering W4','',23,4,1,1,'2026-07-20 04:29:45.646','2026-07-20 04:29:45.646'),(6,'Data Structures Midterm','Covers arrays, linked lists, stacks, queues, and basic tree operations',29,30,1,1,'2026-07-20 05:01:04.170','2026-07-20 05:01:04.170'),(7,'Discrete Math Quiz 1','Logic and proof techniques',29,20,0,1,'2026-07-20 05:01:04.175','2026-07-20 05:01:04.175');
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizquestion`
--

DROP TABLE IF EXISTS `quizquestion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizquestion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quizId` int NOT NULL,
  `questionId` int NOT NULL,
  `order` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `QuizQuestion_quizId_fkey` (`quizId`),
  KEY `QuizQuestion_questionId_fkey` (`questionId`),
  CONSTRAINT `QuizQuestion_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `question` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `QuizQuestion_quizId_fkey` FOREIGN KEY (`quizId`) REFERENCES `quiz` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizquestion`
--

LOCK TABLES `quizquestion` WRITE;
/*!40000 ALTER TABLE `quizquestion` DISABLE KEYS */;
INSERT INTO `quizquestion` VALUES (6,4,7,2),(7,4,6,3),(8,4,5,4),(9,4,4,5),(10,5,20,1),(11,5,19,2),(12,5,18,3),(13,5,17,4),(14,5,16,5),(15,6,21,1),(16,6,22,2),(17,6,23,3),(18,6,24,4),(19,6,25,5),(20,7,26,1),(21,7,27,2),(22,7,28,3);
/*!40000 ALTER TABLE `quizquestion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (12,'Lyheng','mchess563@gmail.com','student','$2b$10$YEEP79ZZ.Qwl9hzpYiz39unndRUJDrCTIEK9BZvAiZkX6lhIT6Q.S','2026-06-14 09:24:17.074','2026-06-14 09:24:17.074'),(13,'test','test@gmail.com','lecturer','$2b$10$MtxpvRmp2FFlYF4CMa3KQOEY2Zod36RzV1CPLzK1dh3tRUT.NAUxK','2026-06-14 09:25:03.555','2026-06-14 09:25:03.555'),(14,'hello','abc@gmail.com','student','$2b$10$y92tWmzl5MUACbbWrLZ3u.J6.x82OQYZitWT3kXjtCumecFvffcsK','2026-06-14 09:31:34.853','2026-06-14 09:31:34.853'),(15,'heng','test123@gmail.com','student','$2b$10$NrLmnAkxbzDe/4zEx/1N/OZi5klzA5LEL81lXpRikWykzwTO5zIWi','2026-06-15 01:30:20.112','2026-06-15 01:30:20.112'),(16,'I love you','test1234@gmail.com','lecturer','$2b$10$OKrwvXRfujxKJu1227aeXuiJWXXt90d1PkYbAdOMh9CtlOmCrXroS','2026-06-15 03:54:21.735','2026-06-15 03:54:21.735'),(17,'lyyyyy','test1@gmail.com','student','$2b$10$s.ymjmhvca6T/BX3kVWTUeyBHmhVzwN.3KFA7FkdqWVcNfmvFFvD6','2026-06-16 05:07:54.444','2026-06-16 05:07:54.444'),(18,'vvv','a@gmail.com','lecturer','$2b$10$FyzcaatJPFVNkVhQs5mWlerhLFpqDEZwV6naiOMazb9qvxPh8h/mO','2026-06-16 05:09:00.020','2026-06-16 05:09:00.020'),(19,'test','hi@gmail.com','lecturer','$2b$10$Sipiz1cX.6/80k3TCXPRDee7cNvyZDPqqgbiJAGcVfszg3vEg.dXq','2026-06-25 02:40:21.702','2026-06-25 02:40:21.702'),(20,'Avery Smith','testtt@gmail.com','lecturer','$2b$10$ChfCGm/mAOQlmVzvvUUKUu1ZHraC9.43lsCPYALnaXRyiAF0CWJ5e','2026-06-25 03:06:11.160','2026-06-25 03:06:11.160'),(21,'abc','abcd@gmail.com','lecturer','$2b$10$JQlGkxm0.yDhYeWUZz2cROZflR/ufrxw5bPtXQ4uXJBDYjc2kzgFS','2026-06-27 07:37:10.939','2026-06-27 07:37:10.939'),(22,'test','aaa@gmail.com','lecturer','$2b$10$4e/TGh46zZF9mOQlL2Fk6e5eZXLdhmP0Nl5zCb5fvF3yj4p6prIPW','2026-07-11 09:38:17.782','2026-07-11 09:38:17.782'),(23,'Soka','soka@gmail.com','lecturer','$2b$10$xeaawikVv8oVplXYhOn2k.Y.isf7U4Htw9Mwifsg9Sag9ahOSflxa','2026-07-19 08:12:43.232','2026-07-19 08:12:43.232'),(24,'Alex Johnson','alex@example.com','student','$2b$10$u7wVtBNYRSDDNkg/V5oItePKq8iC5x.2wyCX0xWfYOHWE9d1WXKdS','2026-07-19 10:05:47.335','2026-07-19 10:05:47.335'),(25,'test007','b@gmsil.com','student','$2b$10$UXeICuhZh7FteqVC6lKBGOH1CHXPVkQfz4aRN8WrhAbLnfls0uqHi','2026-07-19 10:07:12.546','2026-07-19 10:07:12.546'),(26,'chessman','chessman@gmail.com','student','$2b$10$TomPByEyKZqy8DtCgOKWDemfHngwUTWOtmi93dy0.djqdvwfZdGF.','2026-07-19 14:53:30.689','2026-07-19 14:53:30.689'),(27,'Hengly','heng@gmail.com','student','$2b$10$4BlnTyVSlLKIfhQo9uLOdOIdoS.12C54fjFmuItFZkD0gT9rHxEC2','2026-07-19 17:38:45.650','2026-07-19 17:38:45.650'),(28,'stu1','stu1@gmail.com','student','$2b$10$hmf108PI832QnSxSrv6YTOpQrFze0CAsgBRHbnymUTpRQia8dRCm2','2026-07-20 03:33:32.853','2026-07-20 03:33:32.853'),(29,'Dr. Sarah Chen','lecturer@smartquiz.edu','lecturer','$2b$10$XPnDgxwe3W8ehL2PxKFyRe0lHcr4vkptX0G4MDVh1BtTwks6dv6sW','2026-07-20 05:01:04.012','2026-07-20 05:01:04.012'),(30,'John Smith','student1@smartquiz.edu','student','$2b$10$XPnDgxwe3W8ehL2PxKFyRe0lHcr4vkptX0G4MDVh1BtTwks6dv6sW','2026-07-20 05:01:04.093','2026-07-20 05:01:04.093'),(31,'Emily Johnson','student2@smartquiz.edu','student','$2b$10$XPnDgxwe3W8ehL2PxKFyRe0lHcr4vkptX0G4MDVh1BtTwks6dv6sW','2026-07-20 05:01:04.101','2026-07-20 05:01:04.101'),(32,'Michael Lee','student3@smartquiz.edu','student','$2b$10$XPnDgxwe3W8ehL2PxKFyRe0lHcr4vkptX0G4MDVh1BtTwks6dv6sW','2026-07-20 05:01:04.107','2026-07-20 05:01:04.107');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'smartquiz_platform_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-20 12:09:10
