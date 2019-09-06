"""
Defines the blueprint for the users
"""
from flask import Blueprint
from flask_restful import Api

from resources import SentenceClassResource
from resources import SentenceLmResource
from resources import SentenceWmdResource
from resources import WordClassResource
from resources import RecommendLanguageModelResource
from resources import RecommendSemanticResource
from resources import SentenceMetricsResource

# from resources import SentenceWmdResource, SentenceLmResource,
# from resources import RecommendSemanticResource

ANALYSIS_BLUEPRINT = Blueprint("analysis", __name__)

# Api(ANALYSIS_BLUEPRINT).add_resource(SentenceResource, '/sentence')

# sentence level analysis APIs
Api(ANALYSIS_BLUEPRINT).add_resource(SentenceWmdResource, "/sentence/wmd")
Api(ANALYSIS_BLUEPRINT).add_resource(SentenceLmResource, "/sentence/lm")
Api(ANALYSIS_BLUEPRINT).add_resource(SentenceClassResource, "/sentence/class")
Api(ANALYSIS_BLUEPRINT).add_resource(SentenceMetricsResource, "/sentence/metrics")

# wrod score service
Api(ANALYSIS_BLUEPRINT).add_resource(WordClassResource, "/word/class")

# recommendation service
Api(ANALYSIS_BLUEPRINT).add_resource(
    RecommendLanguageModelResource, "/recommend/language_model"
)
Api(ANALYSIS_BLUEPRINT).add_resource(RecommendSemanticResource, "/recommend/semantic")
