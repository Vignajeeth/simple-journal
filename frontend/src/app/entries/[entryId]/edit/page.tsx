"use client";

import React, { useState, useEffect } from "react";
import { EntryBase } from "../../EntryBase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EditEntryPage = ({ params }: { params: { entryId: string } }) => {
  const router = useRouter();
  const id = params.entryId;

  const [entry, setEntry] = useState<EntryBase>({
    entry_content: "",
    mood: 4,
    entry_date: new Date(),
  });

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`http://localhost:8000/entries/${id}`);
        const data = await response.json();
        setEntry(data);
      } catch (error) {
        console.error("Error fetching entry:", error);
      }
    };

    fetchEntry();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8000/entries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry_date: entry.entry_date,
          mood: Number(entry.mood),
          entry_content: entry.entry_content,
        }),
      });

      if (response.ok) {
        router.push(`/entries/${id}`);
      } else {
        console.error("Failed to update entry");
      }
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntry({
      ...entry,
      [e.target.name]: e.target.value,
    });
  };
  const date = new Date(entry.entry_date);

  return (
    <>
      <h1>Edit Entry</h1>
      <div>
        <label>Date: {date.toISOString().substring(0, 10)}</label>
      </div>
      <div>
        <label>Mood:</label>
        <input
          type="number"
          name="mood"
          value={entry.mood}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Content:</label>
        <input
          type="text"
          name="entry_content"
          value={entry.entry_content}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <button onClick={handleUpdate}>Update</button>
        <Link href={`/entries/${id}`}>
          <p>Cancel</p>
        </Link>
      </div>
    </>
  );
};

export default EditEntryPage;
