import axios from "axios";
export const domain = `http://localhost:5000/apis`;

export const getAllCustomersByOrgId = async ({ queryKey }) => {
  console.log("Get all Customers by Org ID API is called");
  const { data } = await axios.get(`${domain}/orgs/${queryKey[1]}/customers`);
  return data;
};
