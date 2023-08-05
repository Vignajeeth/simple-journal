from sqlalchemy.orm import Session

from .db_models import Entry as DBEntry
from ..schemas.journal import EntryBase


def generate_id_from_date(date):
    return int(date.strftime("%Y%m%d"))


def get_entry(db: Session, entry_id: int):
    return db.query(DBEntry).filter(DBEntry.id == entry_id).first()


def get_entries(db: Session, skip: int = 0, limit: int = 100):
    return db.query(DBEntry).offset(skip).limit(limit).all()


# def create_entry(db: Session, entry: EntryBase, entry_id: int):
def create_entry(db: Session, entry: EntryBase):
    entry_id = generate_id_from_date(entry.entry_date)
    db_item = DBEntry(**entry.model_dump(), id=entry_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
