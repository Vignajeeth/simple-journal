"use client";

import { useState } from "react";
import { EntryBase } from "./EntryBase";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function App() {
  /**
   * Attributes
   */
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

  /**
   * Methods
   */
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          entry_content: entry.entry_content,
        }),
      });
      if (res.ok) {
        setEntry(defaultEntry);
        setMessage("Entry saved successfully");
        await sleep(1000); // Pause for a second so you see success message.

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
  };

  /**
   * Component
   */
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
        <div className="message">{message && <p>{message}</p>}</div>
      </form>
    </div>
  );
}

export default App;
