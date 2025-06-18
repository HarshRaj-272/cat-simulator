
import React, { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Load questions from public folder
  useEffect(() => {
    fetch("/cat2024_slot2.json")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
      });
  }, []);

  const handleOptionClick = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>CAT Exam Simulator</h1>
      {currentQuestion ? (
        <div>
          <h3>
            Q{currentQuestion.id}. {currentQuestion.question}
          </h3>
          <ul>
            {currentQuestion.options.map((opt, i) => (
              <li
                key={i}
                onClick={() => handleOptionClick(currentQuestion.id, opt)}
                style={{
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                  background:
                    answers[currentQuestion.id] === opt ? "#def" : "#f9f9f9",
                  padding: "0.5rem",
                  borderRadius: "5px",
                }}
              >
                {opt}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1rem" }}>
            {currentIndex > 0 && (
              <button onClick={() => setCurrentIndex(currentIndex - 1)}>
                Previous
              </button>
            )}
            {currentIndex < questions.length - 1 && (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                style={{ marginLeft: "1rem" }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}

export default App;
