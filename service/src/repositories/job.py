from models import Job
from models import History

# class JobRepository:
#     @staticmethod
#     def get(user_id, task_id, doc_num):
#         """ Query a user by name """
#         return Job.query.filter_by(user_id=user_id, task_id=task_id, doc_num=doc_num).one()

#     @staticmethod
#     def create(user_id, task_id, doc_num):
#         """ Create a new task """
#         # print(name, total, path, mode)
#         job = Job(user_id=user_id, task_id=task_id, doc_num=doc_num)
#         return job.save()

#     @staticmethod
#     def delete(user_id, task_id, doc_num):
#         """ Delete a user by name """
#         return JobRepository.get(user_id, task_id, doc_num).delete()

#     @staticmethod
#     def update(user_id, task_id, doc_num, status=None, history=None):
#         """ Create a new task """
#         # print(name, total, path, mode)
#         job = JobRepository.get(user_id=user_id, task_id=task_id, doc_num=doc_num)
#         if status is not None:
#             job.status = status
#         if history is not None:
#             job.history = history

#         return job.save()


class JobRepository:
    @staticmethod
    def craete(user, task):
        job = Job(user, task)
        return job.save()

    @staticmethod
    def get(id):
        return Job.query.filter(Job.id == id).first()

    @staticmethod
    def find(user, task):
        return Job.query.filter(Job.user == user, Job.task == task).first()

    @staticmethod
    def find_by_id(user_id, task_id):
        return Job.query.filter(Job.user_id == user_id, Job.task_id == task_id).first()

    @staticmethod
    def push_history(job, sentIdx, changes):
        doc_history = None
        for history in job.historys:
            if history.sentence_id == sentIdx:
                doc_history = history

        if doc_history:
            doc_history.changes = changes
        else:
            doc_history = History(job, sentIdx, changes)
        doc_history.save()

    @staticmethod
    def find_all_by_user(user):
        return Job.query.filter(Job.user == user).all()
