import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import {
    loadSentenceScoreError,
    loadSentenceScoreSuccess,
    loadSentenceSuccess,
    loadSentenceError,
} from '../App/actions';
import { addHistorySuccess, addHistoryError, loadHintSuccess, loadHintError, loadSentenceMetricsSuccess, loadSentenceMetricsError, loadSentenceMetrics } from './actions';
import { loadSentenceScoreLMSuccess, loadSentenceScoreLMError } from './actions';
import { LOAD_SENTENCE_SCORE, LOAD_SENTENCE } from '../App/constants';
import { SERVICE_SERVER, REFRESH_AT_EACH_STEP } from 'config.js';
import request from 'utils/request';
import { LOAD_HINT, LOAD_SENTENCE_SCORE_LM, ADD_HISTORY, LOAD_SENTENCE_METRICS } from './constants';
import {
    makeSelectTask,
    makeSelectCurrentSentenceIdx,
    makeSelectCurrentChanges,
    makeSelectCurrentSentenceOrigin,
} from '../App/selectors';

export default function* annotatePageSaga() {
    console.log('binded');
    yield takeLatest(LOAD_SENTENCE, loadSentenceAsync);
    yield takeLatest(ADD_HISTORY, addHistoryAsync);
    yield takeLatest(LOAD_SENTENCE_METRICS, loadSentenceMetricsAsync);
    // yield takeLatest(LOAD_SENTENCE_SCORE, loadSentenceScore);
    // yield takeLatest(LOAD_SENTENCE_SCORE_LM, loadSentenceScoreLM);
    yield takeLatest(LOAD_HINT, loadHintAsync);
}

export function* loadSentenceAsync(action) {
    let idx = action.idx;
    let task = yield select(makeSelectTask());
    const requestURL = `${SERVICE_SERVER}/sentence/${task.id}/${idx}`;
    try {
        let sentence = yield call(request, requestURL, {
            credentials: 'include',
        });
        yield put(loadSentenceSuccess(sentence));
        sentence = sentence.words.map(w => w.token).join(' ');
        yield put(loadSentenceMetrics(sentence));
    } catch (error) {
        console.log(error);
        yield put(loadSentenceError(error));
    }
}

export function* loadSentenceScoreAsync(action) {
    let sentence = action.sentence;
    // let sentence = changes[changes.length-1].sentence;
    // sentence = sentence.map((w) => w.token).join(' ');

    const requestURL = `${SERVICE_SERVER}/sentence/class`;
    const options = {
        credentials: 'include',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sentence,
        }),
    };

    try {
        let score = yield call(request, requestURL, options);
        score = parseFloat(score);
        yield put(loadSentenceScoreSuccess(score));
    } catch (error) {
        yield put(loadSentenceScoreError(error));
    }
}

export function* addHistoryAsync(action) {
    // let { task, sentIdx, changes } = action;
    let task = yield select(makeSelectTask());
    let sentIdx = yield select(makeSelectCurrentSentenceIdx());
    let changes = yield select(makeSelectCurrentChanges());
    console.log(task, sentIdx, changes);

    const requestURL = `${SERVICE_SERVER}/job/history/${task.id}/${sentIdx}`;
    const options = {
        credentials: 'include',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            changes,
        }),
    };

    try {
        let rsl = yield call(request, requestURL, options);
        yield put(addHistorySuccess());
    } catch (error) {
        yield put(addHistoryError(error));
    }
}

export function* loadSentenceScoreLMAsync(action) {
    let sentence = action.sentence;

    const requestURL = `${SERVICE_SERVER}/sentence/lm`;
    const options = {
        credentials: 'include',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sentence,
        }),
    };

    try {
        let score = yield call(request, requestURL, options);
        score = parseFloat(score);
        yield put(loadSentenceScoreLMSuccess(score));
    } catch (error) {
        console.log(error)
        yield put(loadSentenceScoreLMError(error));
    }
}

export function* loadHintAsync(action) {
    let sentence = action.sentence;
    let index = action.idx;
    let model = action.model;

    sentence = sentence.split(' ');

    const requestURL = `${SERVICE_SERVER}/recommend/${model}`;
    const options = {
        credentials: 'include',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sentence,
            index
        }),
    };

    try {
        let hint = yield call(request, requestURL, options);
        yield put(loadHintSuccess(hint));
    } catch (error) {
        console.log(error)
        yield put(loadHintError(error));
    }
}

export function* loadSentenceMetricsAsync(action) {
    let sentence = action.sentence;

    // this should barely happen, as it means the user is doing some
    // toy work without selecting a sentence
    let origin = yield select(makeSelectCurrentSentenceOrigin());
    if (origin) {
        origin = origin.map(w => w.token).join(' ');
    } else {
        origin = sentence;
    }

    let withWordScore = REFRESH_AT_EACH_STEP ? 1 : 0;

    const requestURL = `${SERVICE_SERVER}/sentence/metrics`;
    const options = {
        credentials: 'include',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sentence,
            origin,
            withWordScore
        }),
    };

    try {
        let sentence = yield call(request, requestURL, options);
        yield put(loadSentenceMetricsSuccess(sentence));
    } catch (error) {
        console.log(error)
        yield put(loadSentenceMetricsError(error));
    }
}