const LOAD = 'redux-example/exercise/LOAD';
const LOAD_SUCCESS = 'redux-example/exercise/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/exercise/LOAD_FAIL';
const ADD_EXERCISE = 'redux-example/exercise/ADD_EXERCISE';
const PATCH_EXERCISE = 'redux-example/exercise/PATCH_EXERCISE';
const PATCH_EXERCISE_SUCCESS = 'redux-example/exercise/PATCH_EXERCISE_SUCCESS';
const PATCH_EXERCISE_FAIL = 'redux-example/exercise/PATCH_EXERCISE_FAIL';

const initialState = {
  loaded: false,
  exercises: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        exercises: action.result.data.reverse()
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case ADD_EXERCISE:
      return {
        ...state,
        exercises: state.exercises.concat(action.exercise)
      };
    case PATCH_EXERCISE_SUCCESS:
      return {
        ...state,
        exercises: state.exercises.map(exercise => (exercise._id === action.result._id ? action.result : exercise))
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.exercise && globalState.exercise.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ app }) =>
      app.service('exercises').find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
  };
}

export function addExercise(exercise) {
  return {
    type: ADD_EXERCISE,
    exercise
  };
}

export function patchExercise(id, data) {
  return {
    types: [PATCH_EXERCISE, PATCH_EXERCISE_SUCCESS, PATCH_EXERCISE_FAIL],
    promise: ({ app }) => app.service('exercises').patch(id, data)
  };
}
