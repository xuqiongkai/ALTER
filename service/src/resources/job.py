import json

from flasgger import swag_from
from flask.json import jsonify
from flask_restful import Resource
from flask_restful import abort
from flask_restful.reqparse import Argument
from flask_jwt_extended import get_jwt_identity, jwt_required

from flask import request

from repositories import UserRepository
from repositories import TaskRepository
from repositories import JobRepository
from util import parse_params


# class JobResource(Resource):
#     """ Verbs relative to the jobs """

#     @staticmethod
#     @parse_params(
#         Argument("user_id", required=True, help='The user id of the job.'),
#         Argument("task_id", required=True, help='The task id of the job.'),
#         Argument("doc_num", required=True, help='The doc number of the job.')
#     )
#     def post(user_id, task_id, doc_num):
#         """ Create a job based on the user_id, task_id and doc_num file """
#         print(user_id, task_id, doc_num)

#         job = JobRepository.create(user_id, task_id, doc_num)
#         return jsonify({"job": job.json})

#     @staticmethod
#     @parse_params(
#         Argument("user_id", required=True, help='The user id of the job.'),
#         Argument("task_id", required=True, help='The task id of the job.'),
#         Argument("doc_num", required=True, help='The doc number of the job.')
#     )
#     def get(user_id, task_id, doc_num):
#         """ Return a job key information based on user_id, task_id and doc_num"""
#         job = JobRepository.get(user_id, task_id, doc_num)
#         return jsonify({"job": job.json})

#     @staticmethod
#     @parse_params(
#         Argument("user_id", required=True, help='The user id of the job.'),
#         Argument("task_id", required=True, help='The task id of the job.'),
#         Argument("doc_num", required=True, help='The doc number of the job.')
#     )
#     def delete(user_id, task_id, doc_num):
#         """ Delete a job by user_id, task_id and doc_num """
#         job = JobRepository.delete(user_id, task_id, doc_num)
#         return jsonify({"job": job.json})

#     @staticmethod
#     @parse_params(
#         Argument("user_id", required=True, help='The user id of the job.'),
#         Argument("task_id", required=True, help='The task id of the job.'),
#         Argument("doc_num", required=True, help='The doc number of the job.'),
#         Argument("status", required=False, help='The status of the job.'),
#         Argument("history", required=False, help='The edit history of the job.'),
#     )
#     def put(user_id, task_id, doc_num, status, history):
#         """ Update an user based on the sent information """
#         job = JobRepository.update(user_id, task_id, doc_num, status, history)
#         return jsonify({"job": job.json})


class JobResource(Resource):
    @staticmethod
    @jwt_required
    def get(id):
        username = get_jwt_identity()
        user = UserRepository.get(username)
        if user is None:
            abort(400, msg="fatal error, not recognised user.")

        job = JobRepository.get(id=id)
        if job is None:
            abort(400, msg="Unknown job.")

        job = {
            "id": job.id,
            "user_id": job.user.id,
            "task_id": job.task.id,
            "history": [h.changes for h in job.historys],
        }

        return job


class HistoryResource(Resource):
    @staticmethod
    @parse_params(Argument("changes", type=list, location="json", required=False))
    @jwt_required
    def post(taskId, sentIdx, changes):
        username = get_jwt_identity()
        user = UserRepository.get(username)
        if user is None:
            abort(400, msg="fatal error, not recognised user.")

        task = TaskRepository.get(taskId)
        if task is None:
            abort(400, msg="fatal error, not recognised task.")

        job = JobRepository.find(user, task)
        if job is None:
            abort(400, msg="Unknown job.")

        # import pdb; pdb.set_trace();

        # collate the format, as somehow the parser mistakenly converts " to '
        # changes = changes.replace("'", "\'")
        changes = json.dumps(changes)
        JobRepository.push_history(job, sentIdx, changes)
        return {"msg": "Successfully added history to given job."}


class JobSetResource(Resource):
    @staticmethod
    @jwt_required
    def get():
        username = get_jwt_identity()
        user = UserRepository.get(username)
        if user is None:
            abort(400, msg="fatal error, not recognised user")

        jobs = JobRepository.find_all_by_user(user)
        jobs = [{"task": job.task.name} for job in jobs]
        return jobs
