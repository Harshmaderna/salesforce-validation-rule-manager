import axios from "axios";
import {getAuth}  from "../config/salesforce.js";

export const getValidationRule = async () => {
  const { accessToken, instanceUrl } = getAuth();  

  const query = `SELECT Id, ValidationName, Active 
    FROM ValidationRule 
    WHERE EntityDefinition.QualifiedApiName = 'Account'`;

  const url = `${instanceUrl}/services/data/v59.0/tooling/query`; 

  const result = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,  
    },
    params: {
      q: query,
    },
  });
  return result.data.records.map((rule) => ({
    id: rule.Id,
    name: rule.ValidationName,
    active: rule.Active,
    type: "Validation Rule",
  }));
};


export const toggleRuleService = async (id, active) => {
  const { accessToken, instanceUrl } = getAuth();
  const url = `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${id}`;

  const existing = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  await axios.patch(
    url,
    {
      Metadata: {
        ...existing.data.Metadata,
        active: active,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
};
