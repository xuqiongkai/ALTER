import json
from flask.json import jsonify
from flask_restful import Resource
from flask_restful.reqparse import Argument

from util import parse_params

# from . import s_service, l_service
from service.bert import BertService
from service.w2v_service import W2vService


class RecommendSemanticResource(Resource):
    """ Recommend words with closest semantic meaning """

    @staticmethod
    @parse_params(
        # Argument("word", type=str, location="json", required=True, help="Word for semantic recommendation.")
        Argument(
            "sentence",
            type=list,
            location="json",
            required=True,
            help="Content of the sentence.",
        ),
        Argument(
            "index",
            location="json",
            required=True,
            type=int,
            help="Index of the word for recommendation.",
        ),
    )
    def post(sentence, index):
        # word = word.strip()
        # recs are tuple of (word, score)
        word = sentence[index]
        recs = W2vService.instance().word_score(word)
        recs = [rec[0].lower() for rec in recs]
        return recs


class RecommendLanguageModelResource(Resource):
    @staticmethod
    @parse_params(
        Argument(
            "sentence",
            type=list,
            location="json",
            required=True,
            help="Content of the sentence.",
        ),
        Argument(
            "index",
            location="json",
            required=True,
            type=int,
            help="Index of the word for recommendation.",
        ),
    )
    def post(sentence, index):
        recs = BertService.instance().word_score(sentence, index)
        recs = [rec.lower() for rec in recs]
        return recs
