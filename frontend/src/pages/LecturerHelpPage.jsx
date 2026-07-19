import { useState } from 'react';
import LecturerShell from '../components/layout/LecturerShell';
import { HelpCircle, BookOpen, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I create a new quiz?',
    a: 'Navigate to "Create Quiz" in the sidebar. Select questions from your Question Banks, set a time limit, and choose whether to shuffle questions and show results to students.'
  },
  {
    q: 'How do I add questions to a question bank?',
    a: 'Go to "Question Bank" in the sidebar, open or create a bank, then click "Add Question". You can add multiple-choice (MCQ) or true/false questions with correct answers and explanations.'
  },
  {
    q: 'Can I see which students completed a quiz?',
    a: 'Yes. Navigate to "Analytics" in the sidebar, select a quiz from the dropdown or click on its row, and you will see a full list of student submissions with their scores.'
  },
  {
    q: 'How does the average score work?',
    a: 'The average score on your dashboard is the mean percentage across all submitted attempts for all your quizzes combined.'
  },
  {
    q: 'Can I delete a quiz?',
    a: 'Yes. Go to "Quizzes" in the sidebar, find the quiz, and click the trash icon in the Actions column. Be careful - this also deletes all student attempt records for that quiz.'
  },
  {
    q: 'How do I close a quiz so students cannot take it?',
    a: 'When creating a quiz, toggle "Show Results" off. This effectively closes student access. You can also manage this by deleting the quiz if needed.'
  },
];

export default function LecturerHelpPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Support ticket submitted!\n\nSubject: "${supportForm.subject}"\n\nOur team will respond within 24 hours.`);
    setSupportForm({ subject: '', message: '' });
  };

  return (
    <LecturerShell>
      <header className="lecturer-dashboard__header">
        <div>
          <h1>Help Center</h1>
          <p>Documentation, FAQs, and support for lecturers using SmartQuiz.</p>
        </div>
      </header>

      <div className="lecturer-help-grid">
        <div className="lecturer-help-faqs">
          <div className="lecturer-help-section-title">
            <HelpCircle size={18} />
            <span>Frequently Asked Questions</span>
          </div>

          {FAQS.map((item, idx) => (
            <div key={idx} className="lecturer-faq-item" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
              <div className="lecturer-faq-item__question">
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {openFaq === idx && (
                <div className="lecturer-faq-item__answer">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="lecturer-help-side">
          <div className="lecturer-help-card">
            <div className="lecturer-help-section-title">
              <BookOpen size={18} />
              <span>Quick Reference</span>
            </div>
            <ul className="lecturer-help-reference-list">
              <li><strong>Question Bank</strong> - Create and store questions by topic</li>
              <li><strong>Create Quiz</strong> - Assemble a quiz from your question banks</li>
              <li><strong>Quizzes</strong> - View, manage, and delete your quizzes</li>
              <li><strong>Analytics</strong> - Track student scores and participation</li>
              <li><strong>Active</strong> - quiz has at least one submission</li>
              <li><strong>Draft</strong> - quiz has no submissions yet</li>
              <li><strong>Closed</strong> - quiz results hidden from students</li>
            </ul>
          </div>

          <div className="lecturer-help-card">
            <div className="lecturer-help-section-title">
              <MessageSquare size={18} />
              <span>Submit a Support Ticket</span>
            </div>
            <p className="lecturer-help-card__sub">
              Having a technical issue? Our academic support team typically responds within one business day.
            </p>
            <form onSubmit={handleSubmit} className="lecturer-help-form">
              <div className="lecturer-form-group">
                <label>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Question import not working"
                  value={supportForm.subject}
                  onChange={e => setSupportForm({ ...supportForm, subject: e.target.value })}
                />
              </div>
              <div className="lecturer-form-group">
                <label>Describe the Issue</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Please include any error messages or steps to reproduce..."
                  value={supportForm.message}
                  onChange={e => setSupportForm({ ...supportForm, message: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="lecturer-help-submit-btn">
                <Send size={15} />
                <span>Send Ticket</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </LecturerShell>
  );
}
