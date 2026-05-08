import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/salesforce",
  withCredentials: true,
});

// LOGIN
export const login = () => {
  window.location.href = `${API.defaults.baseURL}/login`;
};

// USER INFO
export const getUser = () => API.get("/user");

// GET METADATA (RULES)
export const getRules = () => API.get("/get-rule");

// TOGGLE SINGLE RULE
export const toggleRule = (id, active) =>
  API.post("/toggle-rule", { id, active });

// DEPLOY
export const deployChanges = () => API.post("/deploy");

// LOGOUT
export const logout = () => API.post("/logout");