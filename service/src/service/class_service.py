
import torch
from torch.autograd import Variable

class ClassificationService():

    INSTACE = None
    @classmethod
    def create(cls):
        if cls.INSTACE is None:
            cls.INSTACE = ClassificationService()

    @classmethod
    def instance(cls):
        if cls.INSTACE is None:
            cls.create()
        return cls.INSTACE
        

    def __init__(self, gpu=True):
        self.gpu = gpu

    def init(self, model_path, vocab_path):
        import sys
        sys.path.append('classification')

        self.model = torch.load(model_path)
        self.model.eval()

        vocab = torch.load(vocab_path)
        self.dict = vocab['dict']
        self.vocab = vocab['vocab']


    def sent_score(self, sent):
        sent = [word.strip().lower() for word in sent]

        # sent_idx = [vocab.word2index[word] for word in sent if word in vocab.word2index]
        sent_idx = [self.vocab.word2index[word] if word in word in self.vocab.word2index else 0 for word in sent]

        src_var = Variable(torch.LongTensor([sent_idx]))
        src_mask = (src_var > 3).float()
        if self.gpu:
            src_var = src_var.cuda()
            src_mask = src_mask.cuda()

        score = self.model(src_var, src_mask)
        score = torch.exp(score)[0].cpu().detach().numpy()

        return score

    def word_score(self, sent):
        sent = [word.strip().lower() for word in sent]
        sent_len = len(sent)
        # sent_idx = [vocab.word2index[word] for word in sent if word in vocab.word2index]
        sent_idx = [self.vocab.word2index[word] if word in word in self.vocab.word2index else 0 for word in sent]

        src_var = Variable(torch.LongTensor([sent_idx]))
        src_var = src_var.repeat(sent_len+1, 1)
        src_mask = (src_var > 3).float()
        for i in range(sent_len):
            src_var[i, i] = 0

        if self.gpu:
            src_var = src_var.cuda()
            src_mask = src_mask.cuda()

        score = self.model(src_var, src_mask)
        score = torch.exp(score).cpu().detach().numpy()

        for i in range(sent_len):
            score[i] -= score[sent_len]

        return score[:sent_len]


if __name__ == '__main__':

    model_path = './data/political_model/c_e10_PPL0.020.pt'
    vocab_path = './data/political_model/.vocab'

    # service = ClassificationService()
    # service.init(model_path, vocab_path)

    # service.sent_score(['The', 'food', 'is', 'delicious'])
    # service.word_score(['she', 'like', 'the', 'cake'])

    service = ClassificationService.instance()
    service.init(model_path, vocab_path)

    s = service.sent_score(['I', 'see', 'Obama', 'and', 'Trump'])
    print(s)
    s = service.word_score(['I', 'see', 'Obama', 'and', 'Trump'])
    print(s)

