import _ from "lodash";

const INITIAL_STATE = {
  allStreams: {},
  userStreams: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_STREAMS":
      return { ...state, allStreams: _.mapKeys(action.payload, "id"), userStreams: state.userStreams };
    case "FETCH_USER_STREAMS":
      return { ...state, allStreams: state.allStreams, userStreams: action.payload };
    case "FETCH_STREAM":
      return { ...state, allStreams: { [action.payload.id]: action.payload }, userStreams: state.userStreams };
    case "CREATE_STREAM":
      return { ...state, allStreams: { [action.payload.id]: action.payload }, userStreams: state.userStreams };
    case "EDIT_STREAM":
      return { ...state, allStreams: { [action.payload.id]: action.payload }, userStreams: state.userStreams };
    case "DELETE_STREAM":
      return _.omit(state, action.payload);
    default:
      return state;
  }
};
