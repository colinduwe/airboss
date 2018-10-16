const LOAD = 'redux-example/aircraft/LOAD';
const LOAD_SUCCESS = 'redux-example/aircraft/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/aircraft/LOAD_FAIL';
const GET = 'redux-example/aircraft/GET';
const GET_SUCCESS = 'redux-example/aircraft/GET_SUCCESS';
const GET_FAIL = 'redux-example/aircraft/GET_FAIL';
const ADD_AIRCRAFT = 'redux-example/aircraft/ADD_AIRCRAFT';
const PATCH_AIRCRAFT = 'redux-example/aircraft/PATCH_AIRCRAFT';
const PATCH_AIRCRAFT_SUCCESS = 'redux-example/aircraft/PATCH_AIRCRAFT_SUCCESS';
const PATCH_AIRCRAFT_FAIL = 'redux-example/aircraft/PATCH_AIRCRAFT_FAIL';

const initialState = {
  loaded: false,
  aircraft: []
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
        aircraft: action.result.data.reverse()
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
        aircraftSelected: action.result
      };
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case ADD_AIRCRAFT:
      return {
        ...state,
        aircraft: state.aircraft.concat(action.airplane)
      };
    case PATCH_AIRCRAFT_SUCCESS:
      return {
        ...state,
        aircraft: state.aircraft.map(airplane => (airplane._id === action.result._id ? action.result : airplane)),
        aircraftSelected: action.result
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.aircraft && globalState.aircraft.loaded;
}

export function load(queryVars) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ app }) =>
      app.service('aircraft').find({
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
    promise: ({ app }) => app.service('aircraft').get(id)
  };
}

export function addAircraft(airplane) {
  return {
    type: ADD_AIRCRAFT,
    airplane
  };
}

export function patchAirplane(id, data) {
  return {
    types: [PATCH_AIRCRAFT, PATCH_AIRCRAFT_SUCCESS, PATCH_AIRCRAFT_FAIL],
    promise: ({ app }) => app.service('aircraft').patch(id, data)
  };
}
