import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthGuard } from "./AuthGuard";
import { Home } from "../pages/Home";
import { Tickets } from "../pages/Tickets";
import { Users } from "../pages/Users";
import { Insights } from "../pages/Insights";
import { PageNotFound } from "../pages/PageNotFound";
import { RaiseTicketForm } from "../pages/RaiseTicketForm";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/tickets"
        element={
          <AuthGuard>
            <Tickets />
          </AuthGuard>
        }
      />
      <Route
        path="/insights"
        element={
          <AuthGuard>
            <Insights />
          </AuthGuard>
        }
      />
      <Route
        path="/users"
        element={
          <AuthGuard>
            <Users />
          </AuthGuard>
        }
      />
      <Route path="raise-ticket/:orgId" element={<RaiseTicketForm />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
