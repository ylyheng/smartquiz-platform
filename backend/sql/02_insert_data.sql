-- ============================================================
-- SmartQuiz Platform - Sample Data Insertion Script
-- Database: MySQL
-- ============================================================

USE smartquiz_platform_db;

-- ============================================================
-- 1. Users (Password for all: password123)
-- ============================================================
-- bcrypt hash of 'password123' with 10 rounds
INSERT INTO `User` (`name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('Dr. Sarah Chen', 'lecturer@smartquiz.edu', '$2a$10$rQEY7QHhK6v0r6qGQGqGqOe0r6qGQGqGqOe0r6qGQGqGqOe0r6qG', 'lecturer', NOW(3), NOW(3)),
('John Smith', 'student1@smartquiz.edu', '$2a$10$rQEY7QHhK6v0r6qGQGqGqOe0r6qGQGqGqOe0r6qGQGqGqOe0r6qG', 'student', NOW(3), NOW(3)),
('Emily Johnson', 'student2@smartquiz.edu', '$2a$10$rQEY7QHhK6v0r6qGQGqGqOe0r6qGQGqGqOe0r6qGQGqGqOe0r6qG', 'student', NOW(3), NOW(3)),
('Michael Lee', 'student3@smartquiz.edu', '$2a$10$rQEY7QHhK6v0r6qGQGqGqOe0r6qGQGqGqOe0r6qGQGqGqOe0r6qG', 'student', NOW(3), NOW(3));

-- ============================================================
-- 2. Question Banks
-- ============================================================
INSERT INTO `QuestionBank` (`title`, `description`, `createdAt`, `updatedAt`) VALUES
('Data Structures & Algorithms', 'Fundamental concepts of data structures and algorithm analysis', NOW(3), NOW(3)),
('Discrete Mathematics', 'Logic, sets, relations, and graph theory', NOW(3), NOW(3));

-- ============================================================
-- 3. Questions
-- ============================================================

-- Bank 1: Data Structures & Algorithms
INSERT INTO `Question` (`bankId`, `type`, `questionText`, `options`, `correctAnswer`, `explanation`, `points`, `createdAt`, `updatedAt`) VALUES
(1, 'mcq', 'What is the time complexity of binary search on a sorted array of n elements?',
 'A. O(n)\nB. O(log n)\nC. O(n log n)\nD. O(1)',
 'B', 'Binary search halves the search space with each comparison, resulting in O(log n) time complexity.', 2, NOW(3), NOW(3)),

(1, 'mcq', 'Which data structure uses FIFO (First In, First Out) ordering?',
 'A. Stack\nB. Queue\nC. Binary Tree\nD. Hash Table',
 'B', 'A queue follows FIFO ordering where the first element inserted is the first one removed.', 1, NOW(3), NOW(3)),

(1, 'true-false', 'A binary search tree (BST) guarantees O(log n) search time in all cases.',
 NULL, 'False', 'A BST can degenerate into a linked list in the worst case (sorted input), resulting in O(n) search time.', 2, NOW(3), NOW(3)),

(1, 'mcq', 'What is the space complexity of merge sort?',
 'A. O(1)\nB. O(log n)\nC. O(n)\nD. O(n log n)',
 'C', 'Merge sort requires O(n) additional space for the temporary arrays used during the merge step.', 2, NOW(3), NOW(3)),

(1, 'true-false', 'A stack data structure operates on the LIFO (Last In, First Out) principle.',
 NULL, 'True', 'A stack always removes the most recently added element first, following LIFO ordering.', 1, NOW(3), NOW(3));

-- Bank 2: Discrete Mathematics
INSERT INTO `Question` (`bankId`, `type`, `questionText`, `options`, `correctAnswer`, `explanation`, `points`, `createdAt`, `updatedAt`) VALUES
(2, 'mcq', 'Which of the following is NOT a valid logical connective?',
 'A. AND\nB. OR\nC. IMPLIES\nD. DIVIDES',
 'D', 'AND, OR, and IMPLIES are standard logical connectives. DIVIDES is a mathematical relation, not a logical connective.', 1, NOW(3), NOW(3)),

(2, 'mcq', 'What is the negation of the statement "For all x, P(x)"?',
 'A. For all x, not P(x)\nB. There exists x such that not P(x)\nC. There exists x such that P(x)\nD. Not P(x) for some x',
 'B', 'The negation of a universal quantifier is an existential quantifier with the negated predicate.', 2, NOW(3), NOW(3)),

(2, 'true-false', 'Every relation that is symmetric and transitive is also reflexive.',
 NULL, 'False', 'A relation can be symmetric and transitive without being reflexive. The empty relation on a non-empty set is a counterexample.', 3, NOW(3), NOW(3));

-- ============================================================
-- 4. Quizzes
-- ============================================================
INSERT INTO `Quiz` (`title`, `description`, `lecturerId`, `timeLimit`, `shuffle`, `showResults`, `createdAt`, `updatedAt`) VALUES
('Data Structures Midterm', 'Covers arrays, linked lists, stacks, queues, and basic tree operations', 1, 30, TRUE, TRUE, NOW(3), NOW(3)),
('Discrete Math Quiz 1', 'Logic and proof techniques', 1, 20, FALSE, TRUE, NOW(3), NOW(3));

-- ============================================================
-- 5. Quiz-Question Mappings
-- ============================================================
INSERT INTO `QuizQuestion` (`quizId`, `questionId`, `order`) VALUES
(1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 4), (1, 5, 5),
(2, 6, 1), (2, 7, 2), (2, 8, 3);

-- ============================================================
-- 6. Student Attempts
-- ============================================================
INSERT INTO `Attempt` (`quizId`, `studentId`, `score`, `totalPoints`, `startedAt`, `submittedAt`, `status`) VALUES
(1, 2, 7, 8, '2026-07-10 09:00:00.000', '2026-07-10 09:18:00.000', 'submitted'),
(1, 3, 5, 8, '2026-07-10 09:05:00.000', '2026-07-10 09:28:00.000', 'submitted'),
(2, 2, 5, 6, '2026-07-12 14:00:00.000', '2026-07-12 14:12:00.000', 'submitted');

-- ============================================================
-- 7. Attempt Answers
-- ============================================================

-- Attempt 1 (John - Quiz 1): Score 7/8
INSERT INTO `AttemptAnswer` (`attemptId`, `questionId`, `answer`, `isCorrect`, `score`, `feedback`) VALUES
(1, 1, 'B', TRUE, 2, 'Correct!'),
(1, 2, 'B', TRUE, 1, 'Correct!'),
(1, 3, 'False', TRUE, 2, 'Correct!'),
(1, 4, 'A', FALSE, 0, 'Incorrect. Merge sort requires O(n) space.'),
(1, 5, 'True', TRUE, 1, 'Correct!');

-- Attempt 2 (Emily - Quiz 1): Score 5/8
INSERT INTO `AttemptAnswer` (`attemptId`, `questionId`, `answer`, `isCorrect`, `score`, `feedback`) VALUES
(2, 1, 'A', FALSE, 0, 'Incorrect. Binary search is O(log n).'),
(2, 2, 'B', TRUE, 1, 'Correct!'),
(2, 3, 'True', FALSE, 0, 'Incorrect. BST can degrade to O(n).'),
(2, 4, 'C', TRUE, 2, 'Correct!'),
(2, 5, 'True', TRUE, 1, 'Correct!');

-- Attempt 3 (John - Quiz 2): Score 5/6
INSERT INTO `AttemptAnswer` (`attemptId`, `questionId`, `answer`, `isCorrect`, `score`, `feedback`) VALUES
(3, 6, 'D', TRUE, 1, 'Correct!'),
(3, 7, 'B', TRUE, 2, 'Correct!'),
(3, 8, 'True', FALSE, 0, 'Incorrect. The empty relation is a counterexample.');
