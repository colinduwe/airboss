const LOAD = 'redux-example/aircraft/LOAD';
const LOAD_SUCCESS = 'redux-example/aircraft/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/aircraft/LOAD_FAIL';
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
      console.log('Aircraft load success: ', action.result.data);
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
    case ADD_AIRCRAFT:
      return {
        ...state,
        aircraft: state.aircraft.concat(action.airplane)
      };
    case PATCH_AIRCRAFT_SUCCESS:
      return {
        ...state,
        aircraft: state.aircraft.map(airplane => (airplane._id === action.result._id ? action.result : airplane))
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.aircraft && globalState.aircraft.loaded;
}

export function load() {
  console.log('loading aircraft...');
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ app }) =>
      app.service('aircraft').find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
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
