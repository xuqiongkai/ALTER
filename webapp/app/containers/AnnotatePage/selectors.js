import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the annotatePage state domain
 */

const selectAnnotatePageDomain = state => state.annotatePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AnnotatePage
 */

const makeSelectAnnotatePage = () =>
    createSelector(
        selectAnnotatePageDomain,
        substate => substate,
    );

export const makeSelectAddHistoryLoading = () =>
    createSelector(
        selectAnnotatePageDomain,
        state => state.changesLoading,
    );

export const makeSelectAddHistoryError = () =>
    createSelector(
        selectAnnotatePageDomain,
        state => state.changesError,
    );

export const makeSelectAddHistoryOk = () =>
    createSelector(
        selectAnnotatePageDomain,
        state => state.addHistoryOk,
    );

export const makeSelectSentenceScoreLM = () =>
    createSelector(
        selectAnnotatePageDomain,
        state => state.scoreLM,
    );

export const makeSelectHint = () =>
    createSelector(
        selectAnnotatePageDomain,
        state => state.hint,
    );

export const makeSelectHintLoading = () =>
    createSelector(
        selectAnnotatePageDomain,
        state => state.hintLoading,
    );

export default makeSelectAnnotatePage;
export { selectAnnotatePageDomain };
