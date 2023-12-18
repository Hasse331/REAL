from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi import Depends
from uuid import UUID
from fastapi.responses import JSONResponse
from fastapi import FastAPI, UploadFile, File
from sqlalchemy import func
from typing import List
from pydantic import BaseModel

import registration
import pydantic_models as pyd
from models import Profile, Post, User, Comment, SessionLocal
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
#NEXT_PUBLIC_REGISTER
@app.post("/register")
def register(user_data: pyd.Register):

    register_instance = registration.DataValidation(user_data)
    return register_instance.validations()

#NEXT_PUBLIC_LOGIN
@app.post("/login")
def login(login_data: pyd.Login):

    login_instance = login_logic.LoginHandler(login_data)
    return login_instance.check_email()


# PROFILE
#NEXT_PUBLIC_GET_PROFILE
@app.get("/profile/{user_id}")
def get_profile(user_id: UUID, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile:
        return profile
    else:
        raise HTTPException(
            status_code=404, detail="Profile Not Found")
    
class IDList(BaseModel):
    idList: List[UUID]
    
#NEXT_PUBLIC_GET_PROFILENAMES
@app.post("/get/profilenames")
def get_profilemames(request_body: IDList, db: Session = Depends(get_db)):
    try:
        profilenames = db.query(Profile).filter(Profile.user_id.in_(request_body.idList)).all() 
        result = [{"user_id": str(profile.user_id), "username": profile.profile_name} for profile in profilenames]
        return result
    except Exception as e:
        # Handle exceptions
        raise HTTPException(status_code=500, detail=str(e))

#NEXT_PUBLIC_EDIT_PROFILE
@app.post("/edit-profile")
def edit_profile(profile_edit: pyd.EditProfile, db: Session = Depends(get_db), user_id: UUID = Depends(jwt_authentication)):

    user_profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if user_profile:
        for key, value in profile_edit.model_dump().items():
            setattr(user_profile, key, value)
        db.commit()

    return JSONResponse(content={"message": "Authentication Successful", "success": True})
    # validating and saving data to db


# MEDIA
#NEXT_PUBLIC_UPLOAD_MEDIA
@app.post("/post/api/media/") 
def post_image(post_id: str = Form(None), media_type: str = Form(...), file: UploadFile = File(...), user_id: UUID = Depends(jwt_authentication)):
    image_instance = save_media.MediaHandler(
        media_type, user_id, post_id, file)
    return image_instance.upload_media()

#NEXT_PUBLIC_GET_PROFILE_IMAGE
@app.get("/get/api/profile_image/{user_id}")
def get_image(user_id: str):
    media_type = "profile"
    image_instance = load_media.MediaHandler(media_type, user_id)
    return image_instance.load_media()

#NEXT_PUBLIC_GET_USRPOST_MEDIA
@app.get("/get/api/usr_post_media/{post_id}")
def get_image(post_id: str):
    media_type = "post"
    image_instance = load_media.MediaHandler(media_type, post_id=post_id)
    return image_instance.load_media()


# USR_POSTS:
#NEXT_PUBLIC_NEW_USR_POST
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

#NEXT_PUBLIC_LOAD_USR_POST_DATA
@app.get("/get/usr_post/data/{loggedIn}")
def edit_profile(user_id: UUID = Depends(conditional_authentication), db: Session = Depends(get_db)):

    # loggedIn parameter is for later use to apply MyAlg

    random_posts = db.query(Post).order_by(func.random()).limit(4).all()

    posts_data = []
    for data in random_posts:
        posts_data.append( {"post_id": data.post_id, "user_id": data.user_id, "tags": data.tags, "profile_name": data.profile_name, "title": data.title, "text": data.text, "media_type": data.media_type})
           
    return posts_data

    

class CommentPyd(BaseModel):
    comment: str
    post_id: UUID

#NEXT_PUBLIC_SAVE_COMMENT
@app.post("/save/comment/")
def save_comment(commentData: CommentPyd, user_id: UUID = Depends(jwt_authentication),  db: Session = Depends(get_db)):
    
    try:
        new_comment = Comment(user_id=user_id, post_id=commentData.post_id, comment=commentData.comment)
        # Add it to the session and commit
        db.add(new_comment)
        db.commit()
        db.refresh(new_comment)
        return "success"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
#NEXT_PUBLIC_LOAD_COMMENTS
@app.get("/load/comments/{post_id}")
def load_comments(post_id: UUID, db: Session = Depends(get_db)):
    
    results = db.query(Comment.user_id, Profile.profile_name, Comment.comment).join(Profile, Comment.user_id == Profile.user_id).filter(Comment.post_id == post_id).all()
    
    comments = [
        {"user_id": user_id, "profile_name": profile_name, "comment": comment}
        for user_id, profile_name, comment in results
    ]

    return comments