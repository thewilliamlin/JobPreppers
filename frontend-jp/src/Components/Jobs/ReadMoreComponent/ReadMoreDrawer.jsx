import React, { useState, useEffect, Fragment } from "react";
import ReactMarkdown from "react-markdown";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import Header from "./Header";
import PaymentsIcon from "@mui/icons-material/Payments";
import WorkIcon from "@mui/icons-material/Work";
import PlaceIcon from "@mui/icons-material/Place";
import "./ReadMoreStyle.css";
import styles from "../Jobs.module.css";
import DOMPurify from "dompurify";

export default function ReadMoreDrawer({ open, job, onClose }) {
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 1200); // Initial state based on window width

  useEffect(() => {
    const handleResize = () => {
      setIsNarrow(window.innerWidth < 1200); // Update isNarrow based on window width
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize); // Cleanup
  }, []);

  const drawerWidth = isNarrow ? "100%" : "600px";

  const sanitizeDescription = (description) => {
    console.log("Description:", job.description);
    console.log("Type of description:", typeof job.description);

    if (typeof description === "string") {
      try {
        const decodedDescription = JSON.parse(description);
        return DOMPurify.sanitize(decodedDescription);
      } catch (e) {
        return DOMPurify.sanitize(description);
      }
    }
    return "No description provided";
  };

  if (!job) return null;

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={open}
      onClose={onClose}
      hideBackdrop
      PaperProps={isNarrow ? styles.drawer : styles.drawerNarrow}
    >
      <Box sx={{ width: drawerWidth, padding: 2 }}>
        <Header job={job} onClose={onClose} />

        {/* Divider */}
        <Divider className="custom-divider" />
        <Box>
          <Typography className="start-text">Brief Overview </Typography>
          {job.maximumSalary == null ? (
            <Box className={styles.descriptionBox}>
              <PaymentsIcon />
              <Typography variant="body" className={styles.descriptionText}>
                ${job.minimumSalary}
              </Typography>
            </Box>
          ) : (
            <Box className={styles.descriptionBox}>
              <PaymentsIcon />
              <Typography variant="body" className={styles.descriptionText}>
                ${job.minimumSalary} - ${job.maximumSalary}
              </Typography>
            </Box>
          )}
          <Box className={styles.descriptionBox}>
            <WorkIcon />
            <Typography variant="body" className={styles.descriptionText}>
              {job.type}
            </Typography>
          </Box>
          <Box className={styles.descriptionBox}>
            <PlaceIcon />
            <Typography variant="body" className={styles.descriptionText}>
              {job.location}
            </Typography>
          </Box>

          <Divider className="custom-divider" />
        </Box>
        {job.bonus !== undefined && job.bonus !== null ? (
          <Fragment>
            <Box>
              <Typography className="start-text"> Bonuses</Typography>
              <Stack direction="row" spacing={1}>
                {JSON.parse(job.bonus).map((bonuses, index) => (
                  // <Chip key={index} label={benefit} variant="outlined" />
                  <Card className="cardCompensation">
                    <CardContent>
                      <Typography variant="p">{bonuses}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
              <Divider className="custom-divider" />
            </Box>
          </Fragment>
        ) : null}

        {job.benefits !== undefined && job.benefits !== null ? (
          <Fragment>
            <Box>
              <Typography className="start-text"> Benefits</Typography>
              <Stack direction="row" spacing={1}>
                {JSON.parse(job.benefits).map((benefit, index) => (
                  // <Chip key={index} label={benefit} variant="outlined" />
                  <Card className="cardCompensation">
                    <CardContent>
                      <Typography variant="p">{benefit}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
              <Divider className="custom-divider" />
            </Box>
          </Fragment>
        ) : null}
        {job.perks !== undefined && job.perks !== null ? (
          <Fragment>
            <Box>
              <Typography className="start-text"> Perks</Typography>
              <Stack direction="row" spacing={1}>
                {JSON.parse(job.perks).map((perks, index) => (
                  // <Chip key={index} label={benefit} variant="outlined" />
                  <Card className="cardCompensation">
                    <CardContent>
                      <Typography variant="p">{perks}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
            <Divider className="custom-divider" />
          </Fragment>
        ) : null}
        <Box>
          <Typography className="start-text"> Job Description</Typography>
          <Typography
            sx={{ typography: "body1", whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{
              __html: sanitizeDescription(job.description),
            }}
          ></Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
