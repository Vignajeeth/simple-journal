"use client";

import { useState, useEffect } from "react";
import { EntryBase, Mood } from "./EntryBase";
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
    mood: Mood.NORMAL,
    entry_date: new Date(selectedDate),
  };
  const [entry, setEntry] = useState<EntryBase>(defaultEntry);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [index: number]: string }>({});

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

  const handleTemplateChange = (templateId: number) => {
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

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const combinedEntryContent = selectedQuestions
      .map((question) => ` ${question.text} ${answers[question.id] || ""}`)
      .join(" ");
    try {
      const res = await fetch(
        "http://" + process.env.hostname + ":8000/entries/",
        {
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
        }
      );

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

  const handleMoodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    setEntry({
      ...entry,
      mood: selectedValue,
    });
  };

  const handleReset = () => {
    setEntry({
      ...defaultEntry,
    });
    setSelectedTemplates([]);
    setSelectedQuestions([]);
    setAnswers({});
  };

  return (
    <div className="common-bg">
      <h1 className="header1">Create Entry</h1>
      <div className="style-form">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-100 text-center text-xl pb-5">
              {new Date(selectedDate).toDateString()}
            </label>
            <select
              className=" textarea1 mt-2 "
              value={entry.mood}
              onChange={handleMoodChange}
            >
              {Object.values(Mood)
                .slice(7)
                .map((key: any) => (
                  <option key={key} value={key}>
                    {Mood[key]}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-4 text-gray-100">
              Select Templates:
            </label>
            <div className="flex space-x-4 mb-8 ">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className={`p-2  rounded-md ${
                    selectedTemplates.includes(template.id)
                      ? "bg-blue-600"
                      : "bg-gray-800"
                  }`}
                  onClick={() => handleTemplateChange(template.id)}
                >
                  <span className="text-gray-100">{template.name}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedQuestions.map((question) => (
            <div key={question.id} className="mb-4">
              <label className="block mb-2 text-gray-100">
                {question.text}
              </label>
              <textarea
                name="entry_content"
                value={answers[question.id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
                placeholder="Answer"
                spellCheck={true}
                rows={3}
                className="textarea1"
              />
            </div>
          ))}

          <div className="flex items-center space-x-4">
            <button type="submit" className="bg-green-600 btn">
              Create
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-red-600 btn"
            >
              Reset
            </button>
            <Link href="/">
              <p className="text-blue-600 cursor-pointer">Go to Home!</p>
            </Link>
          </div>
          <div className="message mt-4">
            {message && <p className="text-red-600">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
