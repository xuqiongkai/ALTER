"""
Defines the blueprint for the jobs
"""
from flask import Blueprint
from flask_restful import Api

from resources import JobResource
from resources import JobSetResource
from resources import HistoryResource

JOB_BLUEPRINT = Blueprint("job", __name__)
Api(JOB_BLUEPRINT).add_resource(JobResource, "/job/<int:id>")

Api(JOB_BLUEPRINT).add_resource(JobSetResource, "/jobs")

Api(JOB_BLUEPRINT).add_resource(
    HistoryResource, "/job/history/<int:taskId>/<int:sentIdx>"
)
