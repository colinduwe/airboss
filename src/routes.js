import { routerActions } from 'react-router-redux';
import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import { App, Home, NotFound } from 'containers';
import About from 'containers/About/Loadable';
import Aircraft from 'containers/Aircraft/Loadable';
import Chat from 'containers/Chat/Loadable';
import Exercise from 'containers/Exercise/Loadable';
import ExerciseAdd from 'containers/ExerciseAdd/Loadable';
import ExerciseDetail from 'containers/ExerciseDetail/Loadable';
import Frequency from 'containers/Frequency/Loadable';
import Login from 'containers/Login/Loadable';
import LoginSuccess from 'containers/LoginSuccess/Loadable';
import Register from 'containers/Register/Loadable';

const isAuthenticated = connectedReduxRedirect({
  redirectPath: '/login',
  authenticatedSelector: state => state.auth.user !== null,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});

const isNotAuthenticated = connectedReduxRedirect({
  redirectPath: '/',
  authenticatedSelector: state => state.auth.user === null,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated',
  allowRedirectBack: false
});

const routes = [
  {
    component: App,
    routes: [
      { path: '/', exact: true, component: Home },
      { path: '/about', component: About },
      { path: '/aircraft/:id', component: isAuthenticated(Aircraft) },
      { path: '/chat', component: Chat },
      { path: '/event/add', component: isAuthenticated(ExerciseAdd) },
      { path: '/event/:id', component: isAuthenticated(ExerciseDetail) },
      { path: '/events', component: isAuthenticated(Exercise) },
      { path: '/frequency/:id', component: isAuthenticated(Frequency) },
      { path: '/login', component: Login },
      { path: '/login-success', component: isAuthenticated(LoginSuccess) },
      { path: '/register', component: isNotAuthenticated(Register) },
      { component: NotFound }
    ]
  }
];

export default routes;
