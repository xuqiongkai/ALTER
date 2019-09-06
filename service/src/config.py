import logging
import os
import sys

APPLICATION_DATA_DIR = os.path.join(os.getcwd(), 'data/')
logging.basicConfig(
    filename=os.getenv("SERVICE_LOG", os.path.join(APPLICATION_DATA_DIR, "server.log")),
    level=logging.DEBUG,
    format="%(levelname)s: %(asctime)s \
        pid:%(process)s module:%(module)s %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
)


DEBUG = os.getenv("ENVIRONEMENT") == "DEV"
APPLICATION_ROOT = os.getenv("APPLICATION_APPLICATION_ROOT", "/application")
HOST = os.getenv("APPLICATION_HOST")
PORT = int(os.getenv("APPLICATION_PORT", "8000"))
SQLALCHEMY_TRACK_MODIFICATIONS = False
ALLOWED_ORIGINS = ["http://localhost:3000"]

DB_FILE_PATH = os.path.join(APPLICATION_DATA_DIR, "app.db")
DB_URI = "sqlite:////" + DB_FILE_PATH

TASK_DATA_PATH = os.path.join(APPLICATION_DATA_DIR, "tasks/")

################################################################################
# model files

# gender model
CLASSIFIER_VOCAB_PATH = os.path.join(APPLICATION_DATA_DIR, "gender_model/.vocab")
CLASSIFIER_MODEL_PATH = os.path.join(APPLICATION_DATA_DIR, "gender_model/c_e10_PPL0.388.pt")

BERT_MODEL_DIR = os.path.join(APPLICATION_DATA_DIR, "models")
BERT_MODEL_TYPE = "bert-base-cased"
W2V_MODEL_PATH = os.path.join(APPLICATION_DATA_DIR, "models/GoogleNews-vectors-negative300.bin")

################################################################################
