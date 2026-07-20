import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartQuiz Platform API',
      version: '1.0.0',
      description: 'REST API for the SmartQuiz Assessment Platform — manages question banks, quizzes, attempts, and analytics.',
      contact: { name: 'SmartQuiz Team' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['lecturer', 'student'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        QuestionBank: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Question: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            bankId: { type: 'integer' },
            type: { type: 'string', enum: ['mcq', 'true-false'] },
            questionText: { type: 'string' },
            options: { type: 'string', nullable: true },
            correctAnswer: { type: 'string' },
            explanation: { type: 'string', nullable: true },
            mediaUrl: { type: 'string', nullable: true },
            points: { type: 'integer', default: 1 },
          },
        },
        Quiz: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            lecturerId: { type: 'integer' },
            timeLimit: { type: 'integer' },
            shuffle: { type: 'boolean' },
            showResults: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Attempt: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            quizId: { type: 'integer' },
            studentId: { type: 'integer' },
            score: { type: 'integer', nullable: true },
            totalPoints: { type: 'integer', nullable: true },
            status: { type: 'string', enum: ['in-progress', 'submitted'] },
            startedAt: { type: 'string', format: 'date-time' },
            submittedAt: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
