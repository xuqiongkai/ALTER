/*
 *
 * SignupPage reducer
 *
 */
import produce from 'immer';
import { DEFAULT_ACTION } from './constants';
import {LOAD_SIGNUP, LOAD_SIGNUP_SUCCESS, LOAD_SIGNUP_ERROR} from './constants';

export const initialState = {
    signup: {
        loading: false,
        error: false,
    }
};

/* eslint-disable default-case, no-param-reassign */
const signupPageReducer = (state = initialState, action) =>
    produce(state, ( draft ) => {
        switch (action.type) {
            case DEFAULT_ACTION:
                break;

            case LOAD_SIGNUP:
                draft.signup.loading = true;
                draft.signup.error = false;
                break
            case LOAD_SIGNUP_SUCCESS:
                draft.signup.loading = false;
                draft.signup.error = false;
                break
            
            case LOAD_SIGNUP_ERROR:
                draft.signup.loading = false;
                draft.signup.error = action.error;
                break
        }
    });

export default signupPageReducer;
