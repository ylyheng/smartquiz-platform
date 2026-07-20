-- ============================================================
-- SmartQuiz Platform - Meaningful Query Scripts
-- Database: MySQL
-- ============================================================

USE smartquiz_platform_db;

-- ============================================================
-- QUERY 1: Platform Overview Statistics
-- Get total quizzes, total students, total attempts, average score
-- ============================================================
SELECT
  (SELECT COUNT(*) FROM `Quiz`) AS total_quizzes,
  (SELECT COUNT(*) FROM `User` WHERE `role` = 'student') AS total_students,
  (SELECT COUNT(*) FROM `Attempt` WHERE `status` = 'submitted') AS total_attempts,
  (SELECT ROUND(AVG(`score` / `totalPoints` * 100), 1)
   FROM `Attempt`
   WHERE `status` = 'submitted' AND `totalPoints` > 0) AS average_score_percentage;

-- ============================================================
-- QUERY 2: Quiz Performance Summary
-- Average score and attempt count per quiz
-- ============================================================
SELECT
  q.id,
  q.title,
  COUNT(a.id) AS attempt_count,
  ROUND(AVG(CASE WHEN a.totalPoints > 0
    THEN (a.score / a.totalPoints * 100) END), 1) AS avg_percentage,
  MIN(CASE WHEN a.totalPoints > 0
    THEN ROUND(a.score / a.totalPoints * 100, 1) END) AS lowest_score,
  MAX(CASE WHEN a.totalPoints > 0
    THEN ROUND(a.score / a.totalPoints * 100, 1) END) AS highest_score
FROM `Quiz` q
LEFT JOIN `Attempt` a ON a.quiz_id = q.id AND a.status = 'submitted'
GROUP BY q.id, q.title;

-- ============================================================
-- QUERY 3: Student Score Table (for a specific quiz)
-- Shows each student's score, percentage, and pass/fail status
-- ============================================================
SELECT
  u.name AS student_name,
  a.score,
  a.totalPoints,
  ROUND(a.score / a.totalPoints * 100, 1) AS percentage,
  CASE WHEN (a.score / a.totalPoints * 100) >= 50 THEN 'PASSED' ELSE 'FAILED' END AS status,
  a.submittedAt
FROM `Attempt` a
JOIN `User` u ON u.id = a.student_id
WHERE a.quiz_id = 1 AND a.status = 'submitted'
ORDER BY a.score DESC;

-- ============================================================
-- QUERY 4: Question Performance Breakdown
-- Percentage of students who answered each question correctly
-- ============================================================
SELECT
  q.id,
  q.questionText,
  q.type,
  COUNT(aa.id) AS total_answers,
  SUM(CASE WHEN aa.isCorrect = TRUE THEN 1 ELSE 0 END) AS correct_count,
  ROUND(
    SUM(CASE WHEN aa.isCorrect = TRUE THEN 1 ELSE 0 END) / COUNT(aa.id) * 100
  , 1) AS correct_percentage
FROM `Question` q
JOIN `QuizQuestion` qq ON qq.question_id = q.id
JOIN `AttemptAnswer` aa ON aa.question_id = q.id
JOIN `Attempt` a ON a.id = aa.attempt_id
WHERE qq.quiz_id = 1 AND a.status = 'submitted'
GROUP BY q.id, q.questionText, q.type
ORDER BY correct_percentage ASC;

-- ============================================================
-- QUERY 5: Lecturer's Quiz List with Attempt Counts
-- Shows all quizzes by a lecturer with participation stats
-- ============================================================
SELECT
  q.id,
  q.title,
  q.timeLimit,
  q.shuffle,
  q.showResults,
  COUNT(DISTINCT a.student_id) AS unique_students,
  COUNT(a.id) AS total_attempts,
  q.createdAt
FROM `Quiz` q
LEFT JOIN `Attempt` a ON a.quiz_id = q.id AND a.status = 'submitted'
WHERE q.lecturer_id = 1
GROUP BY q.id, q.title, q.timeLimit, q.shuffle, q.showResults, q.createdAt
ORDER BY q.createdAt DESC;

-- ============================================================
-- QUERY 6: Question Bank Summary
-- Shows question count and total points per bank
-- ============================================================
SELECT
  qb.id,
  qb.title,
  qb.description,
  COUNT(q.id) AS question_count,
  COALESCE(SUM(q.points), 0) AS total_points,
  SUM(CASE WHEN q.type = 'mcq' THEN 1 ELSE 0 END) AS mcq_count,
  SUM(CASE WHEN q.type = 'true-false' THEN 1 ELSE 0 END) AS tf_count
FROM `QuestionBank` qb
LEFT JOIN `Question` q ON q.bank_id = qb.id
GROUP BY qb.id, qb.title, qb.description;

-- ============================================================
-- QUERY 7: Student Performance History
-- All attempts by a student with quiz titles
-- ============================================================
SELECT
  q.title AS quiz_title,
  a.score,
  a.totalPoints,
  ROUND(a.score / a.totalPoints * 100, 1) AS percentage,
  a.status,
  a.startedAt,
  a.submittedAt,
  TIMESTAMPDIFF(MINUTE, a.startedAt, a.submittedAt) AS duration_minutes
FROM `Attempt` a
JOIN `Quiz` q ON q.id = a.quiz_id
WHERE a.student_id = 2
ORDER BY a.startedAt DESC;

-- ============================================================
-- QUERY 8: Average Score Per Student
-- Overall average percentage across all submitted attempts
-- ============================================================
SELECT
  u.id,
  u.name,
  COUNT(a.id) AS quizzes_taken,
  ROUND(AVG(CASE WHEN a.totalPoints > 0
    THEN (a.score / a.totalPoints * 100) END), 1) AS avg_score_percentage,
  ROUND(AVG(a.score), 1) AS avg_raw_score
FROM `User` u
JOIN `Attempt` a ON a.student_id = u.id
WHERE u.role = 'student' AND a.status = 'submitted'
GROUP BY u.id, u.name
ORDER BY avg_score_percentage DESC;

-- ============================================================
-- QUERY 9: Completion Rate Per Quiz
-- Percentage of enrolled students who completed each quiz
-- ============================================================
SELECT
  q.id,
  q.title,
  (SELECT COUNT(*) FROM `User` WHERE role = 'student') AS total_students,
  COUNT(DISTINCT a.student_id) AS students_attempted,
  ROUND(
    COUNT(DISTINCT a.student_id) /
    (SELECT COUNT(*) FROM `User` WHERE role = 'student') * 100
  , 1) AS completion_rate
FROM `Quiz` q
LEFT JOIN `Attempt` a ON a.quiz_id = q.id AND a.status = 'submitted'
GROUP BY q.id, q.title;

-- ============================================================
-- QUERY 10: Hardest Questions (lowest correct rate)
-- Find questions with the lowest correct answer percentage
-- ============================================================
SELECT
  q.id,
  q.questionText,
  q.type,
  qb.title AS bank_name,
  COUNT(aa.id) AS times_answered,
  ROUND(
    SUM(CASE WHEN aa.isCorrect = TRUE THEN 1 ELSE 0 END) / COUNT(aa.id) * 100
  , 1) AS correct_rate
FROM `Question` q
JOIN `QuestionBank` qb ON qb.id = q.bank_id
JOIN `AttemptAnswer` aa ON aa.question_id = q.id
JOIN `Attempt` a ON a.id = aa.attempt_id AND a.status = 'submitted'
GROUP BY q.id, q.questionText, q.type, qb.title
HAVING COUNT(aa.id) > 0
ORDER BY correct_rate ASC
LIMIT 5;
