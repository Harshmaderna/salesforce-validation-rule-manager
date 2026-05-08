import axios from "axios";
import {clearAuth, getAuth, setAuth} from "../config/salesforce.js";
import {
  getValidationRule,
  toggleRuleService,
} from "../services/salesforceService.js";
  
export const login = async (req, res) => {
  const url = `${process.env.LOGIN_URL}/services/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`;

  res.redirect(url);
};

// callback salesforce se token

export const callback = async (req, res) => {
  try {
    const code = req.query.code;
    const response = await axios.post(
      `${process.env.LOGIN_URL}/services/oauth2/token`,
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          redirect_uri: process.env.REDIRECT_URI,
          code,
        },
      },
    );
    setAuth(response.data.access_token, response.data.instance_url);
    res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ success: false, message: "OAuth failed" }); 
  }
};


// user info
export const getUserInfo = async (req, res) => {
  try {
    const { accessToken, instanceUrl } = getAuth();

    const response = await axios.get(
      `${instanceUrl}/services/oauth2/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.json({
      username: response.data.preferred_username,
      organization: response.data.organization_id,
    });
  } catch (error) {
    return res.status(401).json({ error: "Not authenticated" });
  }
};


//get validation rules
export const getRule = async (req, res) => {
  try {
    const data = await getValidationRule();
    res.json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch rules" });
  }
};

// toggle rules

export const toggleRule = async (req, res) => {
  try {
    const { id, active } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Rule id required" });
    }
    await toggleRuleService(id, active);
    res.json({ message: "Rule updated successfully" });
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to update rule" });
  }
};

// deploy changes 

export const deployChanges = async (req, res) => {
  try { 
    setTimeout(() => {
      res.json({
        success: true,
        message: "Changes deployed successfully",
      });
    }, 3000);
  } catch (error) {
    res.status(500).json({
      error: "Deployment failed", 
    });
  }
};

// logout
export const logout = async (req, res) => {
  try {
    clearAuth();

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Logout failed",
    });
  }
};

