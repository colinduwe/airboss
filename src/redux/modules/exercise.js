const LOAD = 'redux-example/exercise/LOAD';
const LOAD_SUCCESS = 'redux-example/exercise/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/exercise/LOAD_FAIL';
const ADD_EXERCISE = 'redux-example/exercise/ADD_EXERCISE';
const PATCH_EXERCISE = 'redux-example/exercise/PATCH_EXERCISE';
const PATCH_EXERCISE_SUCCESS = 'redux-example/exercise/PATCH_EXERCISE_SUCCESS';
const PATCH_EXERCISE_FAIL = 'redux-example/exercise/PATCH_EXERCISE_FAIL';
const SELECT_EXERCISE = 'redux-example/exercise/SELECT_EXERCISE';
const SELECT_EXERCISE_SUCCESS = 'redux-example/exercise/SELECT_EXERCISE_SUCCESS';
const SELECT_EXERCISE_FAIL = 'redux-example/exercise/SELECT_EXERCISE_FAIL';

const initialState = {
  loaded: false,
  exercises: [],
  exercise: {}
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
      if (state.exercise._id === action.result._id) {
        state.exercise = action.result;
      }
      return {
        ...state,
        exercises: state.exercises.map(exercise => (exercise._id === action.result._id ? action.result : exercise)),
        exercise: state.exercise._id === action.result._id ? action.result : state.exercise
      };
    case SELECT_EXERCISE_SUCCESS:
      return Object.assign({}, state, {
        exercise: action.result
      });
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

export function selectExercise(id) {
  return {
    types: [SELECT_EXERCISE, SELECT_EXERCISE_SUCCESS, SELECT_EXERCISE_FAIL],
    promise: ({ app }) => app.service('exercises').get(id, {})
  };
}
