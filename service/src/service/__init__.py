import logging


def init_service(config):
    logging.info("Loading classification service ...")
    # from class_service import ClassificationService
    from service.class_service import ClassificationService

    ClassificationService.instance().init(
        config.CLASSIFIER_MODEL_PATH, config.CLASSIFIER_VOCAB_PATH
    )

    logging.info("Loading semantic service ...")
    from service.w2v_service import W2vService

    W2vService.instance().init(model_path=config.W2V_MODEL_PATH)

    logging.info("Loading language model service ...")
    from service.bert import BertService

    BertService.instance().init(config.BERT_MODEL_TYPE, config.BERT_MODEL_DIR)
