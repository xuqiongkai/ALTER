from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .task import Task
from .job import Job
from .history import History
