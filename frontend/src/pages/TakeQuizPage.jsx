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
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

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
    } catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
    startOrResume();
  }, [fetchQuiz, startOrResume]);

  useEffect(() => {
    if (timeLeft === null || submitted) return;
    if (timeLeft <= 0) { handleSubmit(true); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    setShowConfirm(false);
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
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => Object.keys(answers).length;
  const getProgress = () => attempt ? (getAnsweredCount() / attempt.answers.length) * 100 : 0;

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="quiz-loading__spinner" />
        <p>Preparing your quiz...</p>
      </div>
    );
  }

  if (!attempt || !quiz) return null;

  const currentAnswer = attempt.answers[activeQuestion];
  const answered = getAnsweredCount();
  const total = attempt.answers.length;

  return (
    <div className="tq">
      {/* Header */}
      <header className="tq-header">
        <div className="tq-header__left">
          <button className="tq-back" onClick={() => navigate('/dashboard')}>
            &larr; Exit
          </button>
          <div className="tq-header__title">
            <h1>{quiz.title}</h1>
            <span className="tq-header__count">{answered}/{total} answered</span>
          </div>
        </div>
        <div className="tq-header__timer">
          <span className={timeLeft < 120 ? 'tq-timer tq-timer--danger' : 'tq-timer'}>
            Time: {formatTime(timeLeft)}
          </span>
          {timeLeft < 120 && <span className="tq-timer-warn">Running out!</span>}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="tq-progress">
        <div className="tq-progress__bar" style={{ width: `${getProgress()}%` }} />
      </div>

      <div className="tq-body">
        {/* Question Nav */}
        <aside className="tq-nav">
          <h3>Questions</h3>
          <div className="tq-nav__grid">
            {attempt.answers.map((aa, i) => (
              <button
                key={aa.id}
                className={`tq-nav__btn ${answers[aa.questionId] ? 'tq-nav__btn--done' : ''} ${i === activeQuestion ? 'tq-nav__btn--active' : ''}`}
                onClick={() => setActiveQuestion(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>

        {/* Question */}
        <main className="tq-content">
          {currentAnswer && (
            <div className="tq-question">
              <div className="tq-question__head">
                <span className="tq-question__num">Question {activeQuestion + 1} of {total}</span>
                <span className="tq-question__pts">{currentAnswer.question.points} pt{currentAnswer.question.points !== 1 ? 's' : ''}</span>
              </div>

              <p className="tq-question__text">{currentAnswer.question.questionText}</p>

              {currentAnswer.question.type === 'mcq' && currentAnswer.question.options && (
                <div className="tq-options">
                  {currentAnswer.question.options.split('\n').filter(Boolean).map((opt, oi) => {
                    const letter = opt.trim().charAt(0);
                    const isSelected = answers[currentAnswer.questionId] === letter;
                    return (
                      <label key={oi} className={`tq-opt ${isSelected ? 'tq-opt--selected' : ''}`}>
                        <input
                          type="radio"
                          name={`q_${currentAnswer.questionId}`}
                          value={letter}
                          checked={isSelected}
                          onChange={() => handleAnswerChange(currentAnswer.questionId, letter)}
                        />
                        <span className="tq-opt__letter">{letter}</span>
                        <span className="tq-opt__text">{opt.trim().substring(2).trim()}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {currentAnswer.question.type === 'true-false' && (
                <div className="tq-tf">
                  {['True', 'False'].map(val => (
                    <label key={val} className={`tq-tf__opt ${answers[currentAnswer.questionId] === val ? 'tq-tf__opt--selected' : ''}`}>
                      <input
                        type="radio"
                        name={`q_${currentAnswer.questionId}`}
                        value={val}
                        checked={answers[currentAnswer.questionId] === val}
                        onChange={() => handleAnswerChange(currentAnswer.questionId, val)}
                      />
                      <span>{val}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Nav Buttons */}
          <div className="tq-actions">
            <button
              className="tq-btn tq-btn--outline"
              disabled={activeQuestion === 0}
              onClick={() => setActiveQuestion(p => p - 1)}
            >
              Previous
            </button>
            {activeQuestion < total - 1 ? (
              <button className="tq-btn tq-btn--primary" onClick={() => setActiveQuestion(p => p + 1)}>
                Next
              </button>
            ) : (
              <button className="tq-btn tq-btn--submit" onClick={() => setShowConfirm(true)} disabled={submitting}>
                Submit Quiz
              </button>
            )}
          </div>
        </main>
      </div>

      {showConfirm && (
        <div className="tq-confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="tq-confirm" onClick={e => e.stopPropagation()}>
            <h3>Submit Quiz?</h3>
            <p>
              You answered <strong>{getAnsweredCount()} of {total}</strong> questions.
              {getAnsweredCount() < total && (
                <span className="tq-confirm__warn"> {total - getAnsweredCount()} unanswered.</span>
              )}
            </p>
            <div className="tq-confirm__btns">
              <button className="tq-btn tq-btn--outline" onClick={() => setShowConfirm(false)}>Go Back</button>
              <button className="tq-btn tq-btn--submit" onClick={() => handleSubmit()} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
