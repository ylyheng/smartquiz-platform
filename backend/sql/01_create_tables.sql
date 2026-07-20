-- ============================================================
-- SmartQuiz Platform - Database Table Creation Script
-- Database: MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS smartquiz_platform_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smartquiz_platform_db;

-- ============================================================
-- 1. User Table
-- ============================================================
CREATE TABLE IF NOT EXISTS `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `role` VARCHAR(20) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `User_email_key` (`email`),
  INDEX `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. QuestionBank Table
-- ============================================================
CREATE TABLE IF NOT EXISTS `QuestionBank` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Question Table
-- ============================================================
CREATE TABLE IF NOT EXISTS `Question` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `bankId` INT NOT NULL,
  `type` VARCHAR(20) NOT NULL,
  `questionText` TEXT NOT NULL,
  `options` TEXT,
  `correctAnswer` VARCHAR(191) NOT NULL,
  `explanation` TEXT,
  `mediaUrl` VARCHAR(500),
  `points` INT NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `idx_question_bankId` (`bankId`),
  CONSTRAINT `fk_question_bank` FOREIGN KEY (`bankId`) REFERENCES `QuestionBank` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. Quiz Table
-- ============================================================
CREATE TABLE IF NOT EXISTS `Quiz` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT,
  `lecturerId` INT NOT NULL,
  `timeLimit` INT NOT NULL,
  `shuffle` BOOLEAN NOT NULL DEFAULT FALSE,
  `showResults` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `idx_quiz_lecturerId` (`lecturerId`),
  CONSTRAINT `fk_quiz_lecturer` FOREIGN KEY (`lecturerId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. QuizQuestion (Junction Table)
-- ============================================================
CREATE TABLE IF NOT EXISTS `QuizQuestion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `quizId` INT NOT NULL,
  `questionId` INT NOT NULL,
  `order` INT NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `idx_quizquestion_quizId` (`quizId`),
  INDEX `idx_quizquestion_questionId` (`questionId`),
  CONSTRAINT `fk_quizquestion_quiz` FOREIGN KEY (`quizId`) REFERENCES `Quiz` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_quizquestion_question` FOREIGN KEY (`questionId`) REFERENCES `Question` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. Attempt Table
-- ============================================================
CREATE TABLE IF NOT EXISTS `Attempt` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `quizId` INT NOT NULL,
  `studentId` INT NOT NULL,
  `score` INT,
  `totalPoints` INT,
  `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `submittedAt` DATETIME(3),
  `status` VARCHAR(20) NOT NULL DEFAULT 'in-progress',

  PRIMARY KEY (`id`),
  INDEX `idx_attempt_quizId` (`quizId`),
  INDEX `idx_attempt_studentId` (`studentId`),
  INDEX `idx_attempt_status` (`status`),
  INDEX `idx_attempt_quiz_student` (`quizId`, `studentId`),
  CONSTRAINT `fk_attempt_quiz` FOREIGN KEY (`quizId`) REFERENCES `Quiz` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_attempt_student` FOREIGN KEY (`studentId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. AttemptAnswer Table
-- ============================================================
CREATE TABLE IF NOT EXISTS `AttemptAnswer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `attemptId` INT NOT NULL,
  `questionId` INT NOT NULL,
  `answer` VARCHAR(191),
  `isCorrect` BOOLEAN,
  `score` INT,
  `feedback` TEXT,

  PRIMARY KEY (`id`),
  INDEX `idx_attemptanswer_attemptId` (`attemptId`),
  INDEX `idx_attemptanswer_questionId` (`questionId`),
  CONSTRAINT `fk_attemptanswer_attempt` FOREIGN KEY (`attemptId`) REFERENCES `Attempt` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_attemptanswer_question` FOREIGN KEY (`questionId`) REFERENCES `Question` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
