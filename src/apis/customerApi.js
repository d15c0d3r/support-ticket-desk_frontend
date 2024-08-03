import axios from "axios";
import env from "react-dotenv";

export const domain = env.DOMAIN;

export const getAllCustomersByOrgId = async ({ queryKey }) => {
  console.log("Get all Customers by Org ID API is called");
  const { data } = await axios.get(`${domain}/orgs/${queryKey[1]}/customers`);
  return data;
};
