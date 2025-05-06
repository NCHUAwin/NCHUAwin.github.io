// Chart management functionality
export function createChartManager() {
  let chartInstance = null;

  function drawChart(years, journalData, conferenceData) {
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = document
      .getElementById("publication-trend-chart")
      .getContext("2d");

    const data = {
      labels: years,
      datasets: [
        {
          label: "Conference",
          data: conferenceData,
          backgroundColor: "#cddc39",
        },
        {
          label: "Journal",
          data: journalData,
          backgroundColor: "#80cbc4",
        },
      ],
    };

    chartInstance = new Chart(ctx, {
      type: "bar",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Annual Publication Trend (Journal vs. Conference)",
          },
          legend: {
            display: true,
            position: "bottom",
          },
        },
        scales: {
          y: {
            stacked: true,
            title: {
              display: true,
              text: "Publications",
            },
            ticks: {
              stepSize: 1,
              callback: function (value) {
                return Number(value).toFixed(0);
              },
            },
          },
          x: {
            stacked: true,
            title: {
              display: true,
              text: "Year",
            },
          },
        },
      },
    });
  }

  function calculatePublicationStats(publications) {
    const journalCounts = {};
    const conferenceCounts = {};

    publications.forEach((entry) => {
      const year = Number(entry.year);
      if (!year) return;

      const isConference =
        Array.isArray(entry.tag) && entry.tag.includes("conference");

      if (isConference) {
        conferenceCounts[year] = (conferenceCounts[year] || 0) + 1;
      } else {
        journalCounts[year] = (journalCounts[year] || 0) + 1;
      }
    });

    const allYears = Array.from(
      new Set(
        [...Object.keys(journalCounts), ...Object.keys(conferenceCounts)].map(
          Number
        )
      )
    ).sort((a, b) => a - b);

    const journalData = allYears.map((year) => journalCounts[year] || 0);
    const conferenceData = allYears.map((year) => conferenceCounts[year] || 0);

    return {
      years: allYears,
      journalData,
      conferenceData,
    };
  }

  return {
    drawChart,
    calculatePublicationStats,
  };
}
