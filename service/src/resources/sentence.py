"""
Define the REST verbs relative to the users
"""

import random

from flasgger import swag_from
from flask.json import jsonify
from flask_restful import Resource
from flask_restful.reqparse import Argument

from repositories import UserRepository
from util import parse_params

# from class_service import ClassificationService
from service.class_service import ClassificationService
from service.bert import BertService
from service.w2v_service import W2vService
from service.edit_distance import EditDistanceService


class SentenceWmdResource(Resource):
    @staticmethod
    @parse_params(
        Argument(
            "sentence1",
            location="json",
            required=True,
            help="Content of sentence 1 (Original)",
        ),
        Argument(
            "sentence2",
            location="json",
            required=True,
            help="Content of sentence 2 (Editing)",
        ),
    )
    def post(sentence1, sentence2):
        # print('wmd')
        # print(sentence1)
        # print(sentence2)
        words1 = sentence1.strip().split(" ")
        words2 = sentence2.strip().split(" ")

        result = W2vService.instance().sent_score(words1, words2)
        return result


class SentenceLmResource(Resource):
    @staticmethod
    @parse_params(
        Argument(
            "sentence",
            location="json",
            required=True,
            help="Content of editing sentence",
        )
    )
    def post(sentence):
        sentence = sentence.strip().split()
        result = BertService.instance().sent_score(sentence)
        # result = float(result)
        # return jsonify({"result": result})
        return result


class SentenceClassResource(Resource):
    @staticmethod
    @parse_params(
        Argument(
            "sentence",
            location="json",
            required=True,
            help="Content of editing sentence",
        )
    )
    def post(sentence):
        words = sentence.split(" ")
        result = ClassificationService.instance().sent_score(words)

        # result = [str(s) for s in result]
        result = float(result[1])
        return result


class SentenceMetricsResource(Resource):
    @staticmethod
    @parse_params(
        Argument(
            "sentence",
            location="json",
            required=True,
            help="Content of editing sentence",
        ),
        Argument(
            "origin", location="json", required=True, help="Content of editing sentence"
        ),
        Argument(
            "withWordScore",
            location="json",
            required=False,
            help="whether to fetch word scores",
        ),
    )
    def post(sentence, origin, withWordScore):
        words = sentence.strip().split(" ")
        origin_words = origin.strip().split(" ")

        class_score = ClassificationService.instance().sent_score(words)
        class_score = float(class_score[1])
        ed_score = EditDistanceService.instance().compute(words, origin_words)
        wmd_score = W2vService.instance().sent_score(words, origin_words)
        lm_score = BertService.instance().sent_score(words)

        result = {
            "metrics": {
                "class": class_score,
                "ed": ed_score,
                "wmd": wmd_score,
                "lm": lm_score,
            }
        }

        if withWordScore:
            weighted_words = []
            scores = ClassificationService.instance().word_score(words)
            for i in range(len(words)):
                weighted_words.append({"token": words[i], "weight": str(-scores[i, 1])})
            result["words"] = weighted_words

        return result
