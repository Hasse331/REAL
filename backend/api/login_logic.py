import bcrypt
from fastapi.responses import JSONResponse
from models import User, SessionLocal
from dotenv import load_dotenv
import jwt
import os
import datetime
import uuid


class LoginHandler:
    def __init__(self, login_data):

        self.login_data = login_data
        self.login_password = login_data.password.encode('utf-8')

    def check_email(self):
        try:
            self.db = SessionLocal()
            self.db_user = self.db.query(User).filter_by(
                email=self.login_data.email).first()
            self.db_password = self.db_user.password.encode('utf-8')
            self.db.close()
        except:
            self.db.close()
            return JSONResponse(content={"message": "Incorrect email or password", "success": False})
        return self.pw_and_jwt()

    def pw_and_jwt(self):
        if bcrypt.checkpw(self.login_password, self.db_password):

            ISSUER = "REAL_API"
            SUBJECT = str(self.db_user.id)
            JWT_SECRET = os.getenv("JWT_SECRET")

            if self.login_data.remember == "yes":
                expiration_time = datetime.datetime.utcnow() + datetime.timedelta(days=14)
            else:
                expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=24)

            claims = {
                'iss': ISSUER,
                'sub': SUBJECT,
                'exp': int(expiration_time.timestamp()),
                'nbf': int(datetime.datetime.utcnow().timestamp()),
                'iat': int(datetime.datetime.utcnow().timestamp()),
                'jti': str(uuid.uuid4())
            }

            encoded_jwt = jwt.encode(
                claims, JWT_SECRET, algorithm="HS256")

            return JSONResponse(content={
                "token": encoded_jwt,
                "message": "Successfull logged in",
                "success": True
            })
        else:
            return JSONResponse(content={"message": "Incorrect email or password", "success": False})
