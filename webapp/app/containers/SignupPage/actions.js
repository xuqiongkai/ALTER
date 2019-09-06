/*
 *
 * SignupPage actions
 *
 */

import { DEFAULT_ACTION } from './constants';
import {LOAD_SIGNUP, LOAD_SIGNUP_SUCCESS, LOAD_SIGNUP_ERROR} from './constants';

export function defaultAction() {
    return {
        type: DEFAULT_ACTION,
    };
}

export function loadSignup(username, password, name) {
  return {
    type: LOAD_SIGNUP,
    username,
    password,
    name,
  };
}

export function loadSignupSuccess() {
   return {
       type: LOAD_SIGNUP_SUCCESS,
   };
}
  
export function loadSignupError(error) {
   return {
       type: LOAD_SIGNUP_ERROR,
       error
   };
}