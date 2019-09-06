"""
Defines the blueprint for the users
"""
from flask import Blueprint
from flask_restful import Api

from resources import UserResource
from resources import UserSetResource
from resources import UserRegistrationResource
from resources import UserLoginResource

USER_BLUEPRINT = Blueprint("user", __name__)
Api(USER_BLUEPRINT).add_resource(UserResource, "/user/<string:username>")

Api(USER_BLUEPRINT).add_resource(UserSetResource, "/users")

Api(USER_BLUEPRINT).add_resource(UserRegistrationResource, "/registration")

Api(USER_BLUEPRINT).add_resource(UserLoginResource, "/login")
