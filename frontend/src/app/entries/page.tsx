"use client";
import { useState, useEffect } from "react";
import { EntryBase } from "./EntryBase";

function App() {
  const [entries, setEntries] = useState<EntryBase[]>([]);
  const [defaultEntry, setDefaultEntry] = useState<EntryBase>({
    entry_content: "",
    mood: 4,
    entry_date: new Date(),
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const fetchedEntries = await fetch("http://localhost:8000/entries/");
    const journalEntries = await fetchedEntries.json();

    setEntries(journalEntries);
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("http://localhost:8000/entries/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry_date: defaultEntry.entry_date,
          mood: Number(defaultEntry.mood),
          entry_content: defaultEntry.entry_content,
        }),
      });
      // let resJson = await res.json();
      // console.log(resJson.body);
      if (res.status === 200) {
        setDefaultEntry({
          entry_content: "",
          mood: 4,
          entry_date: new Date(),
        });
        setMessage("Entry saved successfully");
      } else {
        setMessage("Entry failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultEntry({
      ...defaultEntry,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="entry_date"
          value={defaultEntry.entry_date.toString()}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="entry_content"
          value={defaultEntry.entry_content}
          placeholder="Content"
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="mood"
          value={defaultEntry.mood}
          onChange={handleInputChange}
        />

        <button type="submit">Create</button>
        <option>asas</option>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
      <ul>
        {entries.map((entry) => (
          <li key={entry.entry_date.toString()}>
            <strong>{entry.entry_content}</strong>
            <p>Mood: {entry.mood}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
