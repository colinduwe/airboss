import React from 'react';
import Loadable from 'react-loadable';

const ExerciseDetailFeathersLoadable = Loadable({
  loader: () => import('./ExerciseDetail' /* webpackChunkName: 'exerciseDetail' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default ExerciseDetailFeathersLoadable;
