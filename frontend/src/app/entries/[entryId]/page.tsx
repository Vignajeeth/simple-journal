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
      const resp = await fetch(
        `http://` + process.env.hostname + `:8000/entries/${id}`
      );
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
      const response = await fetch(
        `http://` + process.env.hostname + `:8000/entries/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
    <div className="bg-gray-900 text-gray-100 px-8 py-10 shadow-lg min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Entry Details</h1>
      <div className="bg-gray-800 rounded-md p-8 mx-auto max-w-md">
        <span className="block mb-4 text-gray-100">
          Date: {date.toDateString()}
        </span>
        <span className="block mb-4 text-gray-100">Mood: {thisEntry.mood}</span>
        <div className="mb-6 text-gray-100">{thisEntry.entry_content}</div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDelete}
            className="bg-red-600 text-gray-100 px-4 py-2 rounded-md"
          >
            Delete
          </button>
          <button
            onClick={handleEdit}
            className="bg-green-600 text-gray-100 px-4 py-2 rounded-md"
          >
            Edit
          </button>
          <Link href="/">
            <p className="text-blue-600 cursor-pointer">Go to Home!</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
