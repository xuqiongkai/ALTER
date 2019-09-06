""" Defines the Task repository """

from models import Task
from models import User
from models import Job
from models import db


class TaskRepository:
    @staticmethod
    def get(id):
        """ Query a user by name """
        return Task.query.filter_by(id=id).first()

    @staticmethod
    def delete(name):
        """ Delete a user by name """
        return TaskRepository.get(name).delete()

    # @staticmethod
    # def update(name, total=None, path=None, mode=None):
    #     """ Update a user's age """
    #     task = TaskRepository.get(name)
    #     if total is not None:
    #         task.type = type
    #     if path is not None:
    #         task.path = path
    #     if mode is not None:
    #         task.mode = mode
    #     return task.save()

    @staticmethod
    def create(name, owner, total, path, mode):
        """ Create a new task """
        # print(name, total, path, mode)
        task = Task(name=name, owner=owner, total=total, path=path, mode=mode)
        return task.save()

    @staticmethod
    def find_all(**filters):
        return Task.query.filter(**filters).all()

    @staticmethod
    def update_assignees(task, assignees):
        # remove assignees that have been dismissed
        assignees = [assign["id"] for assign in assignees]
        known_assignees = [job.user.id for job in task.jobs]

        new_assignees = set(assignees) - set(known_assignees)
        thrown_assignees = set(known_assignees) - set(assignees)
        # print (known_assignees, new_assignees, thrown_assignees)

        users = User.query.filter(User.id.in_(set(new_assignees)))
        for user in users:
            db.session.add(Job(user, task))

        thrown_jobs = Job.query.filter(
            Job.user_id.in_(thrown_assignees), Job.task == task
        ).all()
        for job in thrown_jobs:
            db.session.delete(job)

        db.session.commit()
