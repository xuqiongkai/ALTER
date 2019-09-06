"""
Define the REST verbs relative to the users
"""

from flasgger import swag_from
from flask.json import jsonify
from flask_restful import Resource, fields, marshal_with
from flask_restful.reqparse import Argument
from flask_jwt_extended import (
    create_access_token,
    jwt_refresh_token_required,
    create_refresh_token,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    jwt_required,
)

from flask_restful import abort
from repositories import UserRepository
from util import parse_params
from util.auth import ensure_user

resource_fields = {
    "username": fields.String,
    "name": fields.String,
    "user_type": fields.String,
}


class UserResource(Resource):
    """ Verbs relative to the users """

    # @staticmethod
    # @parse_params(
    #     Argument("type", location="json", required=True, help="The type of the user."),
    #     Argument("key", location="json", required=False, help="The key of the user.")
    # )
    # @swag_from("../swagger/user/POST.yml")
    # def post(name, type, key):
    #     """ Create an user based on the sent information """
    #     user = UserRepository.create(
    #         name=name, type=type, key=key
    #     )
    #     return jsonify({"user": user.json})

    @staticmethod
    @parse_params(
        Argument("type", location="json", required=False, help="The type of the user."),
        Argument("key", location="json", required=False, help="The key of the user."),
    )
    @swag_from("../swagger/user/PUT.yml")
    def put(name, type, key):
        """ Update an user based on the sent information """
        user = UserRepository.update(name=name, type=type, key=key)
        return jsonify({"user": user.json})

    @staticmethod
    @jwt_required
    @swag_from("../swagger/user/GET.yml")
    @marshal_with(resource_fields)
    def get(username):
        """ Return an user key information based on his name """
        ensure_user(user_type="admin")
        user = UserRepository.get(username=username)
        if user is not None:
            return user.json
        else:
            abort(404, msg="User not found")

    @staticmethod
    @jwt_required
    def delete(username):
        """ Return an user key information based on his name """
        ensure_user(user_type="admin")
        rsl = UserRepository.delete(username=username)
        if rsl:
            return {"msg": "Sucessfully deleted."}, 200
        else:
            return {"msg": "User does not exist."}, 400


class UserSetResource(Resource):
    @staticmethod
    @jwt_required
    def get():
        user = ensure_user(user_type="admin")
        all_users = UserRepository.get_all_plain_users()
        return [{"id": u.id, "name": u.name} for u in all_users]


class UserRegistrationResource(Resource):
    @staticmethod
    @jwt_required
    @parse_params(
        Argument("username", location="json", required=True),
        Argument("password", location="json", required=True),
        Argument("name", location="json", required=True),
        Argument("type", location="json", required=False),
    )
    def post(username, password, name, type):
        ensure_user(user_type="admin")
        if UserRepository.get(username) is not None:
            abort(400, msg="existing user")

        user = UserRepository.create(username, password, name, type)
        user_json = user.json
        del user_json["password"]
        return user_json, 200


class UserLoginResource(Resource):
    @staticmethod
    @parse_params(
        Argument("username", location="json", required=True),
        Argument("password", location="json", required=True),
    )
    def post(username, password):
        user = UserRepository.login(username, password)
        if user is None:
            abort(400, msg="Incorrect credentials.")
        else:
            resp = jsonify({"msg": "Successfully login."})
            resp = jsonify(
                {
                    "login": True,
                    "id": user.id,
                    "username": user.username,
                    "user_type": user.user_type,
                }
            )

            access_token = create_access_token(identity=username)
            refresh_token = create_refresh_token(identity=username)

            set_access_cookies(resp, access_token)
            set_refresh_cookies(resp, refresh_token)
            return resp
