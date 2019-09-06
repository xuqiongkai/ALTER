from flask.json import jsonify
from flask_restful import Resource
from flask_restful.reqparse import Argument

from util import parse_params

# from class_service import ClassificationService
from service.class_service import ClassificationService


class WordClassResource(Resource):
    """Word Weights"""

    @staticmethod
    @parse_params(
        Argument(
            "sentence", location="json", required=True, help="Content of the sentence."
        ),
        Argument(
            "weight",
            location="json",
            required=False,
            help="Get the classification weight.",
        ),
    )
    def post(sentence, weight):
        words = sentence.split(" ")
        data = []

        # if weight == 'c':
        if True:
            scores = ClassificationService.instance().word_score(words)
            for i in range(len(words)):
                data.append({"token": words[i], "weight": str(-scores[i, 1])})
        else:
            for i in range(len(words)):
                data.append({"token": words[i], "weight": "0"})
        # print(data)
        return jsonify(data)
