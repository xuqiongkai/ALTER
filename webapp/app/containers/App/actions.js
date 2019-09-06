/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
    LOAD_REPOS,
    LOAD_REPOS_ERROR,
    LOAD_REPOS_SUCCESS,
    CHANGE_DATASET,
    REVERT_BACK_CHANGE,
    LOAD_TASK,
    LOAD_TASK_SUCCESS,
    LOAD_TASK_ERROR,
    RESET_STATE,
    NEXT_SENTENCE,
    PREVIOUS_SENTENCE,
    CLEAR_CHANGE,
    SHOW_MESSAGE_BAR,
    CLOSE_MESSAGE_BAR,
} from './constants';
import { LOAD_DATASET, LOAD_DATASET_ERROR, LOAD_DATASET_SUCCESS } from './constants';
import { CHANGE_SENTENCE } from './constants';
import { ADD_TEXT_CHANGE } from './constants';
import { SIGNIN, SIGNIN_SUCCESS, SIGNIN_ERROR } from './constants';
import { LOAD_SENTENCE, LOAD_SENTENCE_SUCCESS, LOAD_SENTENCE_ERROR } from './constants';
import {LOAD_SENTENCE_SCORE, LOAD_SENTENCE_SCORE_SUCCESS, LOAD_SENTENCE_SCORE_ERROR} from './constants';
import { SWITCH_MODE } from '../AnnotatePage/constants';

// import { LOAD_DATASET, LOAD_DATASET_SUCCESS, LOAD_DATASET_ERROR } from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadRepos() {
    return {
        type: LOAD_REPOS,
    };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function reposLoaded(repos, username) {
    return {
        type: LOAD_REPOS_SUCCESS,
        repos,
        username,
    };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function repoLoadingError(error) {
    return {
        type: LOAD_REPOS_ERROR,
        error,
    };
}

export function loadDataset() {
    return {
        type: LOAD_DATASET,
    };
}

export function datasetLoaded(sentences, dataset) {
    return {
        type: LOAD_DATASET_SUCCESS,
        sentences,
        dataset,
    };
}

export function datasetLoadingError(error) {
    return {
        type: LOAD_DATASET_ERROR,
        error,
    };
}

export function changeDataset(dataset) {
    return {
        type: CHANGE_DATASET,
        dataset,
    };
}

export function showMessageBar(variant, message) {
    return {
        type: SHOW_MESSAGE_BAR,
        variant,
        message,
    }
}

export function closeMessageBar() {
    return {
        type: CLOSE_MESSAGE_BAR,
    }
}

export function changeSentence(idx) {
    return {
        type: CHANGE_SENTENCE,
        idx,
    };
}

export function previousSentence() {
    return {
        type: PREVIOUS_SENTENCE,
    }
}

export function nextSentence() {
    return {
        type: NEXT_SENTENCE,
    }
}

export function addTextChange(change) {
    return {
        type: ADD_TEXT_CHANGE,
        change,
    };
}

export function revertChange(idx) {
    return {
        type: REVERT_BACK_CHANGE,
        idx,
    };
}

export function clearChange() {
    return {
        type: CLEAR_CHANGE,
    };
}

/*******************************************************************************/
/* SIGNIN 
/*******************************************************************************/

export function signin(username, password) {
    return {
        type: SIGNIN,
        username,
        password,
    };
}

export function signinSuccess(user) {
    return {
        type: SIGNIN_SUCCESS,
        user,
    };
}

export function signinError(error) {
    return {
        type: SIGNIN_ERROR,
        error,
    };
}

export function loadTask(task) {
    return {
        type: LOAD_TASK,
        task,
    };
}

export function loadTaskSuccess(sentences, annotationStatus) {
    return {
        type: LOAD_TASK_SUCCESS,
        sentences,
        annotationStatus,
    };
}

export function loadTaskError(error) {
    return {
        type: LOAD_TASK_ERROR,
        error,
    };
}

export function resetState() {
    return {
        type: RESET_STATE,
    };
}

export function loadSentence(idx) {
    return {
        type: LOAD_SENTENCE,
        idx,
    };
}

export function loadSentenceSuccess(sentence) {
    return {
        type: LOAD_SENTENCE_SUCCESS,
        sentence,
    };
}

export function loadSentenceError(error) {
    return {
        type: LOAD_SENTENCE_ERROR,
        error,
    };
}

export function loadSentenceScore(sentence) {
  return {
    type: LOAD_SENTENCE_SCORE,
    sentence,
  };
}

export function loadSentenceScoreSuccess(score) {
   return {
       type: LOAD_SENTENCE_SCORE_SUCCESS,
       score,
   };
}
  
export function loadSentenceScoreError(error) {
   return {
       type: LOAD_SENTENCE_SCORE_ERROR,
       error
   };
}

export function switchMode() {
    return {
        type: SWITCH_MODE
    };
}