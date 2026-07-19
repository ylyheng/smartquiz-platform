import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function QuizResultsPage() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/attempts/${attemptId}`);
        setAttempt(res.data.attempt);
      } catch (e) { alert(e.message) }
      finally { setLoading(false) }
    })();
  }, [attemptId]);

  if (loading) return <div className="loading-screen">Loading results...</div>;
  if (!attempt) return <div className="empty-state">Attempt not found</div>;

  const percentage = attempt.totalPoints
    ? Math.round((attempt.score / attempt.totalPoints) * 100)
    : 0;

  return (
    <div className="page-container">
      <div className="results-header card">
        <h1>{attempt.quiz.title} - Results</h1>
        <div className="score-display">
          <div className={`score-circle ${percentage >= 50 ? 'pass' : 'fail'}`}>
            <span className="score-pct">{percentage}%</span>
            <span className="score-frac">{attempt.score} / {attempt.totalPoints}</span>
          </div>
        </div>
      </div>

      {attempt.answers.map((aa, i) => (
        <div key={aa.id} className={`card answer-block ${aa.isCorrect === true ? 'correct' : aa.isCorrect === false ? 'wrong' : ''}`}>
          <div className="q-block-header">
            <span className="badge">Q{i + 1}</span>
            <span className="badge badge-points">{aa.question.points} pt</span>
            {aa.isCorrect === true && <span className="badge badge-correct">Correct</span>}
            {aa.isCorrect === false && <span className="badge badge-wrong">Incorrect</span>}
            {aa.isCorrect === null && <span className="badge badge-skip">Skipped</span>}
            {aa.score !== null && <span className="badge badge-score">Score: {aa.score}/{aa.question.points}</span>}
          </div>
          <p className="q-block-text"><strong>Q{i + 1}:</strong> {aa.question.questionText}</p>

          {aa.question.type === 'mcq' && aa.question.options && (
            <div className="mcq-options results-options">
              {aa.question.options.split('\n').filter(Boolean).map((opt, oi) => {
                const letter = opt.trim().charAt(0);
                const isSelected = aa.answer === letter;
                const isCorrectAns = aa.question.correctAnswer === letter;
                return (
                  <div key={oi}
                    className={`mcq-option ${isSelected ? 'selected' : ''} ${isCorrectAns ? 'correct-answer' : ''} ${isSelected && !isCorrectAns ? 'wrong-answer' : ''}`}
                  >
                    <span>{opt.trim()}</span>
                    {isCorrectAns && <span className="correct-mark">&#10003;</span>}
                  </div>
                );
              })}
            </div>
          )}

          {aa.question.type === 'true-false' && (
            <div className="tf-result">
              <p><strong>Your answer:</strong> {aa.answer || '(no answer)'}</p>
              <p><strong>Correct answer:</strong> {aa.question.correctAnswer}</p>
            </div>
          )}

          {aa.feedback && attempt.quiz.showResults && (
            <div className="feedback-box">
              <strong>Explanation:</strong> {aa.feedback}
            </div>
          )}
        </div>
      ))}

      <div className="results-nav">
        <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        <Link to={`/analytics/quiz/${attempt.quizId}`} className="btn-secondary">View Analytics</Link>
      </div>
    </div>
  );
}
