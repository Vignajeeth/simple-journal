"use client";
import { useState } from "react";
import { EntryBase } from "./EntryBase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function App() {
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const dateId = searchParams.get("id");
  const selectedDate =
    dateId.substring(0, 4) +
    "-" +
    dateId.substring(4, 6) +
    "-" +
    dateId.substring(6);

  const defaultEntry = {
    entry_content: "",
    mood: 4,
    entry_date: new Date(selectedDate),
  };
  const [entry, setEntry] = useState<EntryBase>(defaultEntry);

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
          entry_date: entry.entry_date,
          mood: Number(entry.mood),
          entry_content: entry.entry_content,
        }),
      });
      // let resJson = await res.json();
      // console.log(resJson.body());
      if (res.status === 200) {
        setEntry({
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
    setEntry({
      ...entry,
      [e.target.name]: e.target.value,
    });
  };

  function handleReset() {
    setEntry({
      ...defaultEntry,
      entry_date: defaultEntry.entry_date, // Set the date to the default value
    });
  }

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
          <input
            type="text"
            name="entry_content"
            value={entry.entry_content}
            placeholder="Content"
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">Create</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
          <Link href="/">
            <p>Go to Home!</p>
          </Link>
        </div>
        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}

export default App;
