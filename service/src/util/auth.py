from repositories import UserRepository
from flask_restful import abort
from flask_jwt_extended import jwt_required, get_jwt_identity


def ensure_user(user_type=None):
    username = get_jwt_identity()
    user = UserRepository.get(username)
    if user is None:
        abort(400, msg="fatal error, not recognised user")

    if user_type and user.user_type != user_type:
        abort(400, msg="current user is not allowed to access")

    return user
