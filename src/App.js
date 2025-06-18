import React, { useState, useEffect } from 'react';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/cat2024_slot2.json')
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error('Error loading questions:', err));
  }, []);

  const handleOptionChange = (qid, option) => {
    setAnswers({ ...answers, [qid]: option });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>CAT 2024 Slot 2 Exam Simulator</h1>

      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : submitted ? (
        <div>
          <h2>Submission Complete</h2>
          <p>You attempted {Object.keys(answers).length} out of {questions.length} questions.</p>
          <ul>
            {questions.map((q, idx) => (
              <li key={q.id}>
                <strong>Q{q.id}:</strong> {answers[q.id] || 'Not Answered'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <strong>Question {currentIndex + 1} of {questions.length}</strong>
            <p>{currentQuestion.question}</p>
            {currentQuestion.options.map((opt, idx) => (
              <div key={idx}>
                <label>
                  <input
                    type="radio"
                    name={`question_${currentQuestion.id}`}
                    value={opt}
                    checked={answers[currentQuestion.id] === opt}
                    onChange={() => handleOptionChange(currentQuestion.id, opt)}
                  />{' '}
                  {opt}
                </label>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <button onClick={() => setCurrentIndex(currentIndex - 1)} disabled={currentIndex === 0}>Previous</button>
            <button onClick={() => setCurrentIndex(currentIndex + 1)} disabled={currentIndex === questions.length - 1}>Next</button>
          </div>

          <div>
            <button onClick={handleSubmit}>Submit Test</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;