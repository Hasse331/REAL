from sqlalchemy import Column, Integer, String, ForeignKey
import uuid
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from typing import List
import logging

logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)


load_dotenv()

DATABASE_URL = os.getenv("AWS_DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True)
    phone = Column(String)
    password = Column(String)


class Profile(Base):
    __tablename__ = 'real_profiles'

    id = Column(Integer,  primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), index=True)
    profile_name = Column(String)
    tags = Column(ARRAY(String))
    image = Column(String)
    about = Column(String)
    title = Column(String)
    text = Column(String)
    url = Column(String)
    visibility = Column(String)


""" Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine) """
