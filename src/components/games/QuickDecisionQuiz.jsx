// client/src/components/games/QuickDecisionQuiz.jsx
import React, { useState } from "react";

const questions = [
  {
    id: 1,
    q: "During shaking, what should you do first?",
    choices: [
      { id: "a", text: "Run outside immediately", correct: false },
      { id: "b", text: "Drop, Cover, Hold On", correct: true },
      { id: "c", text: "Stand in a doorway", correct: false }
    ]
  },
  {
    id: 2,
    q: "After a quake, you smell gas. You should:",
    choices: [
      { id: "a", text: "Turn on the stove to check", correct: false },
      { id: "b", text: "Open windows and leave the building", correct: true },
      { id: "c", text: "Light a candle to find leak", correct: false }
    ]
  },
  {
    id: 3,
    q: "What does a 72-hour kit mean?",
    choices: [
      { id: "a", text: "Supplies for 3 days per person", correct: true },
      { id: "b", text: "Enough food for 72 people", correct: false },
      { id: "c", text: "Only water for pets", correct: false }
    ]
  }
];

export default function QuickDecisionQuiz({ onExit }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  function answer(choice) {
    if (answered) return;
    setAnswered(true);
    if (choice.correct) setScore((s) => s + 10);
    setTimeout(() => {
      setAnswered(false);
      if (index < questions.length - 1) setIndex((i) => i + 1);
    }, 800);
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Quick Decision Quiz</h2>
          <div>
            <button className="text-sm text-gray-600 hover:underline" onClick={() => onExit && onExit()}>Exit</button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">Answer correctly to earn points.</p>

        <div>
          <h3 className="font-semibold text-lg mb-2">Q{index + 1}. {questions[index].q}</h3>
          <div className="grid gap-3">
            {questions[index].choices.map((c) => (
              <button
                key={c.id}
                className={`p-3 rounded border ${answered ? "opacity-60" : "hover:bg-gray-50"}`}
                onClick={() => answer(c)}
                disabled={answered}
              >
                {c.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">Progress {index + 1}/{questions.length}</div>
          <div className="text-lg font-bold">Score: {score}</div>
        </div>

        {index === questions.length - 1 && !answered && (
          <div className="mt-4">
            <button
              className="px-3 py-2 bg-indigo-600 text-white rounded"
              onClick={() => { alert(`Quiz finished — score: ${score}`); onExit && onExit(); }}
            >
              Finish Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
