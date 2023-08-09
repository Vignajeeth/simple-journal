from sqlalchemy.orm import Session

from .db_models import Entry as EntryTable
from ..schemas.journal import EntryBase
from fastapi import HTTPException


def generate_id_from_date(date):
    return int(date.strftime("%Y%m%d"))


def get_entry(db: Session, entry_id: int):
    return db.query(EntryTable).filter(EntryTable.id == entry_id).first()


def get_entries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(EntryTable).offset(skip).limit(limit).all()


def create_entry(db: Session, entry: EntryBase):
    entry_id = generate_id_from_date(entry.entry_date)
    db_item = EntryTable(**entry.model_dump(), id=entry_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_entry(db: Session, new_entry: EntryBase, entry_id: int):
    db_entry = db.query(EntryTable).filter(EntryTable.id == entry_id).first()
    if db_entry is None:
        return None
    if db_entry.entry_date != new_entry.entry_date:
        raise HTTPException(status_code=409, detail="Invalid Date")

    db_entry.entry_content = new_entry.entry_content
    db_entry.mood = new_entry.mood
    db.commit()
    db.refresh(db_entry)
    return db_entry


def delete_entry(db: Session, entry_id: int):
    db_entry = db.query(EntryTable).filter(EntryTable.id == entry_id).first()
    if db_entry is None:
        return None

    db.delete(db_entry)
    db.commit()
    return db_entry
