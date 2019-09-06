import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the datasetPage state domain
 */

const selectDatasetPageDomain = state => state.datasetPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DatasetPage
 */

const makeSelectDatasetPage = () =>
  createSelector(
    selectDatasetPageDomain,
    substate => substate,
  );

export default makeSelectDatasetPage;
export { selectDatasetPageDomain };
