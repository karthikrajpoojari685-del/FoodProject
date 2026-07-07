//Dispatch => Call API =>Update state based on success or failure

import api from "../../utils/api";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateRequest,
  updateSuccess,
  updateFail,
  updateReset,
  clearErrors,
} from "../slices/userSlice";

// LOGIN
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await api.post("/v1/users/login", {
      email,
      password,
    });
    
    // Safely parse user payload whether it is nested in data.data or flat on data
    const userPayload = data.data ? data.data.user : data.user;
    dispatch(loginSuccess(userPayload));
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || "Login Failed"));
  }
};

// Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    // Use FormData for multi-part file/avatar streams instead of raw JSON strings
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("passwordConfirm", userData.passwordConfirm);
    formData.append("phoneNumber", userData.phoneNumber);
    
    // Only append avatar if it is an actual file object from the input field
    if (userData.avatar && userData.avatar !== "/images/images.png") {
      formData.append("avatar", userData.avatar);
    }

    const { data } = await api.post("/v1/users/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    // Safely parse user payload whether it is nested in data.data or flat on data
    const userPayload = data.data ? data.data.user : data.user;
    dispatch(loginSuccess(userPayload));
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || "Registration Failed"));
  }
};

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await api.get("/v1/users/me");
    console.log("loadUser response:", data);

    // Matches your backend profile payload format
    const userPayload = data.data ? data.data.user : data.user;
    dispatch(loginSuccess(userPayload));
  } catch (error) {
    console.log("loadUser error:", error.response);
    dispatch(loadUserFail(error.response?.data?.message));
  }
};

// update profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());

    const { data } = await api.put("/v1/users/me/update", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(error.response?.data?.message));
  }
};

// logout
export const logout = () => async (dispatch) => {
  try {
    await api.get("v1/users/logout");
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail(error.response?.data?.message));
  }
};