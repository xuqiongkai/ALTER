
import torch
from torch.autograd import Variable
from torchvision import transforms
from PIL import Image
import re
import os
import random
import numpy as np
from collections import Counter
from collections import OrderedDict
import xml.etree.ElementTree as ElementTree

random.seed(123)

PAD_WORD = '<b>'
UNK_WORD = '<unk>'
BOS_WORD = '<s>'
EOS_WORD = '</s>'

class Vocabulary(object):
    def __init__(self):
        self.word2index = {PAD_WORD:0, BOS_WORD:1, EOS_WORD:2, UNK_WORD:3}
        self.word2count = {PAD_WORD:0, BOS_WORD:0, EOS_WORD:0, UNK_WORD:0}
        self.index2word = {0:PAD_WORD, 1:BOS_WORD, 2:EOS_WORD, 3:UNK_WORD}
        self.n_words = 4  # Count SOS, EOS and PAD

    def size(self):
        return len(self.word2index)

    def add_sentence(self, sentence):
        for word in sentence:
            self.add_word(word)

    def add_word(self, word):
        if word not in self.word2index:
            self.word2index[word] = self.n_words
            self.word2count[word] = 1
            self.index2word[self.n_words] = word
            self.n_words += 1
        else:
            self.word2count[word] += 1


class Dataset(object):
    def load_text(self, corpus_path, sent_length):
        corpus = []
        with open(corpus_path, 'r') as f:
            for line in f:
                words = line.strip().split(' ')[:sent_length]#+[EOS_WORD]
                corpus.append(words)
        return corpus

    def load_label(self, label_path):
        corpus = []
        with open(label_path, 'r') as f:
            for line in f:
                attribs = ElementTree.fromstring(line).attrib
                corpus.append(attribs)
        return corpus

class TextDataset(Dataset):
    def __init__(self, txt_path, label_path=None, max_length=100):
        self.txt_path = txt_path
        self.label_path = label_path
        self.max_length = max_length

        self.corpus = self.load_text(self.txt_path, self.max_length)

        if self.label_path:
            self.labels = self.load_label(self.label_path)

    def add_vocab(self, vocab):
        for sent in self.corpus:
            vocab.add_sentence(sent)

    def generate_dataset(self, vocab, attribute=None, attribute_dict=None):
        if attribute:
            self.generate_attribute(attribute, attribute_dict)
        self.dataset = [[vocab.word2index[word] for word in sent if word in vocab.word2index] for sent in self.corpus]

    def generate_attribute(self, attribute, attribute_dict):
        self.attributes = [attribute_dict[ l[attribute] ] for l in self.labels]




    def iterate_dataset(self, batch_size):
        idx = 0
        size = len(self.dataset)
        self.batch_dataset = []
        while idx < size:
            data_batch = self.dataset[idx: idx+batch_size]
            if self.label_path:
                label_batch = self.attributes[idx: idx+batch_size]
                batch = self.wrap_batch(data_batch, label_batch)
            else:
                batch = self.wrap_batch(data_batch, None)
            self.batch_dataset.append(batch)
            idx += batch_size

    def wrap_batch(self, data_batch, label_batch=None):

        max_length = max([len(sent) for sent in data_batch]) + 1
        src_list = [[1] + sent + [0] * (max_length - len(sent) - 1) for sent in data_batch]
        src_mask = [[ 1  if word > 0 else 0 for word in sent] for sent in src_list]

        src_var = Variable(torch.LongTensor(src_list))
        src_mask = Variable(torch.FloatTensor(src_mask))

        if self.cuda:
            src_var = src_var.cuda()
            src_mask = src_mask.cuda()

        if label_batch:
            label_batch = Variable(torch.LongTensor(label_batch))
            if self.cuda:
                label_batch = label_batch.cuda()
        return src_var, src_mask, max_length, label_batch

