import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the signinPage state domain
 */

const selectSigninPageDomain = state => state.signinPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by SigninPage
 */

const makeSelectSigninPage = () =>
    createSelector(
        selectSigninPageDomain,
        substate => substate,
    );

export default makeSelectSigninPage;
export { selectSigninPageDomain };
