import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import shallowequal from 'shallowequal';

import appActions from '../redux/app/actions';
import searchActions from '../redux/search/actions';

import EntriesByMotif from './EntriesByMotif.jsx';
import EntriesBySource from './EntriesBySource.jsx';

class Doc extends PureComponent {
  constructor(props) {
    super(props);
    this.query = props.query;
    this._updateRows(this.props);
    this.lastScroll = {
      query: null,
      hash: null
    };
    this.setScroll = this.setScroll.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const queryChanged = !shallowequal(this.query, nextProps.query);
    const resultsChanged = (
      this.props.searchState.results !== nextProps.searchState.results
    );

    if (queryChanged) {
      this.query = nextProps.query;
      this.setState({ lastScroll: { query: null, path: null } });
    }

    if (queryChanged || resultsChanged) {
      this._updateRows(nextProps);
    }
  }

  setScroll(hash) {
    if (!this.props.ready) {
      return false;
    }
    const scroll = { query: this.query, hash };
    if (shallowequal(this.lastScroll, scroll)) {
      return false;
    }
    this.lastScroll = scroll;
    return true;
  }

  _updateRows(props) {
    const { entriesBySource, linkedEntriesBySource, doc, linkedDoc } = props.appState;
    const { results, linkedResults } = props.searchState;
    const { search, motif, source, term, isLinked } = this.query;
    const { path } = this.props;

    if (motif) {
      this._rows = [term];
      this._rowComponent = ({ index, key, style }) =>
        <EntriesByMotif
          doc={isLinked ? linkedDoc : doc}
          mid={term}
          key={key}
          style={style}
          path={path}
          setScroll={this.setScroll}
          />;
    } else if (source) {
      this._rows = [term];
      this._rowComponent = ({ index, key, style }) =>
        <EntriesBySource
          sid={term}
          entries={isLinked ? linkedEntriesBySource[term] : entriesBySource[term]}
          key={key}
          style={style}
          path={path}
          setScroll={this.setScroll}
        />;
    } else if (search) {
      this._rows = Object.keys(
        isLinked ? linkedResults[term] : results[term]
      );
      this._rowComponent = ({ index, key, style }) =>
        <EntriesBySource
          sid={this._rows[index]}
          entries={
            isLinked
              ? linkedResults[term][this._rows[index]]
              : results[term][this._rows[index]]
          }
          key={key}
          style={style}
          showHeader
          highlight={term.split(/\s/)}
          path={path}
          setScroll={this.setScroll}
        />;
    }
  }

  render() {
    return this._rows.map((key, index) =>
      this._rowComponent({ index, key, style: {} }));
  }
}

export default withRouter(connect(state => ({
  appState: state.app,
  searchState: state.search
}), { ...appActions, ...searchActions })(Doc));
