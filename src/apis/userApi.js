import axios from "axios";
export const domain = `http://localhost:5000/apis`;

export const getUserByEmail = async ({ queryKey }) => {
  const { data } = await axios.get(`${domain}/orgs/user-data/users/by-email`);
  return data;
};

export const getAllUsersByOrgId = async ({ queryKey }) => {
  const { data } = await axios.get(`${domain}/orgs/${queryKey[1]}/users`);
  return data;
};

export const addUserByOrgIdAndEmail = async ({
  orgId,
  userName,
  userEmail,
}) => {
  console.log("POST user by EMAIL API is called");
  const { data } = await axios.post(`${domain}/orgs/${orgId}/users`, {
    userEmail,
    userName,
  });
  console.log(data);
  return data;
};

export const putUserById = async ({ orgId, userId, userName }) => {
  console.log("PUT user by ID API is called");
  const { data } = await axios.put(`${domain}/orgs/${orgId}/users/${userId}`, {
    userName,
  });
  return data;
};
