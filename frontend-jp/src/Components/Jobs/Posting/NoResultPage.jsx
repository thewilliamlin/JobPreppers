import { Button, Typography } from "@mui/material";
import noResultImage from "../Img/noresult.png";
import styles from "../Jobs.module.css";

const NoResultPage = () => {
  return (
    <div className={`${styles.noResultContainer}`}>
      <img src={noResultImage} alt="Image indicate there no files found" />
      <Typography variant="h1" sx={{ fontSize: 50 }}>
        {" "}
        No Result Found{" "}
      </Typography>
      {/* <button className="resetButton">Reset</button> */}
      <a href="https://pngtree.com/freepng/no-result-search-icon_6511543.html">
        Image from pngtree.com
      </a>
    </div>
  );
};

export default NoResultPage;
