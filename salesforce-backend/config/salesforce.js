 let accessToken = "";
 let instanceUrl = "";

export const setAuth = (token, url) => {
  accessToken = token;
  instanceUrl = url;
};

export const clearAuth = () => {
  accessToken = "";
  instanceUrl = "";
};

export const getAuth = () => {
  if (!accessToken || !instanceUrl) {
    throw new Error("Not authenticated with Salesforce");
  }
  return { accessToken, instanceUrl };
};