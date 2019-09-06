import argparse

from wrapper import TextDataset, Vocabulary
import opts, time
import torch

parser = argparse.ArgumentParser(description='preprocess.py')
opts.preprocess_opts(parser)
opt = parser.parse_args()
print(opt)


def preprocess_classification():
    print('Preparing datasets...')
    bt = time.time()
    vocab = Vocabulary()

    train_dataset = TextDataset(opt.train_src, opt.train_label, opt.src_length)  # we reuse train_src
    valid_dataset = TextDataset(opt.valid_src, opt.valid_label, opt.src_length)
    train_dataset.add_vocab(vocab)
    dict = {}
    if opt.attr == 'gender':
        dict = {'male': 0, 'female': 1}
        train_dataset.generate_dataset(vocab, 'GENDER', dict)
        valid_dataset.generate_dataset(vocab, 'GENDER', dict)
    elif opt.attr == 'politic':
        dict = {'democratic': 0, 'republican': 1}
        train_dataset.generate_dataset(vocab, 'POLITICS', dict)
        valid_dataset.generate_dataset(vocab, 'POLITICS', dict)
    elif opt.attr == 'race':
        dict = {'white': 0, 'aa': 1}
        train_dataset.generate_dataset(vocab, 'RACE', dict)
        valid_dataset.generate_dataset(vocab, 'RACE', dict)

    else:
        train_dataset.generate_dataset(vocab)
        valid_dataset.generate_dataset(vocab)

    torch.save({'vocab':vocab, 'dict': dict}, opt.save_data + ".vocab")
    torch.save(train_dataset, opt.save_data + ".train")
    torch.save(valid_dataset, opt.save_data + ".valid")
    print("total time:", time.time() - bt)


if __name__ == '__main__':
    preprocess_classification()
