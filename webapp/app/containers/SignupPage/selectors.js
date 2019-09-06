import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the signupPage state domain
 */

const selectSignupPageDomain = state => state.signupPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SignupPage
 */

const makeSelectSignupPage = () =>
    createSelector(
        selectSignupPageDomain,
        substate => substate,
    );

export default makeSelectSignupPage;
export { selectSignupPageDomain };
