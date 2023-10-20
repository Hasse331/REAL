from fastapi.responses import JSONResponse
import re
import bcrypt
import html
from models import User, Profile, SessionLocal
import phonenumbers


class DataValidation:
    def __init__(self, user_data):

        self.user_data = user_data

    def validations(self):
        for key, value in self.user_data:
            lenght = len(value)
            if lenght > 35 or lenght < 2:
                return JSONResponse(content={"message": key + " has over 35 or less than 2 characters!", "success": False})

        # Start db session
        self.db = SessionLocal()

        existing_user = self.db.query(User).filter_by(
            email=self.user_data.email).first()

        phone_is_valid = self.check_number(self.user_data.phone)

        if existing_user:
            return JSONResponse(content={"message": "Email already exists!", "success": False})

        elif not re.match(r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)", self.user_data.email):
            return JSONResponse(content={"message": "Please add a valid email address", "success": False})

        if not phone_is_valid:
            return JSONResponse(content={"message": "Please use a correct country code, e.g., +44", "success": False})

        elif self.user_data.password != self.user_data.password_confirm:
            return JSONResponse(content={"message": "Passwords don't match!", "success": False})

        elif len(self.user_data.password) < 10:
            return JSONResponse(content={"message": "Passwords too short! Use +10 characters.", "success": False})

        elif (not re.search(r"[A-Z]", self.user_data.password) or
              not re.search(r"[a-z]", self.user_data.password) or
                not re.search(r"\d", self.user_data.password)):
            return JSONResponse(content={"message": "Use numbers, lowercase and uppercase letters.", "success": False})

        else:
            return self.handle_data()

    def hashing(self):
        password = self.user_data.password.encode('utf-8')
        hashed_password = bcrypt.hashpw(
            password, bcrypt.gensalt()).decode('utf-8')
        del self.user_data.password
        del self.user_data.password_confirm
        del password
        return hashed_password

    def sanitizing(self, hashed_password):
        stored_email = self.user_data.email
        del self.user_data.email
        sanitized_data = {k: html.escape(v) for k, v in self.user_data}
        sanitized_data["password"] = hashed_password
        sanitized_data["email"] = stored_email
        ready_data = sanitized_data
        return ready_data

    def handle_data(self):

        hashed_password = self.hashing()
        processed_data = self.sanitizing(hashed_password)

        new_user = User(first_name=processed_data['first_name'], last_name=processed_data['last_name'],
                        email=processed_data['email'], phone=processed_data['phone'], password=processed_data['password'])
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)

        user_id = new_user.id

        return self.prep_profile(user_id)

    def prep_profile(self, user_id):

        username = self.user_data.first_name + " " + self.user_data.last_name

        if not user_id:
            user = self.db.query(User).filter(
                User.email == self.user_data.email).first()
            if user:
                user_id = user.id
            else:
                raise ValueError(
                    "Making default user profile failed. No user id found.")

        default_profile = {
            "user_id": user_id,
            "profile_name": username,
            "tags": ["sports", "humor"],
            "image": "placeholder.png",
            "about": "Hello, i'm new here!",
            "title": "Hobbies/leisure:",
            "text": "Drinking coffee",
            "url": "http://localhost:3000/",
            "visibility": "restricted"
        }

        new_default_profile = Profile(**default_profile)
        self.db.add(new_default_profile)
        self.db.commit()
        self.db.refresh(new_default_profile)
        self.db.close()

        return JSONResponse(content={"message": "Registration successful!", "success": True})

    def check_number(self, phone):
        try:
            parsed_number = phonenumbers.parse(phone, None)

            # Check if the number is valid
            if phonenumbers.is_valid_number(parsed_number):
                return True
        except phonenumbers.NumberParseException:
            return False
