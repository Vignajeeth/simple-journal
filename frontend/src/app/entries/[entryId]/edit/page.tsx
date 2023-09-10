"use client";

import React, { useState, useEffect } from "react";
import { EntryBase, Mood } from "../../EntryBase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EditEntryPage = ({ params }: { params: { entryId: string } }) => {
  const router = useRouter();
  const id = params.entryId;

  const [entry, setEntry] = useState<EntryBase>({
    entry_content: "",
    mood: Mood.NORMAL,
    entry_date: new Date(),
  });

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(
          `http://` + process.env.hostname + `:8000/entries/${id}`
        );
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
      const response = await fetch(
        `http://` + process.env.hostname + `:8000/entries/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entry_date: entry.entry_date,
            mood: Number(entry.mood),
            entry_content: entry.entry_content,
          }),
        }
      );

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

  const handleMoodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    setEntry({
      ...entry,
      mood: selectedValue,
    });
  };

  const date = new Date(entry.entry_date);

  return (
    <div className="common-bg">
      <h1 className="header1">Edit Entry</h1>
      <div className="style-form">
        <div className="mb-4">
          <label className="block text-gray-100 text-center text-xl pb-5">
            {date.toDateString()}
          </label>
        </div>
        <div className="mb-4">
          <select
            className="textarea1 mt-2 "
            value={entry.mood}
            onChange={handleMoodChange}
          >
            {Object.values(Mood)
              .slice(7)
              .map((key) => (
                <option key={key} value={key}>
                  {Mood[key]}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <textarea
            type=""
            name="entry_content"
            value={entry.entry_content}
            onChange={handleInputChange}
            placeholder="Entry Content"
            spellCheck="true"
            rows={9}
            className="textarea1 "
          />
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleUpdate} className="bg-green-600 btn">
            Update
          </button>
          <Link href={`/entries/${id}`}>
            <p className="text-red-600 cursor-pointer">Cancel</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditEntryPage;
