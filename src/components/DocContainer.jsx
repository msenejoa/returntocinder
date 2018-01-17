import React from 'react';
import { connect } from 'react-redux';
import { matchPath, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Transition from 'react-transition-group/Transition';
import cx from 'classnames';
import Doc from './Doc.jsx';
import DocHead from './DocHead.jsx';
import actions from '../redux/app/actions';
import withLoader from '../hoc/withLoader';
import freezeProps from '../hoc/freezeProps';
import styles from '../app.scss';

const asidePath = '/(motif|source|search)/(.*)/motif::term';

const getQuery = ({ location, match, app }) => {
  const aside = matchPath(location.pathname, asidePath);
  return {
    term: match.params.term,
    type: match.params[0],
    search: match.params[0] === 'search',
    motif: match.params[0] === 'motif',
    source: match.params[0] === 'source',
    aside: aside && aside.params.term,
    isLinked: app.motifLinksAreActive
  };
};

const onClick = ({ history, e }) => {
  if (
    e.target.tagName.toLowerCase() === 'a' &&
    e.target.pathname.match(/motif\//)
  ) {
    // redirect motif link clicks
    e.preventDefault();
    history.push(e.target.pathname);
  }
};

const DocContainer = ({ search, match, query, history }) =>
  <Transition in={Boolean(query.aside)} timeout={300}>
    {state =>
      <div
        onClick={e => onClick({ e, history })}
        className={cx(styles.docContainer, {
          [styles.withAside]: query.aside
        })}
      >
        <DocHead transitionState={state} query={query} />
        <div className={cx(styles.doc, styles[state], {
          [styles.show]: true
        })}>
          <main>
            <Doc
              query={query}
              path={['main']}
              ready={state === 'entered'}
            />
          </main>
          {query.aside &&
            <aside>
              <Doc
                query={{ motif: true, term: query.aside }}
                path={['aside']}
                ready={state === 'entered'}
              />
            </aside>}
        </div>
      </div>
    }
  </Transition>;

export default compose(
  connect(state => state, actions),
  withRouter,
  withLoader({
    propsToLoad: (props) => {
      const query = getQuery(props);
      return {
        query,
        ...(query.motif ? {
          motif: props.app.motifLinksAreActive
            ? props.app.linkedDoc[query.term]
            : props.app.doc[query.term]
        } : {}),
        ...(query.aside ? {
          aside: props.app.doc[query.aside]
        } : {}),
        ...(query.source ? {
          source: props.app.entriesBySource[query.term]
        } : {}),
      };
    },
    loaderActions: (props) => {
      const query = getQuery(props);
      const getLinked = props.app.motifLinksAreActive;
      return {
        ...(query.motif ? {
          motif: () => props.fetchMotif({ mid: query.term, getLinked }),
        } : {}),
        ...(query.aside ? {
          aside: () => props.fetchMotif({ mid: query.aside, getLinked }),
        } : {}),
        ...(query.source ? {
          source: () => props.fetchSource(query.term),
        } : {}),
      };
    },
  }),
  freezeProps({
    propsToFreeze: props => ({
      query: !props.isLoading,
    })
  }),
)(DocContainer);
