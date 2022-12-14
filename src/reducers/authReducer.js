const INITIAL_STATE = {
  isSignedIn: null,
  userData: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, isSignedIn: true, userData: action.payload };
    case "SIGN_OUT":
      return { ...state, isSignedIn: false, userData: null };
    default:
      return state;
  }
};
