import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = await bcrypt.hash('password123', 10);

  const lecturer = await prisma.user.upsert({
    where: { email: 'lecturer@smartquiz.edu' },
    update: {},
    create: {
      name: 'Dr. Sarah Chen',
      email: 'lecturer@smartquiz.edu',
      password,
      role: 'lecturer',
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@smartquiz.edu' },
    update: {},
    create: {
      name: 'John Smith',
      email: 'student1@smartquiz.edu',
      password,
      role: 'student',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@smartquiz.edu' },
    update: {},
    create: {
      name: 'Emily Johnson',
      email: 'student2@smartquiz.edu',
      password,
      role: 'student',
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'student3@smartquiz.edu' },
    update: {},
    create: {
      name: 'Michael Lee',
      email: 'student3@smartquiz.edu',
      password,
      role: 'student',
    },
  });

  console.log('Users created:', { lecturer: lecturer.email, students: [student1.email, student2.email, student3.email] });

  const bankCS = await prisma.questionBank.create({
    data: {
      title: 'Data Structures & Algorithms',
      description: 'Fundamental concepts of data structures and algorithm analysis',
    },
  });

  const bankMath = await prisma.questionBank.create({
    data: {
      title: 'Discrete Mathematics',
      description: 'Logic, sets, relations, and graph theory',
    },
  });

  console.log('Question banks created:', [bankCS.title, bankMath.title]);

  const q1 = await prisma.question.create({
    data: {
      bankId: bankCS.id,
      type: 'mcq',
      questionText: 'What is the time complexity of binary search on a sorted array of n elements?',
      options: 'A. O(n)\nB. O(log n)\nC. O(n log n)\nD. O(1)',
      correctAnswer: 'B',
      explanation: 'Binary search halves the search space with each comparison, resulting in O(log n) time complexity.',
      points: 2,
    },
  });

  const q2 = await prisma.question.create({
    data: {
      bankId: bankCS.id,
      type: 'mcq',
      questionText: 'Which data structure uses FIFO (First In, First Out) ordering?',
      options: 'A. Stack\nB. Queue\nC. Binary Tree\nD. Hash Table',
      correctAnswer: 'B',
      explanation: 'A queue follows FIFO ordering where the first element inserted is the first one removed.',
      points: 1,
    },
  });

  const q3 = await prisma.question.create({
    data: {
      bankId: bankCS.id,
      type: 'true-false',
      questionText: 'A binary search tree (BST) guarantees O(log n) search time in all cases.',
      correctAnswer: 'False',
      explanation: 'A BST can degenerate into a linked list in the worst case (sorted input), resulting in O(n) search time. Self-balancing trees like AVL or Red-Black trees guarantee O(log n).',
      points: 2,
    },
  });

  const q4 = await prisma.question.create({
    data: {
      bankId: bankCS.id,
      type: 'mcq',
      questionText: 'What is the space complexity of merge sort?',
      options: 'A. O(1)\nB. O(log n)\nC. O(n)\nD. O(n log n)',
      correctAnswer: 'C',
      explanation: 'Merge sort requires O(n) additional space for the temporary arrays used during the merge step.',
      points: 2,
    },
  });

  const q5 = await prisma.question.create({
    data: {
      bankId: bankCS.id,
      type: 'true-false',
      questionText: 'A stack data structure operates on the LIFO (Last In, First Out) principle.',
      correctAnswer: 'True',
      explanation: 'A stack always removes the most recently added element first, following LIFO ordering.',
      points: 1,
    },
  });

  const q6 = await prisma.question.create({
    data: {
      bankId: bankMath.id,
      type: 'mcq',
      questionText: 'Which of the following is NOT a valid logical connective?',
      options: 'A. AND\nB. OR\nC. IMPLIES\nD. DIVIDES',
      correctAnswer: 'D',
      explanation: 'AND, OR, and IMPLIES are standard logical connectives. DIVIDES is a mathematical relation, not a logical connective.',
      points: 1,
    },
  });

  const q7 = await prisma.question.create({
    data: {
      bankId: bankMath.id,
      type: 'mcq',
      questionText: 'What is the negation of the statement "For all x, P(x)"?',
      options: 'A. For all x, not P(x)\nB. There exists x such that not P(x)\nC. There exists x such that P(x)\nD. Not P(x) for some x',
      correctAnswer: 'B',
      explanation: 'The negation of a universal quantifier is an existential quantifier with the negated predicate: ¬(∀x P(x)) ≡ ∃x ¬P(x).',
      points: 2,
    },
  });

  const q8 = await prisma.question.create({
    data: {
      bankId: bankMath.id,
      type: 'true-false',
      questionText: 'Every relation that is symmetric and transitive is also reflexive.',
      correctAnswer: 'False',
      explanation: 'A relation can be symmetric and transitive without being reflexive. For example, the empty relation on a non-empty set is symmetric and transitive but not reflexive.',
      points: 3,
    },
  });

  console.log('Questions created:', 8);

  const quiz1 = await prisma.quiz.create({
    data: {
      title: 'Data Structures Midterm',
      description: 'Covers arrays, linked lists, stacks, queues, and basic tree operations',
      lecturerId: lecturer.id,
      timeLimit: 30,
      shuffle: true,
      showResults: true,
    },
  });

  const quiz2 = await prisma.quiz.create({
    data: {
      title: 'Discrete Math Quiz 1',
      description: 'Logic and proof techniques',
      lecturerId: lecturer.id,
      timeLimit: 20,
      shuffle: false,
      showResults: true,
    },
  });

  await prisma.quizQuestion.createMany({
    data: [
      { quizId: quiz1.id, questionId: q1.id, order: 1 },
      { quizId: quiz1.id, questionId: q2.id, order: 2 },
      { quizId: quiz1.id, questionId: q3.id, order: 3 },
      { quizId: quiz1.id, questionId: q4.id, order: 4 },
      { quizId: quiz1.id, questionId: q5.id, order: 5 },
      { quizId: quiz2.id, questionId: q6.id, order: 1 },
      { quizId: quiz2.id, questionId: q7.id, order: 2 },
      { quizId: quiz2.id, questionId: q8.id, order: 3 },
    ],
  });

  console.log('Quizzes created:', [quiz1.title, quiz2.title]);

  const attempt1 = await prisma.attempt.create({
    data: {
      quizId: quiz1.id,
      studentId: student1.id,
      score: 7,
      totalPoints: 8,
      startedAt: new Date('2026-07-10T09:00:00Z'),
      submittedAt: new Date('2026-07-10T09:18:00Z'),
      status: 'submitted',
    },
  });

  const attempt2 = await prisma.attempt.create({
    data: {
      quizId: quiz1.id,
      studentId: student2.id,
      score: 5,
      totalPoints: 8,
      startedAt: new Date('2026-07-10T09:05:00Z'),
      submittedAt: new Date('2026-07-10T09:28:00Z'),
      status: 'submitted',
    },
  });

  const attempt3 = await prisma.attempt.create({
    data: {
      quizId: quiz2.id,
      studentId: student1.id,
      score: 5,
      totalPoints: 6,
      startedAt: new Date('2026-07-12T14:00:00Z'),
      submittedAt: new Date('2026-07-12T14:12:00Z'),
      status: 'submitted',
    },
  });

  await prisma.attemptAnswer.createMany({
    data: [
      { attemptId: attempt1.id, questionId: q1.id, answer: 'B', isCorrect: true, score: 2, feedback: 'Correct!' },
      { attemptId: attempt1.id, questionId: q2.id, answer: 'B', isCorrect: true, score: 1, feedback: 'Correct!' },
      { attemptId: attempt1.id, questionId: q3.id, answer: 'False', isCorrect: true, score: 2, feedback: 'Correct!' },
      { attemptId: attempt1.id, questionId: q4.id, answer: 'A', isCorrect: false, score: 0, feedback: 'Incorrect. Merge sort requires O(n) space.' },
      { attemptId: attempt1.id, questionId: q5.id, answer: 'True', isCorrect: true, score: 1, feedback: 'Correct!' },
      { attemptId: attempt2.id, questionId: q1.id, answer: 'A', isCorrect: false, score: 0, feedback: 'Incorrect. Binary search is O(log n).' },
      { attemptId: attempt2.id, questionId: q2.id, answer: 'B', isCorrect: true, score: 1, feedback: 'Correct!' },
      { attemptId: attempt2.id, questionId: q3.id, answer: 'True', isCorrect: false, score: 0, feedback: 'Incorrect. BST can degrade to O(n).' },
      { attemptId: attempt2.id, questionId: q4.id, answer: 'C', isCorrect: true, score: 2, feedback: 'Correct!' },
      { attemptId: attempt2.id, questionId: q5.id, answer: 'True', isCorrect: true, score: 1, feedback: 'Correct!' },
      { attemptId: attempt3.id, questionId: q6.id, answer: 'D', isCorrect: true, score: 1, feedback: 'Correct!' },
      { attemptId: attempt3.id, questionId: q7.id, answer: 'B', isCorrect: true, score: 2, feedback: 'Correct!' },
      { attemptId: attempt3.id, questionId: q8.id, answer: 'True', isCorrect: false, score: 0, feedback: 'Incorrect. The empty relation is a counterexample.' },
    ],
  });

  console.log('Attempts and answers created');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
