/*
 *
 * AnnotatePage actions
 *
 */

import { DEFAULT_ACTION, INVALIDATE_HISTORY, RESET_HISTORY } from './constants';
import { ADD_HISTORY, ADD_HISTORY_SUCCESS, ADD_HISTORY_ERROR } from './constants';
import { LOAD_SENTENCE_SCORE_LM, LOAD_SENTENCE_SCORE_LM_SUCCESS, LOAD_SENTENCE_SCORE_LM_ERROR } from './constants';
import { LOAD_HINT, LOAD_HINT_SUCCESS, LOAD_HINT_ERROR } from './constants';
import { LOAD_SENTENCE_METRICS, LOAD_SENTENCE_METRICS_SUCCESS, LOAD_SENTENCE_METRICS_ERROR } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function addHistory(changes) {
  return {
    type: ADD_HISTORY,
    changes,
    // task,
    // sentIdx,
    // changes
  };
}

export function addHistorySuccess() {
  return {
    type: ADD_HISTORY_SUCCESS,
  };
}

export function addHistoryError(error) {
  return {
    type: ADD_HISTORY_ERROR,
    error
  };
}

export function invalidateHistory() {
  return {
    type: INVALIDATE_HISTORY,
  };
}

export function resetHistory() {
  return {
    type: RESET_HISTORY,
  }
}

export function loadSentenceScoreLM(sentence) {
  return {
    type: LOAD_SENTENCE_SCORE_LM,
    sentence
  };
}

export function loadSentenceScoreLMSuccess(score) {
  return {
    type: LOAD_SENTENCE_SCORE_LM_SUCCESS,
    score
  };
}

export function loadSentenceScoreLMError(error) {
  return {
    type: LOAD_SENTENCE_SCORE_LM_ERROR,
    error
  };
}

export function loadHint(sentence, idx, model) {
  return {
    type: LOAD_HINT,
    sentence,
    idx,
    model,
  };
}

export function loadHintSuccess(hint) {
  return {
    type: LOAD_HINT_SUCCESS,
    hint
  };
}

export function loadHintError(error) {
  return {
    type: LOAD_HINT_ERROR,
    error
  };
}

export function loadSentenceMetrics(sentence, withWordScore) {
  return {
    type: LOAD_SENTENCE_METRICS,
    sentence,
    withWordScore,
  };
}

export function loadSentenceMetricsSuccess(sentence) {
  return {
    type: LOAD_SENTENCE_METRICS_SUCCESS,
    sentence
  };
}

export function loadSentenceMetricsError(error) {
  return {
    type: LOAD_SENTENCE_METRICS_ERROR,
    error
  };
}