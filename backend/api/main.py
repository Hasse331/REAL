from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Depends
from uuid import UUID

import registration
import pydantic_models
from models import Profile, SessionLocal
import login_logic

# CHECK FOR PRODUCTION:
app = FastAPI(debug=True)

# CHECK FOR PRODUCTION:
origins = [
    "http://localhost:3000",  # React app address
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register")
def register(user_data: pydantic_models.Register):

    register_instance = registration.DataValidation(user_data)
    return register_instance.validations()


@app.post("/login")
def login(login_data: pydantic_models.Login):

    login_instance = login_logic.LoginHandler(login_data)
    return login_instance.check_email()


@app.get("/profile/{user_id}")
def get_profile(user_id: UUID, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile:
        return profile
    else:
        raise HTTPException(
            status_code=404, detail="Profile Not Found")


@app.post("/edit-profile/{user_id}")
def edit_profile(user_id: UUID):
    pass


@app.post("/new-post/{user_id}")
def edit_profile(user_id: UUID):
    pass


@app.get("/load-post/{user_id}")
def edit_profile(user_id: UUID):
    pass
