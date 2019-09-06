import { SERVICE_SERVER } from 'config.js';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
    loadTasksError,
    loadTasksSuccess,
    loadTasks,
    addTaskError,
    addTaskSuccess,
    loadAssigneesSuccess,
    loadAssigneesError,
    submitAssigneesSuccess,
    submitAssigneesError,
} from './actions';
import { LOAD_TASKS, ADD_TASK, LOAD_ASSIGNEES, SUBMIT_ASSIGNEES } from './constants';
import { makeSelectTask, makeSelectSentences } from '../App/selectors';
import { LOAD_TASK } from '../App/constants';
import { loadTaskSuccess, loadTaskError, loadSentence, changeSentence } from '../App/actions';
import { makeSelectTasks } from './selectors';

// Individual exports for testing
export default function* taskPageSaga() {
    yield takeLatest(LOAD_TASKS, getTasksAsync);
    yield takeLatest(LOAD_ASSIGNEES, getAssigneesAsync);
    yield takeLatest(LOAD_TASK, loadTaskAsync);
    yield takeLatest(ADD_TASK, addTaskAsync);
    yield takeLatest(SUBMIT_ASSIGNEES, submitAssigneesAsync);
}

export function* getTasksAsync() {
    const requestURL = `${SERVICE_SERVER}/tasks`;

    try {
        const tasks = yield call(request, requestURL, {
            credentials: 'include',
        });
        yield put(loadTasksSuccess(tasks));
    } catch (err) {
        console.log(err);
        yield put(loadTasksError(err));
    }
}

export function* getAssigneesAsync() {
    const requestURL = `${SERVICE_SERVER}/users`;

    try {
        const assignees = yield call(request, requestURL, {
            credentials: 'include',
        });
        yield put(loadAssigneesSuccess(assignees));
    } catch (error) {
        console.log(error);
        yield put(loadAssigneesError(error));
    }
}

export function* loadTaskAsync(action) {
    const task = yield select(makeSelectTask());
    let requestURL = `${SERVICE_SERVER}/task/${task.id}`;
    requestURL = requestURL + '?with_weight=0';

    try {
        // let data = yield call(request, requestURL).data;
        let data = yield call(request, requestURL, {
            credentials: 'include',
        });
        let annotationStatus = null;
        if ('annotation_status' in data) {
            annotationStatus = data.annotation_status;
        } else {
            annotationStatus = new Array(data.length);
        }

        // let sentences = []
        // for (let i = 0; i < data.length; i++) {
        //     let sentence = data[i];
        //     sentence = sentence.map((w) => ({
        //         token: w,
        //         weight: 0
        //     }))
        //     sentences.push(sentence)
        // }
        let sentences = data.data;
        yield put(loadTaskSuccess(sentences, annotationStatus));
        yield put(changeSentence(0));
        yield put(loadSentence(0));
    } catch (error) {
        console.log(error);
        yield put(loadTaskError(error));
    }
}

export function* addTaskAsync(action) {
    let { name, file } = action;
    let requestURL = `${SERVICE_SERVER}/tasks`;
    try {
        let formData = new FormData();
        formData.append('name', name);
        formData.append('task_file', file);

        let rsl = yield call(request, requestURL, {
            body: formData,
            method: 'post',
            credentials: 'include',
        });

        yield put(loadTasks());
        yield put(addTaskSuccess());
    } catch (error) {
        console.log(error);
        yield put(addTaskError(error));
    }
}

export function* submitAssigneesAsync(action) {
    let tasks = yield select(makeSelectTasks());
    let task = tasks[action.taskIdx];
    let requestURL = `${SERVICE_SERVER}/task/${task.id}/assign`
    try {
        const options = {
            credentials: 'include',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assignees: task.assignees
            }),
        };
        let rsl = yield call(request, requestURL, options);
        yield put(submitAssigneesSuccess());
    } catch (error) {
        yield put(submitAssigneesError(error));
    }
}