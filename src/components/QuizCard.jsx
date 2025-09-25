export default function QuizCard({quiz, onSubmit}) {
  return (
    <div className="space-y-4">
      {quiz?.questions?.map((q, qi) => (
        <div key={qi} className="p-4 rounded-xl border">
          <p className="font-medium">{qi+1}. {q.text}</p>
          <div className="mt-2 space-y-2">
            {q.choices.map((c, ci) => (
              <label key={ci} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={`q-${qi}`} value={ci} className="radio" />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={onSubmit} className="btn btn-primary">Submit Quiz</button>
    </div>
  );
}
