import pdb
from pytorch_pretrained_bert import BertTokenizer, BertModel, BertForMaskedLM
import numpy as np
import torch
import torch.nn.functional as F


class BertService:
    INSTACE = None

    @classmethod
    def create(cls):
        if cls.INSTACE is None:
            cls.INSTACE = BertService()

    @classmethod
    def instance(cls):
        if cls.INSTACE is None:
            cls.create()
        return cls.INSTACE

    def __init__(self, topk=20, gpu=True):
        self.gpu = gpu
        self.topk = topk

    def init(self, model_type, model_dir):
        self.model_type = model_type
        self.model_dir = model_dir
        self.tokenizer = BertTokenizer.from_pretrained(model_type, cache_dir=model_dir)
        self.model = BertForMaskedLM.from_pretrained(model_type, cache_dir=model_dir)
        self.model.eval()
        if self.gpu:
            self.model.to("cuda")

    def bert_forward(self, sent):
        sent = ["[CLS]"] + sent + ["[SEP]", "[SEP]"]

        tokenized_text = []
        for word in sent:
            if word in self.tokenizer.basic_tokenizer.never_split:
                tokenized_text.append(word)
            elif word in self.tokenizer.vocab:
                tokenized_text.append(word)
            else:
                tokenized_text.append("[UNK]")
        # print(tokenized_text)

        indexed_tokens = self.tokenizer.convert_tokens_to_ids(tokenized_text)
        segments_ids = [0] * (len(tokenized_text) - 1) + [1]

        tokens_tensor = torch.tensor([indexed_tokens])
        segments_tensors = torch.tensor([segments_ids])

        # import pdb; pdb.set_trace()

        if self.gpu:
            tokens_tensor = tokens_tensor.to("cuda")
            segments_tensors = segments_tensors.to("cuda")

        with torch.no_grad():
            predictions = self.model(tokens_tensor, segments_tensors)

        predictions = predictions[0, 1:-2, :]
        indexed_tokens = indexed_tokens[1:-2]
        return predictions, indexed_tokens

    def sent_score(self, sent):
        predictions, indexed_tokens = self.bert_forward(sent)
        scores = F.log_softmax(predictions, dim=1)

        ppl = 0
        for i in range(len(indexed_tokens)):
            ppl += scores[i, indexed_tokens[i]]

        ppl = ppl.cpu().item()
        ppl /= len(indexed_tokens)
        ppl = np.exp(-ppl)
        return ppl

    def word_score(self, sent, idx):
        if idx < 0 or idx >= len(sent):
            return -1
        else:
            predictions, indexed_tokens = self.bert_forward(sent)
            top_scores, top_indices = torch.topk(predictions[idx], self.topk)
            top_indices = top_indices.cpu().detach().numpy()
            top_words = self.tokenizer.convert_ids_to_tokens(top_indices)

            return top_words


if __name__ == "__main__":
    model_dir = "/media/temp/lm/models"
    model_type = "bert-base-cased"
    bs = BertService()
    bs.init(model_type=model_type, model_dir=model_dir)

    sent = ["The", "food", "of", "that", "restaurant", "is", "very", "delicious", "."]

    sent = ["I", "love", "you", "papa", ".", "This", "tree", "great"]
    print(bs.sent_score(sent))
    print(bs.word_score(sent, 2))

    import pdb; pdb.set_trace()
