/**
 *
 * DatasetPage
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectDatasetPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { loadDataset, changeDataset } from '../App/actions';
import { makeSelectDataset, makeSelectSentences, makeSelectDatasetLoading, makeSelectSentenceCount } from '../App/selectors';
import LoadingIndicator from 'components/LoadingIndicator';
import Pagination from "components/Pagination"
import { Link } from 'react-router-dom'

class DatasetPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: false,
      currentSentences: []
    };
    this.pageLimit = props.pageLimit || 4
  }

  componentDidMount() {
    this.props.onLoading();
    // onLoading()
    // dispatch(loadDataset())
  }

  onPageChanged = (data) => {
    const { currentPage, totalPages, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    console.log(this)
    this.setState({
      'currentPage': currentPage, // internal index starting from 0
      'currentSentences': this.props.sentences.slice(offset, offset+pageLimit)
    })
  }

  createPage = (totalRecords, pageLimit) => {
    const {currentSentences, currentPage} = this.state;
    const totalPage = Math.ceil(totalRecords / pageLimit);
    return (<div>
      <h1>{totalRecords} sentences</h1>
      {currentPage && <h2>{currentPage}/{totalPage}</h2>}
      <Pagination
        totalRecords={totalRecords}
        pageLimit={pageLimit}
        pageNeighbours={1}
        onPageChanged={this.onPageChanged}
        // onPageChanged={(data) => this.onPageChanged(data)}
      />
      {currentSentences.map((s, idx) => (
          <Link key={idx}  to={{
            pathname: "/annotate",
            state: {
              'sentence': s
            }
          }}>
          {
            s.map((w) => w.token).join(' ')
          }
          </Link>
      ))}
      </div>)

    //     sentences.map((s, idx) => (
    //   <div>
    //     <Link key={idx} to={{
    //       pathname: "/annotate",
    //       state: {
    //         'sentence': s
    //       }
    //     }} >{s.token}</Link>
    //   </div>
    // ))
  }

  render() {
    console.log('render')
    let sentences = this.props.sentences;
    if (!(sentences) || !('map' in sentences)) {
      console.log('empty')
      sentences = []
    }

    return (
      <div>
        {this.props.dataset}
        <div>
          {this.props.loading ? (<LoadingIndicator></LoadingIndicator>) :
            this.createPage(sentences.length, this.pageLimit)
          }
        </div>
      </div>
    )
  }
}

// DatasetPage.propTypes = {
//   dispatch: PropTypes.func.isRequired,
// };

const mapStateToProps = createStructuredSelector({
  datasetPage: makeSelectDatasetPage(),
  sentences: makeSelectSentences(),
  dataset: makeSelectDataset(),
  count: makeSelectSentenceCount(),
  loading: makeSelectDatasetLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLoading: e => {
      dispatch(changeDataset('new dataset'))
      dispatch(loadDataset())
    }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'datasetPage', reducer });
const withSaga = injectSaga({ key: 'datasetPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  memo,
)(DatasetPage);
