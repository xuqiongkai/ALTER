import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';
import { makeSelectUser } from './selectors';
import { push } from 'connected-react-router'

export default function* watchLogin() {
    console.log('app saga binded');
    yield takeLatest(LOCATION_CHANGE, checkLogin);
}

export function* checkLogin(action) {
    console.log('check login')
    let user = yield select(makeSelectUser());
    if (action.location.pathname !== '/signin' && !user) {
        yield put(push('/signin'))
    }
}