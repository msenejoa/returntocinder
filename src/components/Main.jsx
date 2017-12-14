/* eslint-disable arrow-body-style */
import React, { PureComponent } from 'react';
import { BrowserRouter as Router, matchPath, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Transition from 'react-transition-group/Transition';
import cx from 'classnames';

import Navbar from './Navbar.jsx';
import Menu from './Menu.jsx';
import DocContainer from './DocContainer.jsx';
import Source from './Source.jsx';
import ModalRoute from './ModalRoute.jsx';
import ModalMenu from './ModalMenu.jsx';
import Footer from './Footer.jsx';
import About from './About.jsx';
import Front from './Front.jsx';
import defer from './Defer.jsx';
import actions from '../redux/app/actions';

import styles from '../app.scss';

class Main extends PureComponent {
  constructor(props) {
    super(props);

    this.DocContainer = defer({
      Wrapped: DocContainer,
      untilStatus: 'READY',
      showLoader: true
    });

    this.Source = defer({
      Wrapped: Source,
      untilStatus: 'READY',
    });
  }
  render() {
    const { appState, toggleSearchIsFocused } = this.props;
    const sourcePath = '(.*)/source::sid/(.*)?';
    const sidFromPath = (props) => {
      const match = matchPath(
        props.location.pathname,
        '(.*)/source::sid/(.*)?'
      );
      return (match && match.params.sid) || null;
    };
    return (
      <Router>
        <Transition
          in={appState.showMask}
          timeout={50}
        >
          {(state) => {
            return (
              <div className={cx(styles.app, {
                [styles.showWithMask]: state === 'entered'
              })}>
                <div
                  className={cx(styles.mask, {
                    [styles.show]: state === 'entering' || state === 'entered'
                  })}
                  onClick={() => toggleSearchIsFocused(false)}>
                  <this.DocContainer />
                </div>
                <Route path="(.*)about/:page" children={({ match }) =>
                  <ModalMenu isActive={match}>
                    <About match={match} />
                  </ModalMenu>
                }/>
                <Navbar withMaskClassName={styles.withMask} />
                <ModalRoute
                  path={sourcePath}
                  component={this.Source}
                  passProps={props => ({ sid: sidFromPath(props) })}
                  title={sidFromPath}
                />
                <Front />
                <Menu />
              </div>
            );
          }}
        </Transition>
      </Router>
    );
  }
}

export default connect(state => ({
  appState: state.app,
}), actions)(Main);
