from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session

from core.models import crud, database
from core.schemas import journal
from core.models.database import SessionLocal, engine


database.Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter(
    prefix="/entries",
    tags=["entries"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_model=journal.Entry)
def create_entry(entry: journal.EntryBase, db: Session = Depends(get_db)):
    db_entry = crud.get_entry(
        db=db, entry_id=crud.generate_id_from_date(entry.entry_date)
    )
    if db_entry is not None:
        raise HTTPException(
            status_code=409, detail="Duplicate entry for the day"
        )
    return crud.create_entry(db=db, entry=entry)


@router.get("/", response_model=list[journal.Entry])
def read_entries(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    entries = crud.get_entries(db, skip=skip, limit=limit)
    return entries


@router.get("/{entry_id}", response_model=journal.Entry)
def read_entry(entry_id: int, db: Session = Depends(get_db)):
    db_entry = crud.get_entry(db=db, entry_id=entry_id)
    if db_entry is None:
        raise HTTPException(status_code=404, detail="Entry not found")
    return db_entry
