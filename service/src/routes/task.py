"""
Defines the blueprint for the tasks
"""
from flask import Blueprint
from flask_restful import Api

from resources import TaskResource
from resources import TaskSetResource
from resources import SentenceResource
from resources import TaskAssignResource

TASK_BLUEPRINT = Blueprint("task", __name__)
Api(TASK_BLUEPRINT).add_resource(TaskResource, "/task/<int:id>")

Api(TASK_BLUEPRINT).add_resource(TaskAssignResource, "/task/<int:id>/assign")

Api(TASK_BLUEPRINT).add_resource(TaskSetResource, "/tasks")

Api(TASK_BLUEPRINT).add_resource(SentenceResource, "/sentence/<int:taskId>/<int:idx>/")
