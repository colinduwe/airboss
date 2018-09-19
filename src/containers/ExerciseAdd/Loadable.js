import React from 'react';
import Loadable from 'react-loadable';

const ExerciseAddFeathersLoadable = Loadable({
  loader: () => import('./ExerciseAdd' /* webpackChunkName: 'exerciseAdd' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default ExerciseAddFeathersLoadable;
