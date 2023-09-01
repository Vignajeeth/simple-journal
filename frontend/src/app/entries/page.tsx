"use client";

import { useState, useEffect } from "react";
import { EntryBase } from "./EntryBase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface Template {
  id: number;
  name: string;
}

interface Question {
  id: number;
  templateId: number;
  text: string;
}

function App() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const searchParams = useSearchParams();
  const dateId: string = searchParams.get("id") || "20200101";
  const selectedDate =
    dateId.substring(0, 4) +
    "-" +
    dateId.substring(4, 6) +
    "-" +
    dateId.substring(6);

  const defaultEntry: EntryBase = {
    entry_content: "",
    mood: 4,
    entry_date: new Date(selectedDate),
  };
  const [entry, setEntry] = useState<EntryBase>(defaultEntry);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setTemplates([
      { id: 1, name: "Exercise" },
      { id: 2, name: "Work" },
      { id: 3, name: "Personal" },
    ]);
    setQuestions([
      { id: 1, templateId: 1, text: "Exercise Q1" },
      { id: 2, templateId: 1, text: "Exercise Q2" },
      { id: 3, templateId: 2, text: "Work Q1" },
      { id: 4, templateId: 2, text: "Work Q2" },
      { id: 5, templateId: 3, text: "Personal Q1" },
    ]);
  }, []);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplates((prevSelected) => {
      if (prevSelected.includes(templateId)) {
        return prevSelected.filter((id) => id !== templateId);
      } else {
        return [...prevSelected, templateId];
      }
    });

    setSelectedQuestions((prevSelected) => {
      if (selectedTemplates.includes(templateId)) {
        return prevSelected.filter((x) => x.templateId !== templateId);
      } else {
        return prevSelected.concat(
          questions.filter((x) => templateId == x.templateId)
        );
      }
    });

    console.log(selectedTemplates);
    console.log(selectedQuestions);
    // console.log(questions);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const combinedEntryContent = selectedQuestions
      .map(
        (question) =>
          `<question>${question.text}</question>${answers[question.id] || ""}`
      )
      .join(" ");

    try {
      const res = await fetch("http://localhost:8000/entries/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry_date: entry.entry_date,
          mood: Number(entry.mood),
          entry_content: combinedEntryContent,
        }),
      });

      if (res.ok) {
        setEntry(defaultEntry);
        router.push(`/entries/${dateId}`);
      } else {
        setMessage("Entry failed");
      }
    } catch (err) {
      console.error("Error creating entry:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({
      ...entry,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setEntry({
      ...defaultEntry,
    });
    setSelectedTemplates([]);
    setQuestions([]);
    setAnswers({});
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="date"
            name="entry_date"
            value={selectedDate}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="mood"
            value={entry.mood}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Select Templates:</label>
          {templates.map((template) => (
            <div key={template.id}>
              <input
                type="checkbox"
                name={`template-${template.id}`}
                checked={selectedTemplates.includes(template.id)}
                onChange={() => handleTemplateChange(template.id)}
              />
              <label>{template.name}</label>
            </div>
          ))}
        </div>

        {selectedQuestions.map((question) => (
          <div key={question.id}>
            <label>{question.text}</label>
            <input
              type="text"
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          </div>
        ))}

        <div>
          <button type="submit">Create</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
          <Link href="/">
            <p>Go to Home!</p>
          </Link>
        </div>
        <div className="message">{message && <p>{message}</p>}</div>
      </form>
    </div>
  );
}

export default App;
