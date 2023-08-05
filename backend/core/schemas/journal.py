from pydantic import BaseModel, ConfigDict
from datetime import date
from enum import Enum


class Mood(Enum):
    HORRIBLE, BAD, IRRITATED, NORMAL, CONTENT, GOOD, AMAZING = range(1, 8)


class EntryBase(BaseModel):
    entry_date: date
    mood: Mood
    entry_content: str


class Entry(EntryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
