import torch
import torch.nn as nn
from torch import optim
from torch.autograd import Variable
import opts, time

from nn_model.transformer import TransformerClassifier

import argparse
import sys
parser = argparse.ArgumentParser(description='train.py')
opts.model_opts(parser)
opts.train_opts(parser)
opt = parser.parse_args()

opt.cuda=torch.cuda.is_available() and opt.cuda
if opt.cuda:
   torch.cuda.manual_seed(opt.seed)
sys.stdout.flush()


def train_classification():
    """
    Train Privacy Preserved Translation Model
    """
    print("Initializing...")

    vocab = torch.load(opt.dataset + '.vocab')

    train_dataset = torch.load(opt.dataset + '.train')
    valid_dataset = torch.load(opt.dataset + '.valid')
    train_dataset.cuda = opt.cuda
    valid_dataset.cuda = opt.cuda

    train_dataset.iterate_dataset(opt.batch_size)
    valid_dataset.iterate_dataset(opt.batch_size)

    if opt.load_model:
        model = torch.load(opt.load_model[0])
    else:
        model = TransformerClassifier(vocab['vocab'].n_words, len(vocab['dict']), N=opt.layers,
                                      d_model=opt.hidden_size)

    if opt.cuda:
        model = model.cuda()

    optimizer_classifier = optim.Adam(model.parameters(), lr=opt.learning_rate)

    criterion_classifier = nn.NLLLoss(size_average=False)

    print("Training...")
    for i in range(1, opt.epochs + 1):
        train_loss, train_acc = train_classifier_epoch(train_dataset, model, optimizer_classifier, criterion_classifier, mode='train')
        valid_loss, valid_acc = train_classifier_epoch(valid_dataset, model, optimizer_classifier, criterion_classifier, mode='valid')
        print("Epoch:{}\n --Train L:{:.2f} Acc:{:.4f}\n --Valid L:{:.2f} Acc:{:.4f}".format(i, train_loss, train_acc, valid_loss, valid_acc))

        if i % opt.save_every == 0:
            torch.save(model,
                       opt.save_model + "_e{}_PPL{:.3f}.pt".format(i, valid_loss))
    print("Finish training!")

def train_classifier_epoch(dataset, model, optimizer, criterion, mode='train'):

    optimizer.zero_grad()
    if mode == 'train':
        model.train()
    else:
        model.eval()
    total_loss = 0
    total_sent = 0
    count=0

    total_match = 0
    for src_var, src_mask, src_lengths, label in dataset.batch_dataset:
        batch_size, _ = src_var.size()

        output = model.forward(src_var, src_mask)
        batch_loss = criterion.forward(output, label) / batch_size

        if mode == 'train':
            optimizer.zero_grad()
            batch_loss.backward()
            optimizer.step()
        total_loss += batch_loss.item()*batch_size
        total_sent += batch_size

        total_match += (output.max(dim=1)[1] == label).sum().item()

        count += 1
        if count % opt.print_every == 0:
            print("-Batch:{}  PPL:{:.2f}".format(count, batch_loss.item()))

    return total_loss/total_sent, total_match/total_sent


if __name__ == '__main__':
    torch.manual_seed(opt.seed)
    bt = time.time()
    train_classification()
    print("total time:", time.time() - bt)

