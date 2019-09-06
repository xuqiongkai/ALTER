import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the taskPage state domain
 */

const selectTaskPageDomain = state => state.taskPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by TaskPage
 */

const makeSelectTaskPage = () =>
    createSelector(
        selectTaskPageDomain,
        substate => substate,
    );

export const makeSelectTasks = () =>
    createSelector(
        selectTaskPageDomain,
        state => state.tasks.data,
    );

export const makeSelectAllAssignees = () =>
    createSelector(
        selectTaskPageDomain,
        state => state.assignees.data,
    );

export default makeSelectTaskPage;
export { selectTaskPageDomain };
