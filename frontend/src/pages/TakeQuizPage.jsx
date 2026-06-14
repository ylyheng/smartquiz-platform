import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function TakeQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchQuiz = useCallback(async () => {
    try {
      const q = await api.get(`/quizzes/${quizId}`);
      setQuiz(q.data.quiz);
    } catch (e) { navigate('/dashboard'); }
  }, [quizId, navigate]);

  const startOrResume = useCallback(async () => {
    try {
      const res = await api.post(`/quizzes/${quizId}/attempts/start`);
      const att = res.data.attempt;
      setAttempt(att);
      setTimeLeft(res.data.quizTimeLimit * 60);

      const initial = {};
      att.answers.forEach(a => {
        if (a.answer) initial[a.questionId] = a.answer;
      });
      setAnswers(initial);
    } catch (e) { alert(e.message) }
    finally { setLoading(false) }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
    startOrResume();
  }, [fetchQuiz, startOrResume]);

  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) { handleSubmit(); return }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/attempts/${attempt.id}/submit`, { answers });
      setAttempt(res.data.attempt);
      setSubmitted(true);
      navigate(`/results/${attempt.id}`, { replace: true });
    } catch (e) {
      if (!auto) alert(e.message);
      setSubmitting(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="loading-screen">Preparing quiz...</div>;
  if (!attempt || !quiz) return null;

  return (
    <div className="page-container take-quiz">
      <div className="quiz-header-bar">
        <div>
          <h1>{quiz.title}</h1>
          <p>{quiz.description}</p>
        </div>
        <div className="quiz-timer">
          <span className={`timer-display ${timeLeft < 120 ? 'timer-warning' : ''}`}>
            {formatTime(timeLeft)}
          </span>
          {timeLeft < 120 && <span className="timer-alert">Time is running out!</span>}
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSubmit() }}>
        {attempt.answers.map((aa, i) => (
          <div key={aa.id} className="card question-block">
            <div className="q-block-header">
              <span className="badge">Q{i + 1}</span>
              <span className="badge badge-points">{aa.question.points} pt</span>
              <span className="badge badge-type">{aa.question.type === 'mcq' ? 'MCQ' : 'Short Answer'}</span>
            </div>
            <p className="q-block-text">{aa.question.questionText}</p>

            {aa.question.type === 'mcq' && aa.question.options && (
              <div className="mcq-options">
                {aa.question.options.split('\n').filter(Boolean).map((opt, oi) => {
                  const letter = opt.trim().charAt(0);
                  return (
                    <label key={oi} className={`mcq-option ${answers[aa.questionId] === letter ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name={`q_${aa.questionId}`}
                        value={letter}
                        checked={answers[aa.questionId] === letter}
                        onChange={() => handleAnswerChange(aa.questionId, letter)}
                      />
                      <span>{opt.trim()}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {aa.question.type === 'short-answer' && (
              <textarea
                className="sa-input"
                value={answers[aa.questionId] || ''}
                onChange={e => handleAnswerChange(aa.questionId, e.target.value)}
                placeholder="Type your answer..."
                rows={3}
              />
            )}
          </div>
        ))}

        <div className="quiz-submit-bar">
          <span>{attempt.answers.length} questions</span>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
}
