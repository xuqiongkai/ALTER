"""
Define the Task model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from sqlalchemy.orm import relationship


class Task(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The User model """

    __tablename__ = "task"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    total = db.Column(db.Integer)
    path = db.Column(db.String(100), unique=True)
    mode = db.Column(db.String(100))
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    owner = relationship("User", back_populates="tasks")

    def __init__(self, name, owner, total, path, mode):
        """ Create a new User """
        self.name = name
        self.total = total
        self.path = path
        self.mode = mode
        self.owner = owner
