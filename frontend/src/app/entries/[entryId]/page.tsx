"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Entry } from "./Entry";
import Link from "next/link";

interface EntryPageProps {
  params: { entryId: string };
}

const EntryPage: React.FC<EntryPageProps> = ({ params }) => {
  const router = useRouter();
  const id = params.entryId;
  const [thisEntry, setThisEntry] = useState<Entry>({
    id: 20200101,
    entry_date: new Date("2020-01-01"),
    entry_content: "",
    mood: 4,
  });

  const getEntry = async () => {
    try {
      const resp = await fetch(`http://localhost:8000/entries/${id}`);
      const entry = await resp.json();
      setThisEntry(entry);
    } catch (error) {
      console.error("Error fetching entry:", error);
    }
  };

  useEffect(() => {
    getEntry();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/entries/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/entries/${id}/edit`);
  };

  const date = new Date(thisEntry.entry_date);

  return (
    <>
      <span>Date: {date.toDateString()}</span>
      <span>Mood: {thisEntry.mood}</span>
      <div>{thisEntry.entry_content}</div>
      <div>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleEdit}>Edit</button>
        <Link href="/">
          <p>Go to Home!</p>
        </Link>
      </div>
    </>
  );
};

export default EntryPage;
