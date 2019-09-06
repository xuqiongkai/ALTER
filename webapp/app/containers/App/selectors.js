/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = state => state.global || initialState;

const selectRouter = state => state.router;

// const makeSelectCurrentUser = () =>
//     createSelector(
//         selectGlobal,
//         globalState => globalState.currentUser,
//     );

const makeSelectLoading = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.loading,
    );

const makeSelectError = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.error,
    );

const makeSelectRepos = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.userData.repositories,
    );

const makeSelectLocation = () =>
    createSelector(
        selectRouter,
        routerState => routerState.location,
    );

const makeSelectDataset = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.dataset,
    );

const makeSelectSentences = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.data.sentences,
    );

export const makeSelectSentencesLoading = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.data.currentSentenceLoading,
    );

export const makeSelectAnnotationStatus = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.data.annotationStatus,
    );

const makeSelectDatasetLoading = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.data.loading,
    );

const makeSelectSentenceCount = () =>
    createSelector(
        selectGlobal,
        globalState => {
            return globalState.data.sentences.length;
        },
    );

const makeSelectCurrentSentence = () =>
    createSelector(
        selectGlobal,
        globalState => {
            // return globalState.data.sentences[globalState.data.currentIdx];
            return globalState.data.currentSentence;
        },
    );

export const makeSelectCurrentSentenceOrigin = () =>
    createSelector(
        selectGlobal,
        globalState => {
            return globalState.data.sentences[globalState.data.currentIdx];
            // return globalState.data.currentSentence
        },
    );

export const makeSelectCurrentSentenceIdx = () =>
    createSelector(
        selectGlobal,
        globalState => {
            return globalState.data.currentIdx;
        },
    );

const makeSelectCurrentChanges = () =>
    createSelector(
        selectGlobal,
        globalState => {
            return globalState.data.changes;
        },
    );

export const makeSelectSigninForm = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.signinForm,
    );

export const makeSelectSigninStatus = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.user.error == false,
    );

export const makeSelectTask = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.task,
    );

export const makeSelectCurrentScore = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.data.score,
    );

export const makeSelectPreviousSentenceAvailable = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.data.sentences && globalState.data.currentIdx > 0,
    );

export const makeSelectNextSentenceAvailable = () =>
    createSelector(
        selectGlobal,
        globalState =>
            globalState.data.sentences &&
            globalState.data.currentIdx < globalState.data.sentences.length,
    );

export const makeSelectSentenceMetrics = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.data.metrics,
    );

export const makeSelectSentenceLoading = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.data.currentSentenceLoading,
    );

export const makeSelectUser = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.user.data,
    );

export const makeSelectMode = () =>
    createSelector(
        selectGlobal,
        globalState => globalState.auxiliary,
    );

export const makeSelectMessageBar= () =>
    createSelector(
        selectGlobal,
        globalState => globalState.messageBar
    )

export {
    selectGlobal,
    // makeSelectCurrentUser,
    makeSelectLoading,
    makeSelectError,
    makeSelectRepos,
    makeSelectLocation,
    makeSelectDataset,
    makeSelectDatasetLoading,
    makeSelectSentences,
    makeSelectSentenceCount,
    makeSelectCurrentSentence,
    makeSelectCurrentChanges,
};
