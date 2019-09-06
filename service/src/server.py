from flasgger import Swagger
from flask import Flask
from flask.blueprints import Blueprint
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Initialise the paths to the services involving modeling
import os, sys

# classifier_project_path = os.path.join(os.getcwd(), "classifier")
# sys.path.append(classifier_project_path)

import config
import routes
from models import db

# config your API specs
# you can define multiple specs in the case your api has multiple versions
# ommit configs to get the default (all views exposed in /spec url)
# rule_filter is a callable that receives "Rule" object and
#   returns a boolean to filter in only desired views

server = Flask(__name__)

server.config["SWAGGER"] = {
    "swagger_version": "2.0",
    "title": "Application",
    "specs": [
        {
            "version": "0.0.1",
            "title": "Application",
            "endpoint": "spec",
            "route": "/application/spec",
            "rule_filter": lambda rule: True,  # all in
        }
    ],
    "static_url_path": "/apidocs",
}

Swagger(server)

# initialise the JWT
server.config["JWT_TOKEN_LOCATION"] = ["cookies"]
server.config["JWT_ACCESS_COOKIE_PATH"] = "/application"
server.config["JWT_REFRESH_COOKIE_PATH"] = "/token/refresh"
server.config["JWT_COOKIE_CSRF_PROTECT"] = False
server.config["JWT_SECRET_KEY"] = "data61"
server.config["JWT_ACCESS_TOKEN_EXPIRES"] = 86400
server.config["JWT_REFRESH_TOKEN_EXPIRES"] = 86400
jwt = JWTManager(server)

server.debug = config.DEBUG
server.config["SQLALCHEMY_DATABASE_URI"] = config.DB_URI
server.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.SQLALCHEMY_TRACK_MODIFICATIONS
db.init_app(server)
db.app = server

cors = CORS(
    server,
    origins=config.ALLOWED_ORIGINS,
    supports_credentials=True,
)

if server.debug:
    import logging
    logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)


from service import init_service
init_service(config)


for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        server.register_blueprint(blueprint, url_prefix=config.APPLICATION_ROOT)

if __name__ == "__main__":
    server.run(host=config.HOST, port=config.PORT)
