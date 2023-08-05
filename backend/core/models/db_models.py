from sqlalchemy import Column, Integer, String, Enum, Date

from .database import Base
from ..schemas.journal import Mood


class Entry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    entry_date = Column(Date, index=True)
    mood = Column(Enum(Mood))
    entry_content = Column(String, index=True)
