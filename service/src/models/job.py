"""
Define the Job model
"""
from . import db
from .abc import BaseModel, MetaBaseModel
from flask.json import jsonify
from sqlalchemy.orm import relationship

from .user import User
from .task import Task


class Job(db.Model, BaseModel, metaclass=MetaBaseModel):
    """ The User model """

    __tablename__ = "job"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey(Task.id), nullable=False)
    # doc_num = db.Column(db.Integer, primary_key=True, nullable=False)

    status = db.Column(db.Integer)
    # history = db.Column(db.String(1000000))

    user = db.relationship("User", backref="jobs")
    task = db.relationship("Task", backref="jobs")

    def __init__(self, user=None, task=None):
        """ Create a new User """
        self.user = user
        self.task = task
        # self.doc_num = doc_num

        self.status = 0
        # self.history = ""
