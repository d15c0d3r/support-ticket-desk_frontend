import React from "react";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { getTicketsByOrgIdForInsights } from "../apis/ticketApi";
import { useOrgState } from "../store/orgState";
import "../styles/Insights.css";
import { Spin, Typography } from "antd";

export const Insights = () => {
  const [orgState] = useOrgState();
  const getTicketsForInsightsKey = [`get-tickets-insights`, orgState.id];
  const getTicketsForInsights = useQuery(
    getTicketsForInsightsKey,
    getTicketsByOrgIdForInsights
  );

  // console.log(getTicketsForInsights.data);
  if (getTicketsForInsights.isLoading) {
    return (
      <div
        className="spinner"
        style={{
          width: "100%",
          minHeight: "85vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  var barGraphoptions = {
    series: [
      {
        name: "Tickets Generated",
        data: getTicketsForInsights.data
          ? getTicketsForInsights.data?.tickets?.ticketsGenerated
          : [],
      },
      {
        name: "Tickets Resolved",
        data: getTicketsForInsights.data
          ? getTicketsForInsights.data?.tickets?.ticketsResolved
          : [],
      },
    ],
    chart: {
      type: "bar",
      height: 430,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["blue"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["green"],
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    xaxis: {
      categories: getTicketsForInsights.data?.tickets?.dates,
      title: {
        text: "Tickets",
      },
    },
    yaxis: {
      title: {
        text: "Date",
      },
    },
  };

  return (
    <>
      <div className="insights-container">
        <div className="insights-chart">
          {getTicketsForInsights.data?.tickets?.dates.length ? (
            <ReactApexChart
              options={barGraphoptions}
              series={barGraphoptions.series}
              type={barGraphoptions.chart.type}
            />
          ) : (
            <></>
          )}
        </div>
        <div className="insights-sla">
          <Typography.Title>
            {getTicketsForInsights.data?.sla
              ? `SLA : ${parseFloat(getTicketsForInsights.data?.sla).toFixed(
                  3
                )} Hours`
              : "No Tickets ResolvedYet!"}
          </Typography.Title>
        </div>
      </div>
    </>
  );
};
