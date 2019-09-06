/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from 'immer';
import {
    LOAD_REPOS_SUCCESS,
    LOAD_REPOS,
    LOAD_REPOS_ERROR,
    CHANGE_SENTENCE,
    ADD_TEXT_CHANGE,
    REVERT_BACK_CHANGE,
    SIGNIN,
    SIGNIN_SUCCESS,
    SIGNIN_ERROR,
    LOAD_TASK,
    LOAD_TASK_SUCCESS,
    LOAD_TASK_ERROR,
    RESET_STATE,
    PREVIOUS_SENTENCE,
    NEXT_SENTENCE,
    CLEAR_CHANGE,
    SHOW_MESSAGE_BAR,
    CLOSE_MESSAGE_BAR,
} from './constants';
import { LOAD_DATASET, LOAD_DATASET_SUCCESS, LOAD_DATASET_ERROR } from './constants';
import { LOAD_SENTENCE, LOAD_SENTENCE_SUCCESS, LOAD_SENTENCE_ERROR } from './constants';
import { CHANGE_DATASET } from './constants';
import {
    LOAD_SENTENCE_SCORE,
    LOAD_SENTENCE_SCORE_SUCCESS,
    LOAD_SENTENCE_SCORE_ERROR,
} from './constants';
import { LOAD_SENTENCE_METRICS, LOAD_SENTENCE_METRICS_SUCCESS, LOAD_SENTENCE_METRICS_ERROR, SWITCH_MODE, ADD_HISTORY, INVALIDATE_HISTORY } from '../AnnotatePage/constants';



let words = "";
    // "Outlines never take up space , as they are drawn outside of an element's content Outlines never take up space , as they are drawn outside of an element's content Outlines never take up space , as they are drawn outside of an element's content Outlines never take up space , as they are drawn outside of an element's content";
    

const emptyData = {
    loading: false,
    error: false,
    sentences: [],
    annotationStatus: [],
    currentIdx: false,

    currentSentence: [],
    currentSentenceLoading: false,
    currentSentenceError: false,

    score: false,
    scoreLoading: false,
    scoreError: false,

    metrics: {
        class: false,
        lm: false,
        wmd: false,
    },

    changes: [
        // { opt: 'edit', sentence: words },
        // { opt: 'exchange', sentence: words },
        // { opt: 'edit', sentence: words },
        // { opt: 'recommendation', sentence: words },
    ],
};

