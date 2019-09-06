/*
 *
 * AnnotatePage reducer
 *
 */
import produce from 'immer';
import {
    DEFAULT_ACTION,
    ADD_HISTORY,
    ADD_HISTORY_SUCCESS,
    ADD_HISTORY_ERROR,
    INVALIDATE_HISTORY,
    LOAD_SENTENCE_SCORE_LM, LOAD_SENTENCE_SCORE_LM_SUCCESS, LOAD_SENTENCE_SCORE_LM_ERROR,
    LOAD_HINT, LOAD_HINT_SUCCESS, LOAD_HINT_ERROR, RESET_HISTORY
} from './constants';

export const initialState = {
    addHistoryOk: true,
    addHistoryLoading: false,
    addHistoryError: false,

    scoreLM: false,
    scoreLMLoading: false,
    scoreLMError: false, 

    hint: false,
    hintLoading: false,
    hintError: false,
};

/* eslint-disable default-case, no-param-reassign */
const annotatePageReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case DEFAULT_ACTION:
                break;

            case ADD_HISTORY:
                draft.addHistoryLoading = true;
                draft.addHistoryError = false;
                draft.addHistoryOk = false;
                break;

            case ADD_HISTORY_SUCCESS:
                draft.addHistoryOk = true;
                draft.addHistoryLoading = false;
                break;

            case ADD_HISTORY_ERROR:
                draft.addHistoryLoading = false;
                draft.addHistoryError = action.error;
                break;

            case INVALIDATE_HISTORY:
                draft.addHistoryOk = false;
                break;

            case RESET_HISTORY:
                draft.addHistoryOk = true;
                break;

            case LOAD_SENTENCE_SCORE_LM:
                draft.scoreLMLoading = true;
                draft.scoreLMError = false;
                draft.scoreLM = false;
                break
            
            case LOAD_SENTENCE_SCORE_LM_SUCCESS:
                draft.scoreLMLoading = false;
                draft.scoreLMError = false;
                draft.scoreLM = action.score;
                break
            
            case LOAD_SENTENCE_SCORE_LM_ERROR:
                draft.scoreLMLoading = false;
                draft.scoreLMError = action.error;
                draft.scoreLM = false;
                break

            case LOAD_HINT:
                draft.hintLoading = true;
                draft.hintError = false;
                draft.hint = false;
                break
            
            case LOAD_HINT_SUCCESS:
                draft.hintLoading = false;
                draft.hintError = false;
                draft.hint = action.hint;
                break
            
            case LOAD_HINT_ERROR:
                draft.hintLoading = false;
                draft.hintError = action.error;
                draft.hint = false;
                break
        }
    });

export default annotatePageReducer;
