"use client";

import Chart from "react-apexcharts";
import { useMemo } from "react";

export default function UsersBarChart({
  title,
  categories,
  series,
  colors = ["#ff4d6d"],
}) {
  const options = useMemo(
    () => ({
      chart: {
        id: "dynamic-chart",
        toolbar: { show: false },
      },
      title: {
        text: title,
        align: "center",
      },
      xaxis: {
        categories,
      },
      colors,
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "70%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: "top",
      },
      grid: {
        borderColor: "#eee",
      },
    }),
    [title, categories, colors]
  );

  return (
    <Chart options={options} series={series} type="bar" height={350} />
  );
}