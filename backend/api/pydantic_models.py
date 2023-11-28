from pydantic import BaseModel
from typing import List


class Register(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    password: str
    password_confirm: str
    accept: str


class Login(BaseModel):
    email: str
    password: str
    remember: str


class EditProfile(BaseModel):
    about: str
    title: str
    text: str
    url: str
    visibility: str
