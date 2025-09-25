// client/src/components/games/EarthquakeEscape.jsx
import React, { useState } from "react";

const rooms = [
  {
    id: "kitchen",
    name: "Kitchen",
    prompt: "You're in the kitchen when the tremors start. What's the safest immediate action?",
    choices: [
      { id: "drop-cover", text: "Drop and take cover under a sturdy table", points: 20, good: true },
      { id: "run-out", text: "Run outside immediately", points: -10, good: false },
      { id: "stand-near-window", text: "Stand near the window to check outside", points: -10, good: false }
    ]
  },
  {
    id: "living",
    name: "Living Room",
    prompt: "A heavy bookshelf is tipping — what's the best move?",
    choices: [
      { id: "get-under", text: "Get under a sturdy table and hold on", points: 20, good: true },
      { id: "grab-books", text: "Try to grab valuables", points: -15, good: false },
      { id: "step-back", text: "Step back and watch", points: -5, good: false }
    ]
  },
  {
    id: "corridor",
    name: "Corridor",
    prompt: "Corridor is partially blocked by debris — where do you go?",
    choices: [
      { id: "shelter", text: "Return to nearest safe room inside", points: 15, good: true },
      { id: "push-through", text: "Try to push through the debris", points: -15, good: false },
      { id: "climb-out", text: "Climb out of a window (unsafe)", points: -10, good: false }
    ]
  }
];

const Feedback = ({ good }) => (
  <div className={`p-3 rounded mt-3 ${good ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
    <strong>{good ? "Good choice!" : "Not safe"}</strong>
    <p className="text-sm mt-1">{good ? "This action reduces injury risk." : "This action increases risk — remember 'Drop, Cover, Hold On'."}</p>
  </div>
);

export default function EarthquakeEscape({ onExit }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastGood, setLastGood] = useState(null);

  const scene = rooms[index];

  function choose(choice) {
    setAnswered(true);
    setScore((s) => s + choice.points);
    setLastGood(choice.good);

    // store running score locally
    localStorage.setItem("earthquake-escape-score", String(score + choice.points));

    setTimeout(() => {
      setAnswered(false);
      setLastGood(null);
      if (index < rooms.length - 1) setIndex((i) => i + 1);
    }, 900);
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Earthquake Escape Challenge</h2>
          <div>
            <button className="text-sm text-gray-600 hover:underline" onClick={() => onExit && onExit()}>Exit</button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">Make safe choices to maximize your score.</p>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">{scene.name}</h3>
          <p className="text-gray-700 mb-4">{scene.prompt}</p>

          <div className="grid gap-3">
            {scene.choices.map((c) => (
              <button
                key={c.id}
                className={`text-left p-3 rounded border ${answered ? "opacity-60" : "hover:bg-gray-50"} ${c.good ? "border-green-100" : "border-gray-100"}`}
                onClick={() => !answered && choose(c)}
                disabled={answered}
              >
                <div className="flex justify-between items-center">
                  <span>{c.text}</span>
                  <span className="text-xs text-gray-500">{c.points > 0 ? `+${c.points}` : c.points}</span>
                </div>
              </button>
            ))}
          </div>

          {answered && <Feedback good={lastGood} />}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            <div className="text-sm text-gray-500">Progress</div>
            <div className="text-lg font-medium">{Math.min(index + 1, rooms.length)}/{rooms.length}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">Score</div>
            <div className="text-xl font-bold">{score}</div>
            {index === rooms.length - 1 && !answered && (
              <div className="mt-2">
                <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={() => { alert(`Final score: ${score}. Saved locally.`); onExit && onExit(); }}>
                  Finish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
