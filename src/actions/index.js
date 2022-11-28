import data from "../apis/data";

export const signIn = (userData) => {
  return {
    type: "SIGN_IN",
    payload: userData,
  };
};

export const signOut = () => {
  return {
    type: "SIGN_OUT",
  };
};

export const fetchMyProfile = (id) => async (dispatch) => {
  const response = await data.get(`/profiles/${id}`);
  dispatch({
    type: "FETCH_MY_PROFILE",
    payload: response.data,
  });
};

export const fetchOneProfile = (id) => async (dispatch) => {
  const response = await data.get(`/profiles/${id}`);
  dispatch({
    type: "FETCH_ONE_PROFILE",
    payload: response.data,
  });
};

export const fetchAnyProfile = (id) => async (dispatch) => {
  if (typeof id === "string") {
    const response = await data.get(`/profiles/${id}`);
    dispatch({
      type: "FETCH_ANY_PROFILE",
      payload: response.data,
    });
  } else {
    const response = await Promise.all(
      id.map((eachId) => {
        return data.get(`/profiles/${eachId}`);
      })
    );
    const resData = response.map((res) => {
      return res.data;
    });
    dispatch({
      type: "FETCH_ANY_PROFILE",
      payload: resData,
    });
  }
};

export const fetchProfilesIds = () => async (dispatch) => {
  const response = await data.get("/profiles-ids");
  dispatch({
    type: "FETCH_PROFILES_IDS",
    payload: response.data,
  });
};

export async function createProfile(formValues) {
  await data.post(`/profiles`, formValues);
}

export async function createId(id) {
  await data.post(`/profiles-ids`, id);
}

export const editMyProfile = (id, editedProfile) => async (dispatch) => {
  const response = await data.put(`/profiles/${id}`, editedProfile);
  dispatch({
    type: "FETCH_MY_PROFILE",
    payload: response.data,
  });
};

export const editProfile = async (id, editedProfile) => {
  await data.put(`/profiles/${id}`, editedProfile);
};

export const logOutProfile = () => {
  return {
    type: "LOG_OUT_PROFILE",
    payload: {},
  };
};
export const fetchProfiles = () => async (dispatch) => {
  const res = await data.get("/profiles-ids");
  const ids = res.data;

  const response = await Promise.all(
    ids.map(({ userId }) => {
      return data.get(`/profiles/${userId}`);
    })
  );
  const resData = response.map((res) => {
    return res.data;
  });
  dispatch({
    type: "FETCH_ANY_PROFILE",
    payload: resData,
  });
};

export const fetchStreams = () => async (dispatch) => {
  const response = await data.get("/streams");
  dispatch({
    type: "FETCH_STREAMS",
    payload: response.data,
  });
};

export const fetchUserStreams = (id) => async (dispatch) => {
  const response = await data.get("/streams");
  const myStreams = Object.values(response.data).filter((stream) => {
    return stream.userId === id;
  });
  dispatch({
    type: "FETCH_USER_STREAMS",
    payload: myStreams,
  });
};

export const fetchStream = (id) => async (dispatch) => {
  const response = await data.get(`/streams/${id}`);
  dispatch({
    type: "FETCH_STREAM",
    payload: response.data,
  });
};

export const createStream = (formValues) => async (dispatch) => {
  const response = await data.post("/streams", formValues);
  dispatch({
    type: "CREATE_STREAM",
    payload: response.data,
  });
};

export const editStream = (id, formValues) => async (dispatch) => {
  const response = await data.put(`/streams/${id}`, formValues);
  dispatch({
    type: "EDIT_STREAM",
    payload: response.data,
  });
};

export const deleteStream = (id) => async (dispatch) => {
  await data.delete(`/streams/${id}`);
  dispatch({
    type: "DELETE_STREAM",
    payload: id,
  });
};
