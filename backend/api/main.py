from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Depends
from uuid import UUID
from fastapi.responses import JSONResponse
from fastapi import FastAPI, UploadFile, File
from sqlalchemy import func

import registration
import pydantic_models
from models import Profile, Post, SessionLocal
import login_logic
from media import load_media, save_media
from jwt_auth import jwt_authentication
import new_post

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


# LOG AND REG
@app.post("/register")
def register(user_data: pydantic_models.Register):

    register_instance = registration.DataValidation(user_data)
    return register_instance.validations()


@app.post("/login")
def login(login_data: pydantic_models.Login):

    login_instance = login_logic.LoginHandler(login_data)
    return login_instance.check_email()


# PROFILE
@app.get("/profile/{user_id}")
def get_profile(user_id: UUID, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile:
        return profile
    else:
        raise HTTPException(
            status_code=404, detail="Profile Not Found")


@app.post("/edit-profile")
def edit_profile(profile_edit: pydantic_models.EditProfile, db: Session = Depends(get_db), user_id: UUID = Depends(jwt_authentication)):

    user_profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if user_profile:
        for key, value in profile_edit.model_dump().items():
            setattr(user_profile, key, value)
        db.commit()

    return JSONResponse(content={"message": "Authentication Successful", "success": True})
    # validating and saving data to db


# MEDIA
@app.post("/post/api/media/")
def post_image(post_id: str = Form(None), media_type: str = Form(...), file: UploadFile = File(...), user_id: UUID = Depends(jwt_authentication)):
    image_instance = save_media.MediaHandler(
        media_type, user_id, post_id, file)
    return image_instance.upload_media()


@app.get("/load/api/profile_image/{user_id}")
def get_image(user_id: str):
    media_type = "profile"
    image_instance = load_media.MediaHandler(media_type, user_id)
    return image_instance.load_media()


@app.get("/load/api/post_media/{post_id}")
def get_image(post_id: str):
    media_type = "post"
    image_instance = load_media.MediaHandler(media_type, post_id=post_id)
    return image_instance.load_media()


# USR_POSTS:
@app.post("/new-post/")
def edit_profile(media_type: str = Form(...), file: UploadFile = File(...), user_id: UUID = Depends(jwt_authentication), title: str = Form(...), text: str = Form(...)):
    if user_id and media_type == "post":
        # validate, create post_id save to database, post_id ->

        instance = new_post.UsrPost(user_id, title, text, media_type, file)
        post_id = instance.validate()

        image_instance = save_media.MediaHandler(
            media_type, user_id, post_id, file)
        return image_instance.upload_media()

    else:
        return JSONResponse(content={"message": "Session Authentication Failed", "success": False})


def conditional_authentication(loggedIn: bool):
    if loggedIn:
        return Depends(jwt_authentication)
    return None


@app.get("/load-post/{loggedIn}")
def edit_profile(user_id: UUID = Depends(conditional_authentication), db: Session = Depends(get_db)):

    # loggedIn parameter is for later use to apply MyAlg
    return db.query(Post).order_by(func.random()).first()
