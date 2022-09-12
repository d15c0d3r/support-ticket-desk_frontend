import axios from "axios";
import { domain } from "./organizationApi";

export const getAllTicketsByOrgIdandFilters = async ({ queryKey }) => {
  console.log("get All tickets by OrgId API is called");
  if (!queryKey[2]) {
    const { data } = await axios.get(`${domain}/orgs/${queryKey[1]}/tickets`);
    return data;
  } else {
    const filters = queryKey[2];
    let to_api = `${domain}/orgs/${queryKey[1]}/tickets`;
    let atleastOneFilter = false;
    if (filters["status"]) {
      to_api += `?status=${filters["status"]}`;
      atleastOneFilter = true;
    }
    if (filters["assigned-to"]) {
      if (atleastOneFilter) to_api += `&assigned-to=${filters["assigned-to"]}`;
      else {
        to_api += `?assigned-to=${filters["assigned-to"]}`;
        atleastOneFilter = true;
      }
    }
    if (filters["range"]) {
      if (atleastOneFilter)
        to_api += `&start-date=${filters["range"][0]}&end-date=${filters["range"][1]}`;
      else
        to_api += `?start-date=${filters["range"][0]}&end-date=${filters["range"][1]}`;
      atleastOneFilter = true;
    }
    if (filters["search"]) {
      if (atleastOneFilter) to_api += `&search=${filters["search"]}`;
      else to_api += `?search=${filters["search"]}`;
    }
    // console.log(to_api);
    const { data } = await axios.get(to_api);
    return data;
  }
};

export const getTicketsByOrgIdForInsights = async ({ queryKey }) => {
  console.log("get All tickets by OrgId API for INSIGHTS is called");
  const { data } = await axios.get(
    `${domain}/orgs/${queryKey[1]}/tickets/insights/`
  );
  return data;
};

export const addTicketByDetails = async ({ orgId, newTicketDetails }) => {
  console.log("Post ticket by Details API is called");
  const { data } = await axios.post(
    `${domain}/orgs/${orgId}/tickets`,
    newTicketDetails
  );
  return data;
};

export const putTicketDetailsById = async ({
  orgId,
  ticketId,
  updatedTicketDetails,
}) => {
  console.log("Put Ticket Details by ID API is called");
  const { data } = await axios.put(
    `${domain}/orgs/${orgId}/tickets/${ticketId}`,
    updatedTicketDetails
  );
  return data;
};

export const deleteTicketById = async ({ ticketId, orgId }) => {
  console.log("Delete Ticket Details by ID API is called");
  const { data } = await axios.delete(`${domain}/orgs/${orgId}/tickets/${ticketId}`);
  return data;
};
