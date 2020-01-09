import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withRouter, Redirect } from 'react-router-dom';
import { renderRoutes, matchRoutes } from 'react-router-config';

import {
  selectRouteEntry,
  selectRouteEntryContentTypeId,
  selectIsNotFound,
  selectCurrentProject,
  selectCurrentPath,
} from '~/core/redux/selectors/routing';
import { setNavigationPath } from '~/core/redux/actions/routing';
import NotFound from '~/pages/NotFound';

import { Status } from './Status';
import { toJS } from '../util/ToJs';

const getTrimmedPath = path => {
  if (path !== '/') {
    const lastChar = path[path.length - 1];
    if (lastChar == '/') {
      return path.substring(0, path.length - 1);
    }
  }
  return path;
};

const RouteLoader = ({
  statePath,
  projectId,
  contentTypeId,
  entry,
  isNotFound,
  setNavigationPath,
  routes,
  location,
  //history,
  withEvents,
}) => {
  // Match any Static Routes a developer has defined
  const matchedStaticRoute = pathname =>
    matchRoutes(
      routes.StaticRoutes,
      typeof window != 'undefined' ? window.location.pathname : pathname
    );
  const isStaticRoute = pathname => matchedStaticRoute(pathname).length > 0;

  const trimmedPath = getTrimmedPath(location.pathname);

  const setPath = () => {
    const staticRoute =
      isStaticRoute(trimmedPath) && matchedStaticRoute(trimmedPath)[0];
    let serverPath = null;
    if (staticRoute) {
      serverPath = staticRoute.route.path
        .split('/')
        .filter(p => !p.startsWith(':'))
        .join('/');
    }

    setNavigationPath(
      serverPath || trimmedPath,
      location,
      staticRoute,
      withEvents,
      statePath
    );
  };

  if (typeof window == 'undefined') setPath();

  useEffect(() => {
    setPath();
  }, [location]);

  // Render any Static Routes a developer has defined
  if (isStaticRoute(trimmedPath)) {
    return renderRoutes(routes.StaticRoutes, {
      projectId,
      contentTypeId,
      entry,
    });
  }

  // Need to redirect when url endswith a /
  if (location.pathname.length > trimmedPath.length) {
    return <Redirect to={trimmedPath} />;
  }
  // Match any Defined Content Type Mappings
  if (contentTypeId) {
    const MatchedComponent = routes.ContentTypeMappings.find(
      item => item.contentTypeID == contentTypeId
    );

    if (MatchedComponent) {
      return (
        <MatchedComponent.component
          projectId={projectId}
          contentTypeId={contentTypeId}
          entry={entry}
        />
      );
    }
  }

  if (isNotFound) {
    return (
      <Status code={404}>
        <NotFound />
      </Status>
    );
  }

  return null;
};

RouteLoader.propTypes = {
  routes: PropTypes.objectOf(PropTypes.array, PropTypes.array),
  withEvents: PropTypes.object,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  statePath: PropTypes.string,
  projectId: PropTypes.string,
  contentTypeId: PropTypes.string,
  entry: PropTypes.object,
  isNotFound: PropTypes.bool,
  setNavigationPath: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    statePath: selectCurrentPath(state),
    projectId: selectCurrentProject(state),
    entry: selectRouteEntry(state),
    contentTypeId: selectRouteEntryContentTypeId(state),
    isNotFound: selectIsNotFound(state),
  };
};

const mapDispatchToProps = {
  setNavigationPath: (path, location, staticRoute, withEvents, statePath) =>
    setNavigationPath(path, location, staticRoute, withEvents, statePath),
};

export default hot(module)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(toJS(RouteLoader))
  )
);
