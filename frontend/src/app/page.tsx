"use client";

import { useState, useEffect } from "react";
import { EntryBase } from "./entries/EntryBase";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";

function parseDate(d: Date): string {
  const shiftInHours = 6;
  const shiftDate = new Date(d.getTime() + shiftInHours * 60 * 60 * 1000);
  return shiftDate.toISOString().substring(0, 10).replaceAll("-", "");
}

const IndexPage = () => {
  /**
   * Manual Date selection variable.
   * Journal Entries written this month to style calendar.
   */
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entriesThisMonth, setEntriesThisMonth] = useState<EntryBase[]>([]);

  /**
   * Fetching the entries this month.
   */

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    // TODO: Fetch only the required entries and not all
    try {
      const fetchedEntries = await fetch("http://localhost:8000/entries/");
      const journalEntries = await fetchedEntries.json();
      setEntriesThisMonth(journalEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  /**
   * Style the calendar only in month view
   */

  const filledDates: number[] = entriesThisMonth.map((e) =>
    new Date(e.entry_date).setHours(0, 0, 0, 0)
  );

  function tileClassName({ date, view }: { date: string; view: string }) {
    if (
      view === "month" &&
      filledDates.includes(new Date(date).setHours(0, 0, 0, 0))
    ) {
      return "bg-blue-800";
    }
  }

  function processClickDay(value: Date) {
    const entryId: string = parseDate(value);

    const isDateFilled = filledDates.includes(value.setHours(0, 0, 0, 0));

    const entryPath = isDateFilled
      ? `/entries/${entryId}`
      : `/entries/?id=${entryId}`;

    router.push(entryPath);
  }

  return (
    <div>
      <h1>Journal</h1>
      <div>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
          onClickDay={processClickDay}
        />
        <span className="bold">Selected Date:</span>{" "}
        {selectedDate.toDateString()}
      </div>
    </div>
  );
};

export default IndexPage;
