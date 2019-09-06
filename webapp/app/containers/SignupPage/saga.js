import { SERVICE_SERVER } from 'config.js';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { loadSignupSuccess, loadSignupError } from "./actions";
import { showMessageBar } from "../App/actions";
import { LOAD_SIGNUP } from './constants';

// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
export default function* signupPageSaga() {
    // See example in containers/HomePage/saga.js
    yield takeLatest(LOAD_SIGNUP, signupAsync);
}

function* signupAsync(action) {
    let { username, password, name } = action;
    let requestURL = `${SERVICE_SERVER}/registration`
    try {
        const options = {
            credentials: 'include',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                name,
                type: 'user',
            }),
        };
        let rsl = yield call(request, requestURL, options);
        yield put(loadSignupSuccess());
        yield put(showMessageBar('success', 'Successfully created!'))
    } catch (error) {
        yield put(loadSignupError(error));
        yield put(showMessageBar('error', 'Failed to create user!'));
    }
}