// The initial state of the App
export const initialState = {
    loading: false,
    error: false,
    currentUser: false,
    userData: {
        repositories: false,
    },
    dataset: 'default',

    task: false,

    data: Object.assign({}, emptyData),
    user: {
        loading: false,
        data: false,
        error: false,
    },

    signinForm: false,
    auxiliary: true,

    messageBar: {
        open: false,
        variant: false,
        message: false,
    }
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case LOAD_REPOS:
                draft.loading = true;
                draft.error = false;
                draft.userData.repositories = false;
                break;

            case LOAD_REPOS_SUCCESS:
                draft.userData.repositories = action.repos;
                draft.loading = false;
                draft.currentUser = action.username;
                break;

            case LOAD_REPOS_ERROR:
                draft.error = action.error;
                draft.loading = false;
                break;

            case LOAD_DATASET:
                draft.data.loading = true;
                draft.data.error = false;
                draft.data.sentences = [];
                break;

            case LOAD_DATASET_SUCCESS:
                draft.data.sentences = action.sentences;
                draft.data.loading = false;
                draft.data.dataset = action.dataset;
                break;

            case LOAD_DATASET_ERROR:
                draft.data.loading = false;
                draft.data.error = action.error;
                break;

            case CHANGE_DATASET:
                draft.dataset = action.dataset;
                break;

            case CHANGE_SENTENCE:
                draft.data.currentIdx = action.idx;
                // draft.data.currentSentence = [...draft.data.sentences[draft.data.currentIdx]];
                // draft.data.changes = [];
                break;

            case PREVIOUS_SENTENCE:
                draft.data.currentIdx = Math.max(0, draft.data.currentIdx - 1);
                break
            
            case NEXT_SENTENCE:
                draft.data.currentIdx = Math.min(draft.data.sentences.length-1, draft.data.currentIdx + 1);
                break

            case ADD_TEXT_CHANGE:
                // if (draft.data.currentIdx < draft.data.annotationStatus.length) {
                //     draft.data.annotationStatus[draft.data.currentIdx] = true;
                // }
                draft.data.changes.push(action.change);
                break;

            case REVERT_BACK_CHANGE:
                draft.data.changes = draft.data.changes.slice(0, action.idx + 1);
                let words = draft.data.changes[draft.data.changes.length - 1]['sentence']
                    .split(' ')
                    .map(w => ({
                        token: w,
                        weight: 0,
                    }));
                draft.data.currentSentence = words;
                break;

            case CLEAR_CHANGE:
                if (draft.data.currentIdx !== false && draft.data.currentIdx < draft.data.annotationStatus.length) {
                    draft.data.currentSentence = draft.data.sentences[draft.data.currentIdx];
                    draft.data.changes = [];
                    draft.data.annotationStatus[draft.data.currentIdx] = false;
                }
                break;

            case SIGNIN:
                draft.user.error = false;
                draft.user.loading = true;
                draft.signinForm = {
                    username: action.username,
                    password: action.password,
                };
                break;

            case SIGNIN_SUCCESS:
                draft.user.loading = false;
                draft.user.data = action.user;
                draft.signinForm = false;

                break;

            case SIGNIN_ERROR:
                draft.user.loading = false;
                draft.user.error = action.error;
                draft.signinForm = false;
                break;

            case LOAD_TASK:
                draft.data.loading = true;
                draft.data.error = false;
                draft.data.sentences = [];
                draft.data.annotationStatus = [];
                draft.task = action.task;
                break;

            case LOAD_TASK_SUCCESS:
                draft.data.sentences = action.sentences;
                draft.data.annotationStatus = action.annotationStatus;
                draft.data.loading = false;
                break;

            case LOAD_TASK_ERROR:
                draft.data.sentences = [];
                draft.data.loading = false;
                draft.data.error = action.error;
                break;

            case RESET_STATE:
                draft.data = Object.assign({}, emptyData);
                break;

            case LOAD_SENTENCE:
                draft.data.currentSentence = [];
                draft.data.currentSentenceLoading = true;
                draft.data.currentSentenceError = false;
                draft.data.score = false
                draft.data.changes = [];
                break;

            case LOAD_SENTENCE_SUCCESS:
                draft.data.currentSentenceLoading = false;
                draft.data.currentSentenceError = false;
                draft.data.currentSentence = action.sentence.words;
                draft.data.score = action.sentence.score;
                draft.data.changes = action.sentence.changes;
                break;

            case LOAD_SENTENCE_ERROR:
                draft.data.currentSentenceLoading = false;
                draft.data.currentSentenceError = action.error;
                break;

            case LOAD_SENTENCE_SCORE:
                draft.data.scoreLoading = true;
                draft.data.scoreError = false;
                draft.data.score= false;
                break;

            case LOAD_SENTENCE_SCORE_SUCCESS:
                draft.data.scoreLoading = false;
                draft.scoreError = false;
                draft.data.score = action.score;
                break;

            case LOAD_SENTENCE_SCORE_ERROR:
                draft.data.scoreLoading = false;
                draft.data.scoreError = action.error;
                draft.data.score = false;
                break;

            case LOAD_SENTENCE_METRICS:
                draft.data.currentSentenceLoading = true;
                draft.data.currentSentenceError = false;
                // draft.data.currentSentence = [];
                // draft.data.metrics.class = false;
                // draft.data.metrics.wmd = false;
                // draft.data.metrics.lm = false;
                break;

            case LOAD_SENTENCE_METRICS_SUCCESS:
                draft.data.currentSentenceLoading = false;
                draft.data.currentSentenceError = false;
                if ('words' in action.sentence) {
                    draft.data.currentSentence = action.sentence.words;
                }
                Object.keys(action.sentence.metrics).map((key, index) => {
                    draft.data.metrics[key] = parseFloat(action.sentence.metrics[key]);
                })
                // draft.data.currentSentence = action.sentence.words;
                // draft.data.metrics = action.sentence.metrics;
                // draft.data.changes = action.sentence.changes;
                break;

            case LOAD_SENTENCE_METRICS_ERROR:
                draft.data.currentSentenceLoading = false;
                draft.data.currentSentenceError = action.error;
                break;

            case SWITCH_MODE:
                draft.auxiliary = !draft.auxiliary;
                break;

            case ADD_HISTORY:
                if (draft.data.currentIdx < draft.data.annotationStatus.length) {
                    draft.data.annotationStatus[draft.data.currentIdx] = action.changes && action.changes.length > 0.
                }
                break

            case SHOW_MESSAGE_BAR:
                draft.messageBar.open = true;
                draft.messageBar.variant = action.variant;
                draft.messageBar.message = action.message;
                break
            case CLOSE_MESSAGE_BAR:
                draft.messageBar.open = false;
                // draft.messageBar.variant = false;
                // draft.messageBar.message = false;
                break

        }
    });

export default appReducer;
