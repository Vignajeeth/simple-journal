"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
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

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://` + process.env.hostname + `:8000/entries/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entry),
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

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEntry({
      ...entry,
      [e.target.name]: e.target.value,
    });
  };

  const handleMoodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10);
    setEntry({
      ...entry,
      mood: selectedValue,
    });
  };

  const formattedDate = new Date(entry.entry_date).toDateString();

  return (
    <div className="common-bg">
      <h1 className="header1">Edit Entry</h1>
      <div className="style-form">
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-100 text-center text-xl pb-5">
              {formattedDate}
            </label>
            <select
              className="textarea1 mt-2"
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
            <textarea
              name="entry_content"
              value={entry.entry_content}
              onChange={handleInputChange}
              placeholder="Entry Content"
              spellCheck={true}
              rows={9}
              className="textarea1"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button type="submit" className="bg-green-600 btn">
              Update
            </button>
            <Link href={`/entries/${id}`}>
              <p className="text-red-600 cursor-pointer">Cancel</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEntryPage;
