"use client";

import React, { useState, useEffect } from "react";
import { EntryBase } from "./entries/EntryBase";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
/**
 * Compares two dates and finds if they are the same day.
 */
function isSameDate(d1: Date, d2: string): boolean {
  const date1 = new Date(d1).setHours(0, 0, 0, 0);
  const date2 = new Date(d2).setHours(0, 0, 0, 0);
  return date1 - date2 === 0;
}

function parseDate(d: Date): string {
  // console.log("inside parse date: ", d.toLocaleDateString());
  const shiftInHours = 6;
  const shiftDate = new Date(d.getTime() + shiftInHours * 60 * 60 * 1000);
  // console.log(shiftDate.toISOString().substring(0, 10).replaceAll("-", ""));
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
    const fetchedEntries = await fetch("http://localhost:8000/entries/");
    const journalEntries = await fetchedEntries.json();

    setEntriesThisMonth(journalEntries);
  };

  /**
   * Style the calendar only in month view
   */

  const filledDates: number[] = entriesThisMonth.map((e) =>
    new Date(e.entry_date).setHours(0, 0, 0, 0)
  );

  function tileClassName({ date, view }: { date: string; view: string }) {
    if (view === "month") {
      if (filledDates.find((entryDate) => isSameDate(entryDate, date))) {
        return "bg-blue-800	";
      }
    }
  }

  function processClickDay(value: Date, event) {
    const entryId: string = parseDate(value);

    if (filledDates.includes(value.setHours(0, 0, 0, 0))) {
      /** conditions to write about post or get.*/

      router.push("/entries/" + entryId);
      // router.push(`/entries/${entryId}`);
    } else {
      router.push("/entries/?id=" + entryId);
    }
  }
  // console.log(filledDates);

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
