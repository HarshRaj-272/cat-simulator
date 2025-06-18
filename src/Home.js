
// React + Tailwind-based CAT Simulator with Admin Panel + Slot Upload + UI Polish

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

const Home = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        const newSlot = {
          id: Date.now(),
          name: file.name.replace('.json', ''),
          questions: json.sections,
        };
        setSlots([...slots, newSlot]);
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleDelete = (id) => {
    setSlots(slots.filter((s) => s.id !== id));
    if (selectedSlot?.id === id) setSelectedSlot(null);
  };

  const startSimulator = (slot) => setSelectedSlot(slot);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">CAT Exam Simulator</h1>

      {!selectedSlot ? (
        <>
          <div className="flex gap-2 items-center mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Upload size={20} />
              <Input type="file" accept=".json" className="hidden" onChange={handleUpload} />
              <span className="text-blue-600">Upload Slot (JSON)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.map((slot) => (
              <Card key={slot.id} className="border p-4">
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">{slot.name}</h2>
                    <Button size="sm" onClick={() => handleDelete(slot.id)} variant="destructive">Delete</Button>
                  </div>
                  <Button onClick={() => startSimulator(slot)} className="w-full">Start</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Simulator slot={selectedSlot} onBack={() => setSelectedSlot(null)} />
      )}
    </div>
  );
};

const Simulator = ({ slot, onBack }) => {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [timer, setTimer] = useState(40 * 60); // 40 mins

  const section = slot.questions[sectionIndex];
  const question = section.questions[questionIndex];

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setShowScore(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleSelect = (val) => {
    setResponses({ ...responses, [`${section.name}-${questionIndex}`]: val });
  };

  const submitSection = () => setShowScore(true);

  const formatTime = () => `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`;

  const scoreSection = () => {
    let correct = 0, incorrect = 0, unattempted = 0;
    section.questions.forEach((q, i) => {
      const key = `${section.name}-${i}`;
      const given = responses[key];
      if (!given) unattempted++;
      else if (given === q.answer) correct++;
      else incorrect++;
    });
    return { correct, incorrect, unattempted, score: correct * 3 - incorrect };
  };

  return (
    <div className="space-y-4">
      <Button onClick={onBack}>⬅ Back</Button>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{slot.name} — {section.name}</h2>
        <span className="text-lg font-mono">⏱️ {formatTime()}</span>
      </div>

      {!showScore ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="font-semibold">Q{questionIndex + 1}. {question.text}</p>
            {question.choices.map((opt, i) => (
              <div key={i} className="ml-4 mt-2">
                <label>
                  <input type="radio" name="qopt" value={opt} checked={responses[`${section.name}-${questionIndex}`] === opt} onChange={() => handleSelect(opt)} /> {opt}
                </label>
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {section.questions.map((_, i) => (
              <Button key={i} variant={i === questionIndex ? 'default' : responses[`${section.name}-${i}`] ? 'secondary' : 'outline'} onClick={() => setQuestionIndex(i)}>{i + 1}</Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={submitSection}>Submit Section</Button>
            <Button onClick={() => setSectionIndex((i) => (i + 1) % slot.questions.length)}>Next Section ➡</Button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 p-4 rounded shadow">
          <h3 className="text-xl font-bold">Section Score</h3>
          <pre className="mt-2 text-sm">{JSON.stringify(scoreSection(), null, 2)}</pre>
          <Button onClick={() => setShowScore(false)}>Back to Section</Button>
        </div>
      )}
    </div>
  );
};

export default Home;
