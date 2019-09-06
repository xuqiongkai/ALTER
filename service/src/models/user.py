"""
Define the User model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from passlib.hash import pbkdf2_sha256 as sha256
from sqlalchemy.orm import relationship


class User(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The User model """

    __tablename__ = "user"

    # first_name = db.Column(db.String(300), primary_key=True)
    # last_name = db.Column(db.String(300), primary_key=True)

    id = db.Column(db.Integer, primary_key=True)
    user_type = db.Column(db.Integer, nullable=True)
    name = db.Column(db.String(100), unique=True)
    key = db.Column(db.String(20))

    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(120), nullable=False)

    tasks = relationship("Task", back_populates="owner")

    def __init__(self, username, password, name, type, key):
        """ Create a new User """
        self.username = username
        self.password = password

        self.name = name
        self.user_type = type
        self.key = key

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)
