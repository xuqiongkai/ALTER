from flask.json import jsonify
from sqlalchemy.orm import relationship

from . import Job, db
from .abc import BaseModel, MetaBaseModel


class History(db.Model, BaseModel, metaclass=MetaBaseModel):
    __tablename__ = "history"

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey(Job.id), nullable=False)
    sentence_id = db.Column(db.Integer, nullable=False)
    changes = db.Column(db.String(1024))

    job = db.relationship("Job", backref="historys")

    def __init__(self, job=None, sentence_id=None, changes=""):
        self.job = job
        self.sentence_id = sentence_id
        self.changes = changes
