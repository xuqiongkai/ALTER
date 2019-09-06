import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { SERVICE_SERVER } from 'config.js'
import request from 'utils/request';

import { datasetLoaded, datasetLoadingError } from '../App/actions';
import { makeSelectDataset } from '../App/selectors'
import { LOAD_DATASET } from '../App/constants';

export function* getDataset() {
  // See example in containers/HomePage/saga.js
  const dataset = yield select(makeSelectDataset());
  const requestURL = `${SERVICE_SERVER}/application/sentence`

  try {
    const sentences = yield call(request, requestURL);
    yield put(datasetLoaded(sentences, dataset));
  } catch (err) {
    yield put(datasetLoadingError(err))
  }
}

export default function* datasetData() {
  yield takeLatest(LOAD_DATASET, getDataset)
}

// // Individual exports for testing
// export default function* getDataset() {
//   // See example in containers/HomePage/saga.js
//   const dataset = yield select(makeSelectDataset());
//   const requestURL = `{SERVICE_SERVER}/application/sentence`

//   try {
//     const sentences = yield call(request, requestURL);
//     yield put(datasetLoaded(sentences, dataset));
//   } catch (err) {
//     yield put(datasetLoadingError(err))
//   }
// }
