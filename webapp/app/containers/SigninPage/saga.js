import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { SERVICE_SERVER } from 'config.js'
import { makeSelectSigninForm } from '../App/selectors';
import request from 'utils/request';
import { signinSuccess, signinError, resetState } from '../App/actions';
import { SIGNIN } from '../App/constants'
import { push } from 'connected-react-router'


// Individual exports for testing
export default function* signinPageSaga() {
    yield takeLatest(SIGNIN, signin)
}

export function* signin() {
    const { username, password } = yield select(makeSelectSigninForm());
    const requestURL = `${SERVICE_SERVER}/login`
    const options = {
        credentials: 'include',
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }

    try {
        const user = yield call(request, requestURL, options);
        yield put(signinSuccess(user));
        yield put(resetState());
        yield put(push('/'))
    } catch (error) {
        console.log(error)
        yield put(signinError(error))
    }
}