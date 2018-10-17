const LOAD = 'redux-example/frequencies/LOAD';
const LOAD_SUCCESS = 'redux-example/frequencies/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/frequencies/LOAD_FAIL';
const GET = 'redux-example/frequencies/GET';
const GET_SUCCESS = 'redux-example/frequencies/GET_SUCCESS';
const GET_FAIL = 'redux-example/frequencies/GET_FAIL';
const ADD_FREQUENCY = 'redux-example/frequencies/ADD_FREQUENCY';
const PATCH_FREQUENCY = 'redux-example/frequencies/PATCH_FREQUENCY';
const PATCH_FREQUENCY_SUCCESS = 'redux-example/frequencies/PATCH_FREQUENCY_SUCCESS';
const PATCH_FREQUENCY_FAIL = 'redux-example/frequencies/PATCH_FREQUENCY_FAIL';

const initialState = {
  loaded: false,
  frequencies: []
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
        frequencies: action.result.data.reverse()
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case GET:
      return {
        ...state,
        loading: true
      };
    case GET_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        frequencySelected: action.result
      };
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case ADD_FREQUENCY:
      return {
        ...state,
        frequencies: state.frequencies.concat(action.frequency)
      };
    case PATCH_FREQUENCY_SUCCESS:
      return {
        ...state,
        frequencies: state.frequencies.map(frequency =>
          (frequency._id === action.result._id ? action.result : frequency)),
        frequencySelected: action.result
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.frequencies && globalState.frequencies.loaded;
}

export function load(queryVars) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ app }) =>
      app.service('frequencies').find({
        query: {
          ...queryVars,
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
  };
}

export function get(id) {
  return {
    types: [GET, GET_SUCCESS, GET_FAIL],
    promise: ({ app }) => app.service('frequencies').get(id)
  };
}

export function addFrequency(frequency) {
  return {
    type: ADD_FREQUENCY,
    frequency
  };
}

export function patchFrequency(id, data) {
  return {
    types: [PATCH_FREQUENCY, PATCH_FREQUENCY_SUCCESS, PATCH_FREQUENCY_FAIL],
    promise: ({ app }) => app.service('frequencies').patch(id, data)
  };
}
