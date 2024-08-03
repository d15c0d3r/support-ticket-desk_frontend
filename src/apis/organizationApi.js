import axios from "axios";
import { domain } from "./customerApi";

export const getOrganization = async () => {
  const { data } = await axios.get(`${domain}/orgs`);
  return data;
};

export const getOrganizationById = async ({ queryKey }) => {
  console.log(queryKey[1]);
  const { data } = await axios.get(`${domain}/orgs/${queryKey[1]}`);
  console.log(data);
  return data;
};

export const addOrganization = async (orgData) => {
  const { data } = await axios.post(`${domain}/orgs`, orgData);
  return data;
};
