import argparse

def preprocess_opts(parser):
    """
    Options for data preparation
    """
    parser.add_argument('-train_src', required=True,
                    help="Path to training source")
    parser.add_argument('-valid_src', required=True,
                    help="Path to validation source")
    parser.add_argument('-train_label', required=True,
                    help="Path to training label")
    parser.add_argument('-valid_label', required=True,
                    help="Path to validation label")
    parser.add_argument('-src_length', type=int, default=100,
                        help="Maximum source sentence length")

    parser.add_argument('-save_data', required=True,
                    help="Output file for the prepared data")
    parser.add_argument('-vocab',
                    help="Path to vocabulary file")
    parser.add_argument('-attr', default='none',
                        help='Select task attr (gender/politic/race/none)')

def model_opts(parser):
    """
    Options for model construction
    """
    parser.add_argument('-word_vec_size', type=int, default=256,
                        help="Word Vector Dimension")
    parser.add_argument('-layers', type=int, default=2,
                        help='Number of layers for both encoder and decoder')
    parser.add_argument('-hidden_size', type=int, default=256,
                        help='Size of LSTM hidden states')

def train_opts(parser):
    parser.add_argument('-epochs', type=int, default=100,
                        help='Number of epochs')
    parser.add_argument('-batch_size', type=int, default=100,
                        help='Maximum train/eval batch size')
    parser.add_argument('-learning_rate', type=float, default=0.1,
                        help='Number of epochs')
    parser.add_argument('-cuda', action='store_true', default=False,
                        help='Use CUDA device')
    parser.add_argument('-dataset', default='./data', help='Dataset directory.')
    parser.add_argument('-save_model', default='model',
                        help="""Model filename (the model will be saved as
                        <save_model>_epochN_PPL.pt where PPL is the
                        validation perplexity""")
    parser.add_argument('-save_every', type=int, default=1,
                        help='Save models at this interval')
    parser.add_argument('-print_every', type=int, default=200,
                        help='Pring batch information at this interval')
    parser.add_argument('--seed', default=100, type=int, help='random seed')
    parser.add_argument('-mode', default='ig',
                        help='Statistic mode (ig/idf)')
    parser.add_argument('-vocab',
                        help="Path to vocabulary file")
    parser.add_argument('-load_model', default=None, nargs='+',
                        help="Load model path.")


# def translate_opts(parser):
#     """
#     Options for translation
#     """
#     parser.add_argument('-model', default=[], nargs='+',
#                         help="""Path to the model .pt files""")
#     parser.add_argument('-src',
#                         help="Path to test source")
#     parser.add_argument('-score',
#                         help="Path to test score file")
#     parser.add_argument('-vocab',
#                         help="Path to source vocabulary")
#     parser.add_argument('-output', default=None,
#                         help="Path to output predictions")
#     parser.add_argument('-batch_size', type=int, default=10,
#                         help='Batch size')
#     parser.add_argument('-max_sent_length', type=int, default=100,
#                         help='Maximum sentence length.')
#     parser.add_argument('-cuda', action='store_true', default=False,
#                         help='Use CUDA device')
#     parser.add_argument('--seed', default=100, type=int, help='random seed')
#     parser.add_argument('-mode', default='score',
#                         help='Select task mode (grad/score/mask)')
#     parser.add_argument('-saliency_mode', default='l2',
#                         help='Select saliency mode (l1/l2/zero/unk)')
#     parser.add_argument('-mask_percent', default=0, type=float,
#                         help='Percentile of words masked out')




