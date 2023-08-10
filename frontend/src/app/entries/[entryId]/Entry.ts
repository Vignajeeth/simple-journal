enum Mood {
    HORRIBLE = 1, BAD, IRRITATED, NORMAL, CONTENT, GOOD, AMAZING 
  }

export interface Entry {
    entry_content: string;
    mood: Mood;
    entry_date: Date;
    id: number
  }

