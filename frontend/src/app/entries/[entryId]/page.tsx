"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Entry } from "./Entry";
import { Mood } from "../EntryBase";
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
    <div className="common-bg">
      <h1 className="header1">Entry Details</h1>
      <div className="style-form">
        <span className="block text-gray-100 text-center text-xl pb-5">
          {date.toDateString()}
        </span>
        <span className="block text-gray-100 text-center text-xl pb-5">
          {Mood[thisEntry.mood]}
        </span>
        <div className="mb-6 text-gray-100">{thisEntry.entry_content}</div>
        <div className="flex items-center space-x-4">
          <button onClick={handleDelete} className="bg-red-600 btn">
            Delete
          </button>
          <button onClick={handleEdit} className="bg-green-600 btn">
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
