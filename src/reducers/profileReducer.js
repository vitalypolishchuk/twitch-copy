import _ from "lodash";

const INITIAL_STATE = {
  anyProfile: {},
  profilesIds: [],
  myProfile: {},
  oneProfile: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "FETCH_ANY_PROFILE":
      return { ...state, anyProfile: action.payload };
    case "FETCH_PROFILES_IDS":
      return { ...state, profilesIds: action.payload };
    case "FETCH_MY_PROFILE":
      return { ...state, myProfile: action.payload };
    case "FETCH_ONE_PROFILE":
      return { ...state, oneProfile: action.payload };
    case "LOG_OUT_PROFILE":
      return { ...state, myProfile: action.payload };
    default:
      return state;
  }
};
