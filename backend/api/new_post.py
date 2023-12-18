from models import Post, Profile, SessionLocal
from fastapi.responses import JSONResponse


class UsrPost():
    def __init__(self, user_id, title, text, media_type, media):
        self.user_id = user_id
        self.title = title
        self.text = text
        self.media_type = media_type
        self.media = media

    def validate(self):

        # TASK: ADD REAL VALIDATIONS HERE
        # TASK: ADD REAL VALIDATIONS HERE
        # TASK: ADD REAL VALIDATIONS HERE
        # validating the data first
        if self.media.content_type.startswith(
                "image/"):
            self.media_type = "image"

        elif self.media.content_type.startswith("video/"):
            self.media_type = "video"

        return self.save_to_db()

    def save_to_db(self):
        self.db = SessionLocal()
        user_profile = self.db.query(Profile).filter_by(
            user_id=self.user_id).first()

        new_post_data = Post(user_id=self.user_id, tags=[
            "sports", "humor"], profile_name=user_profile.profile_name, title=self.title, text=self.text, media_type=self.media_type)
        self.db.add(new_post_data)
        self.db.commit()
        self.db.refresh(new_post_data)

        return new_post_data.post_id
