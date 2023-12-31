from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from v1.endpoints import entries


app = FastAPI()
app.include_router(entries.router)


origins = [
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Hello World!"}
