import "./Jobs.css";
import Stack from "@mui/material/Stack";
import Salary from "./FilterMenu/Salary";
import JobType from "./FilterMenu/JobType";
import Distance from "./FilterMenu/Distance";
import DueDate from "./FilterMenu/DueDate";
import Company from "./FilterMenu/Company";
import { SvgIcon, IconButton, Typography } from "@mui/material";

import { useEffect, useState, useRef } from "react";
import styles from "./Jobs.module.css";
export default function FilterColumn({
  setJobs,
  jobs,
  filters,
  setFilters,
  userCoordinate,
}) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef(null);
  const [error, setError] = useState(null); // Define error state here

  useEffect(() => {
    const handleSearch = async () => {
      // e.preventDefault(); // Prevent default form submission
      console.log("Filter: ", { filters });
      try {
        const response = await fetch(
          "http://localhost:5000/api/jobpost/filter",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filters),
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Data: ", { data });
          setJobs(data);
        } else {
          const errorData = await response.json();
          console.log("Error: ", { errorData });

          setError(errorData.message); // Show error message from the backend
        }
      } catch (err) {
        console.log("Catch Error");
        setError("An error occurred. Please try again."); // Catch and display any request error
      }
    };
    handleSearch();
  }, [filters]);

  const checkOverflow = () => {
    const container = containerRef.current;
    if (container) {
      setIsOverflowing(container.scrollWidth > container.clientWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <>
      <div ref={containerRef} className="filter-column-container">
        <Stack
          direction="row"
          spacing={2}
          className={`${styles.filterColumn} ${
            isOverflowing ? styles.filterColumnOverflow : ""
          }`}
        >
          <Salary setFilters={setFilters} />
          <Distance setFilters={setFilters} userCoordinate={userCoordinate} />
          <Company setFilters={setFilters} jobs={jobs} />
          <JobType setFilters={setFilters} />
          <DueDate setFilters={setFilters} />
          <IconButton
            aria-label="filter-button"
            className={styles.filterButton}
          >
            <SvgIcon>
              {/* credit: filter icon from https://heroicons.com */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.filterIcon}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
            </SvgIcon>
          </IconButton>
        </Stack>
        <div className={styles.resultText}>
          <Typography variant="subtitle1" sx={{ color: "grey" }}>
            {" "}
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found.{" "}
          </Typography>
        </div>
      </div>
    </>
  );
}
