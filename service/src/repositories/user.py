""" Defines the User repository """

from models import User


class UserRepository:
    """ The repository for the user model """

    @staticmethod
    def get(username):
        """ Query a user by name """
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_by_id(id):
        return User.query.filter(User.id == id).first()

    @staticmethod
    def get_all_plain_users():
        return User.query.filter(User.user_type == "user").all()

    @staticmethod
    def delete(username):
        """ Delete a user by name """
        user = UserRepository.get(username)
        if user is not None:
            user.delete()
            return True
        else:
            return False

    @staticmethod
    def update(name, type=None, key=None):
        """ Update a user's age """
        user = UserRepository.get(name)
        if type is not None:
            user.type = type
        if key is not None:
            user.key = key
        return user.save()

    @staticmethod
    def create(username, password, name, type, key=""):
        """ Create a new user """
        password = User.generate_hash(password)
        user = User(username, password, name=name, type=type, key=key)
        return user.save()

    @staticmethod
    def login(username, password):
        user = UserRepository.get(username)
        if user is None:
            return None

        if User.verify_hash(password, user.password):
            return user
        else:
            return None
