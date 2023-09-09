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
      const fetchedEntries = await fetch(
        "http://" + process.env.hostname + ":8000/entries/"
      );
      const journalEntries = await fetchedEntries.json();
      setEntriesThisMonth(journalEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  /**
   * Style the calendar only in month view
   */

  const filledDates: { [index: number]: number } = entriesThisMonth.reduce(
    (acc: { [index: number]: number }, cv) => {
      acc[new Date(cv.entry_date).setHours(0, 0, 0, 0)] = cv.mood;
      return acc;
    },
    {}
  );

  function tileClassName({ date, view }: { date: string; view: string }) {
    let returnval =
      "font-medium text-base mx-0 my-0 px-0 py-4 dark:hover:bg-gray-950";
    let processedDate = new Date(date).setHours(0, 0, 0, 0);
    /**
     * Conditions
     */

    if (view === "month" && processedDate in filledDates) {
      switch (filledDates[processedDate]) {
        case 1:
          returnval += " bg-red-700 dark:hover:!bg-red-900";
          break;
        case 2:
          returnval += " bg-orange-600 dark:hover:!bg-orange-800";
          break;
        case 3:
          returnval += " bg-amber-500 dark:hover:!bg-amber-700";
          break;
        case 4:
          returnval += " bg-yellow-500 dark:hover:!bg-yellow-700";
          break;
        case 5:
          returnval += " bg-lime-500 dark:hover:!bg-lime-700";
          break;
        case 6:
          returnval += " bg-green-600 dark:hover:!bg-green-800";
          break;
        case 7:
          returnval += " bg-emerald-700 dark:hover:!bg-emerald-900";
          break;
        default:
          console.log("error in mood");
          break;
      }
    }
    if (processedDate === new Date().setHours(0, 0, 0, 0)) {
      returnval += " ring ring-inset ring-black ";
    }
    return returnval;
  }

  function processClickDay(value: Date) {
    const entryId: string = parseDate(value);

    const isDateFilled = value.setHours(0, 0, 0, 0) in filledDates;

    const entryPath = isDateFilled
      ? `/entries/${entryId}`
      : `/entries/?id=${entryId}`;

    router.push(entryPath);
  }

  let calenderCardClassName =
    " bg-gray-800 rounded-md py-10 pb-16 mx-16 px-12 items-center ";
  let calenderCardTextClassName =
    " leading-10 text-center font-medium text-base ";

  let calenderClassName = calenderCardClassName + calenderCardTextClassName;
  return (
    <div className="bg-gray-900 text-gray-100 px-64 py-10 shadow-lg min-h-screen ">
      <h1 className="text-3xl font-bold mb-6 text-center"> Journal </h1>
      <Calendar
        className={calenderClassName}
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
        onClickDay={processClickDay}
      />
    </div>
  );
};

export default IndexPage;
