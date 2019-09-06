/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';

export const LOAD_DATASET = 'App/LOAD_DATASET';
export const LOAD_DATASET_SUCCESS = 'App/LOAD_DATASET_SUCCESS';
export const LOAD_DATASET_ERROR = 'App/LOAD_DATASET_ERROR';

export const SHOW_MESSAGE_BAR = 'App/SHOW_MESSAGE_BAR';
export const CLOSE_MESSAGE_BAR = 'App/CLOSE_MESSAGE_BAR';

export const RESET_STATE = "App/RESET";

export const CHANGE_DATASET = 'App/CHANGE_DATASET';
export const CHANGE_SENTENCE = 'App/CHANGE_SENTENCE';
export const PREVIOUS_SENTENCE = 'App/PREVIOUS_SENTENCE';
export const NEXT_SENTENCE = 'App/NEXT_SENTENCE';

export const ADD_TEXT_CHANGE = 'App/Change/ADD';
export const REVERT_BACK_CHANGE = 'App/REVERT_CHANGE';
export const CLEAR_CHANGE = 'App/CLEAR_CHANGE';

export const SIGNIN = 'app/SIGNIN'
export const SIGNIN_SUCCESS = 'app/SIGNIN_SUCCESS'
export const SIGNIN_ERROR = 'app/SIGNIN_ERROR'

export const LOAD_TASK = 'App/LOAD_TASK';
export const LOAD_TASK_SUCCESS = 'App/LOAD_TASK_SUCCESS';
export const LOAD_TASK_ERROR = 'App/LOAD_TASK_ERROR';

export const LOAD_SENTENCE = 'App/LOAD_SENTENCE';
export const LOAD_SENTENCE_SUCCESS = 'App/LOAD_SENTENCE_SUCCESS';
export const LOAD_SENTENCE_ERROR = 'App/LOAD_SENTENCE_ERROR';

export const LOAD_SENTENCE_SCORE = 'App/LOAD_SENTENCE_SCORE';
export const LOAD_SENTENCE_SCORE_SUCCESS = 'App/LOAD_SENTENCE_SCORE_SUCCESS';
export const LOAD_SENTENCE_SCORE_ERROR = 'App/LOAD_SENTENCE_SCORE_ERROR';
