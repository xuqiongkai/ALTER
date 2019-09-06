"""
Define the REST verbs relative to the users
"""

import json

from config import TASK_DATA_PATH
from util.auth import ensure_user

from flasgger import swag_from
from flask.json import jsonify
from flask_restful import Resource
from flask_restful import abort
from flask_restful.reqparse import Argument
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage

from flask import request

from repositories import TaskRepository, UserRepository, JobRepository
from util import parse_params

import os, sys


class TaskResource(Resource):
    """ Verbs relative to the tasks """

    task_dir = os.path.join(os.getcwd(), "data", "tasks")

    @staticmethod
    @jwt_required
    @parse_params(Argument("with_weight", type=int, required=False))
    def get(id, with_weight):
        """ Return a task key information based on task name """
        with_weight = bool(with_weight)

        username = get_jwt_identity()
        user = UserRepository.get(username)
        if user is None:
            abort(400, msg="fatal error, not recognised user")

        task = TaskRepository.get(id=id)
        if task is None:
            abort(400, msg="unknown task")

        if os.path.exists(task.path):
            with open(task.path, "r") as f:
                sentences = f.readlines()
        else:
            abort(400, msg='fatal error, task file does not exist.')

        if with_weight:
            print(with_weight, type(with_weight))
            # from class_service import ClassificationService
            from service.class_service import ClassificationService

            records = []
            for sent in sentences:
                words = sent.strip().split()
                scores = ClassificationService.instance().word_score(words)
                records.append(
                    [
                        {"token": word, "weight": float(weight[1])}
                        for word, weight in zip(words, scores)
                    ]
                )
            words = records
        else:
            words = [
                [{"token": w, "weight": 0} for w in s.strip().split()]
                for s in sentences
            ]

        if user.user_type == "admin":
            return {"data": words}
        else:
            job = JobRepository.find(user, task)
            if job is None:
                abort(400, msg="Unknown job.")
            annotated = [h.sentence_id for h in job.historys if len(h.changes) > 2]
            annotation_status = [i in set(annotated) for i in range(len(words))]
            return {"data": words, "annotation_status": annotation_status}

    @staticmethod
    def delete(name):
        """ Delete a task based on his name """
        file_path = os.path.join(TaskResource.task_dir, name + ".txt")
        if os.path.exists(file_path):
            os.remove(file_path)
        task = TaskRepository.delete(name=name)
        return jsonify({"task": task.json})


class TaskSetResource(Resource):
    @staticmethod
    @jwt_required
    def get():
        username = get_jwt_identity()
        user = UserRepository.get(username)
        if user is None:
            abort(400, msg="fatal error, not recognised user")

        if user.user_type == "admin":
            tasks = user.tasks
            tasks = [
                {
                    "id": task.id,
                    "name": task.name,
                    "total": task.total,
                    "assignees": [
                        {"name": job.user.name, "id": job.user.id} for job in task.jobs
                    ],
                }
                for task in tasks
            ]
            return tasks
        else:
            jobs = user.jobs
            tasks = [
                {"id": job.task.id, "name": job.task.name, "total": job.task.total}
                for job in jobs
            ]
            return tasks

    @staticmethod
    @jwt_required
    @parse_params(
        Argument("name", required=True, help="The name of the task."),
        Argument("mode", required=False, help="The mode of the task."),
        Argument("task_file", type=FileStorage, location="files", action="append"),
    )
    def post(name, task_file, mode):
        """ Create a task based on the uploaded file """
        username = get_jwt_identity()
        user = UserRepository.get(username)
        if user is None:
            abort(400, msg="fatal error, not recognised user")
        if user.user_type != "admin":
            abort(400, msg="only admin user can create task")

        if len(task_file) == 0:
            abort(400, msg="no task file specified")

        file = task_file[0]
        filename = secure_filename(file.filename)
        filename = os.path.splitext(os.path.basename(filename))[0]

        if not filename:
            abort(400, msg="invalid filename")

        file_path = os.path.join(TASK_DATA_PATH, filename + ".txt")
        file.save(file_path)

        if not TaskRepository.create(name, user, 0, file_path, mode):
            # os.remove(file_path)
            abort(400, msg="failed to create task")

        return {"msg": "successuflly created"}


class TaskAssignResource(Resource):
    @staticmethod
    @jwt_required
    @parse_params(Argument("assignees", type=dict, required=False, action="append"))
    def post(id, assignees):
        ensure_user(user_type="admin")

        task = TaskRepository.get(id)
        if task is None:
            abort(400, msg="unknown task")

        assignees = assignees or []
        TaskRepository.update_assignees(task, assignees)
        return {"msg": "successfully updated jobs"}


class SentenceResource(Resource):
    @staticmethod
    @jwt_required
    def get(taskId, idx):
        username = get_jwt_identity()
        user = UserRepository.get(username)
        if user is None:
            abort(400, msg="fatal error, not recognised user")

        task = TaskRepository.get(taskId)
        if task is None:
            abort(400, msg="Unknown task.")

        job = JobRepository.find(user, task)
        if job is None:
            abort(400, msg="Unknown job.")

        if os.path.exists(task.path):
            with open(task.path, "r") as f:
                sentences = f.readlines()

        idx = int(idx)
        if idx >= len(sentences):
            abort(400, msg="Invalid index of sentence with the specified task.")

        sentence = sentences[idx]

        # if with_weight:
        # from class_service import ClassificationService
        from service.class_service import ClassificationService

        if True:
            words = sentence.strip().split()
            scores = ClassificationService.instance().word_score(words)
            words = [
                {"token": word, "weight": float(weight[1])}
                for word, weight in zip(words, scores)
            ]
        else:
            words = [
                [{"token": w, "weight": 0} for w in s.strip().split()]
                for s in sentences
            ]

        sentence_score = float(ClassificationService.instance().sent_score(sentence)[1])

        changes = []
        for history in job.historys:
            # print (history.sentence_id)
            # print (idx)
            # print (type(history.sentence_id))
            # print (type(idx))
            if history.sentence_id == idx:
                changes = json.loads(history.changes)
                break

        return {"words": words, "score": sentence_score, "changes": changes}
