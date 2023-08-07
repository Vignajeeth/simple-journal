"use client";
import { useState } from "react";

function App() {
  let today = new Date().toISOString().slice(0, 10);
  const [text, setText] = useState("");
  const [mood, setMood] = useState(4);
  const [date, setDate] = useState(today);
  const [message, setMessage] = useState("");

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
          entry_date: date,
          mood: mood,
          entry_content: text,
        }),
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setText("");
        setMood(4);
        setDate(today);
        setMessage("Entry saved successfully");
      } else {
        setMessage("Error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          value={text}
          placeholder="Content"
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="number"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
        />

        <button type="submit">Create</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}

export default App;
