import gensim.models.keyedvectors as word2vec
import os, pdb


class W2vService:
    INSTACE = None

    @classmethod
    def create(cls):
        if cls.INSTACE is None:
            cls.INSTACE = W2vService()

    @classmethod
    def instance(cls):
        if cls.INSTACE is None:
            cls.create()
        return cls.INSTACE

    def __init__(self, top_n=20):
        self._initialised = False
        self.top_n = top_n

    def init(self, model_path):
        if self._initialised:
            return

        self.model_path = model_path
        print ("init" + model_path)
        if os.path.exists(self.model_path):
            self.model = word2vec.KeyedVectors.load_word2vec_format(
                model_path, binary=True
            )
        else:
            print("Please download the word2vec model.")
        self._initialised = True

    def sent_score(self, sent1, sent2):
        score = self.model.wmdistance(sent1, sent2)
        return score

    def word_score(self, word):
        result = self.model.similar_by_word(word, self.top_n)
        return result


if __name__ == "__main__":
    model_path = "./data/models/GoogleNews-vectors-negative300.bin"
    s = W2vService()
    s.init(model_path=model_path)
    print(s.sent_score(["hello", "world"], ["hey", "you"]))
    # s.sent_score(["hello", "world", "yes"])
    print(s.word_score("orange"))
