import click

from flask import Flask
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager

import config
import logging
from models import db

import os

print(os.getcwd())

server = Flask(__name__)
server.debug = config.DEBUG
server.config["SQLALCHEMY_DATABASE_URI"] = config.DB_URI
db.init_app(server)

migrate = Migrate(server, db)
manager = Manager(server)
manager.add_command("db", MigrateCommand)

@manager.command
def download_models():
    def download_bert():
        from service.bert import BertService
        logging.info('Downloading bert models.')
        BertService.instance().init(config.BERT_MODEL_TYPE, config.BERT_MODEL_DIR)
    # download_bert()

    def download_w2v():
        URL = 'https://s3.amazonaws.com/dl4j-distribution/GoogleNews-vectors-negative300.bin.gz'
        DOWNLOAD_FILE = 'GoogleNews-vectors-negative300.bin.gz'
        OUTPUT_FILE = config.W2V_MODEL_PATH

        if os.path.exists(OUTPUT_FILE):   
            print('Word vector file: OK')
        else:
            import subprocess
            ret = subprocess.call(['wget', '-c', URL, '-O', DOWNLOAD_FILE])
            if int(ret) != 0:
                print('Failed to download word vectors from: https://s3.amazonaws.com/dl4j-distribution/GoogleNews-vectors-negative300.bin.gz')
                return

            print('uncompressing word vector files')
            with open(OUTPUT_FILE, 'w') as f:
                subprocess.call(['gzip', '-dc', DOWNLOAD_FILE], stdout=f)
            # print ('gzip -c {} > {}'.format(DOWNLOAD_FILE, OUTPUT_FILE))
            # os.system('gzip -c {} > {}'.format(DOWNLOAD_FILE, OUTPUT_FILE))
            print('Word vector file: OK')
    # download_w2v()

    def download_classification():
        folder = os.path.dirname(config.CLASSIFIER_MODEL_PATH)
        os.makedirs(folder, exist_ok=True)
        import subprocess
        ret = subprocess.call(['wget', '-c', 'http://users.cecs.anu.edu.au/~Qiongkai.Xu/c_e10_PPL0.388.pt',
                               '-O', config.CLASSIFIER_MODEL_PATH])
        if int(ret) != 0:
            print('Failed to download the default classifcation model.')

        ret = subprocess.call(['wget', '-c', 'http://users.cecs.anu.edu.au/~Qiongkai.Xu/.vocab',
                               '-O', config.CLASSIFIER_VOCAB_PATH])
        if int(ret) != 0:
            print('Failed to download the default classifcation model.')
    download_classification()

@manager.command
@click.argument("save_dir", type=click.Path(False))
def export_jobs(save_dir):
    os.makedirs(save_dir, exist_ok=True)

    import json
    from models import Task, User, Job, History
    from repositories import UserRepository, JobRepository

    jobs = Job.query.all()
    for job in jobs:
        # print ('processing ', job)
        if len(job.historys) == 0:
            continue

        task = job.task
        with open(task.path, "r") as f:
            sentences = f.readlines()

        history_by_sentence_idx = {}
        for h in job.historys:
            try:
                history_by_sentence_idx[h.sentence_id] = json.loads(h.changes)
            except:
                pass

        print(
            f"{job.id} {task.name} {job.user.name}: {len(history_by_sentence_idx)} / {len(sentences)}"
        )
        merged_data = []
        for idx, sent in enumerate(sentences):
            history = []
            if idx in history_by_sentence_idx:
                history = history_by_sentence_idx[idx]

            merged_data.append({"sentence": sent, "history": history})

        data = {"task": task.name, "user": job.user.name, "data": merged_data}

        data = json.dumps(data, indent=4)

        with open(os.path.join(save_dir, f"{job.id}.json"), "w") as f:
            f.write(data)


@manager.command
def seed():
    from models import Task, User, Job, History

    password = User.generate_hash("password")
    user = User("admin", password, "administrator", "admin", "")
    db.session.add(user)
    db.session.commit()


if __name__ == "__main__":
    manager.run()
