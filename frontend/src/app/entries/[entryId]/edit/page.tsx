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
  const date = new Date(entry.entry_date);

  return (
    <div className="bg-gray-900 text-gray-100 px-8 py-10 shadow-lg min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Entry</h1>
      <div className="bg-gray-800 rounded-md p-8 mx-auto max-w-md">
        <div className="mb-4">
          <label className="block text-gray-100">
            Date: {date.toISOString().substring(0, 10)}
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-100">Mood:</label>
          <input
            type="number"
            name="mood"
            value={entry.mood}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-gray-100 px-4 py-2 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-100">Content:</label>
          <input
            type="text"
            name="entry_content"
            value={entry.entry_content}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-gray-100 px-4 py-2 rounded-md"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-gray-100 px-4 py-2 rounded-md"
          >
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
