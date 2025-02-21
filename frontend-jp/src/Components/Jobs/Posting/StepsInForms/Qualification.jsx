import {
  FormGroup,
  TextField,
  FormControlLabel,
  Autocomplete,
  Checkbox,
  Input,
  InputLabel,
  DialogContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import AutoCompleteForm from "../Helper/AutoCompleteForm";
import { useFormContext, Controller } from "react-hook-form";
import styles from "../Posting.module.css";
import { errorMessage } from "../Helper/ErrorMessage";

export default function Qualification() {
  const [skills, setSkills] = useState([
    "Communication",
    "Leadership",
    "Team-Management",
  ]);
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState("");
  let tokenTimeExpiration = null;
  let accessToken = null;

  const [experienceLabel, setExperienceLevel] = useState("Entry Level");

  const handleExperienceLabel = () => {};
  useEffect(() => {
    console.log("Skills updated:", skills); // Logs when skills are updated
  }, [skills]);

  const fetchToken = async () => {
    try {
      if (accessToken && tokenTimeExpiration > Date.now()) {
        return accessToken;
      } else {
        const response = await fetch("http://localhost:8000/get-token");
        const data = await response.json();
        tokenTimeExpiration = Date.now() + 3600 * 1000;
        accessToken = data.access_token;
        return data.access_token;
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };

  const fetchSkills = async (query) => {
    try {
      const token = await fetchToken();
      if (token) {
        const skillResponse = await fetch(
          `https://emsiservices.com/skills/versions/latest/skills?q=${query}&typeIds=ST1%2CST2&fields=id%2Cname%2Ctype%2CinfoUrl&limit=5`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const response = await skillResponse.json();
        const skillList = response.data.map((option) => option.name);
        setSkills(skillList);
      }
    } catch (error) {
      console.log("GetSkills Error: ", error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue[0] < 2) {
      setExperienceLevel("Entry Level");
    } else if (newValue[0] < 5) {
      setExperienceLevel("Associate");
    } else if (newValue[0] < 10) {
      setExperienceLevel("Mid Level");
    } else {
      setExperienceLevel("Senior");
    }
  };

  const educationOptions = [
    "No Education",
    "High-School Diploma",
    "Bachelor's Degree",
    "Masters",
    "PHD",
    "Doctorates",
  ];
  const jobForm = useFormContext();
  const {
    register,
    control,
    resetField,
    formState: { errors },
  } = jobForm;
  /** Need to Implement  */

  return (
    <>
      <div className={styles.input}>
        <div className={styles.inputField}>
          <h2>Education Level</h2>
          <AutoCompleteForm
            name="education"
            label="Education Level *"
            options={educationOptions}
            control={control}
          />
          {errorMessage(errors.education)}
        </div>
      </div>

      <div className={styles.inputField}>
        <h2>Number of Years of Experience Necessary</h2>
        <div className={styles.twoGrid}>
          <TextField
            required
            id="experienceStartingRange"
            type="number"
            label="Starting Range"
            {...register("minimumExperience", { valueAsNumber: true })}
          />
          <TextField
            id="experienceEnding"
            type="number"
            label="Ending Range"
            {...register("maximumExperience", { valueAsNumber: true })}
          />
        </div>
        <div className={styles.twoGrid}>
          {errorMessage(errors.minimumExperience) ? (
            errorMessage(errors.minimumExperience)
          ) : (
            <div />
          )}
        </div>
      </div>

      <div className={styles.inputField}>
        <h2>Required Skills</h2>
        <Controller
          control={control}
          name="skills"
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              freeSolo
              autoSelect
              options={skills}
              value={field.value}
              onChange={(_, value) => {
                field.onChange(value);
              }}
              getOptionLabel={(option) =>
                (typeof option === "object" ? option.label : option) || ""
              }
              // getOptionLabel={(option) => option.label || ""} // Adjust based on API response
              onInputChange={(event, newInputValue) => {
                if (newInputValue.length > 1) {
                  fetchSkills(newInputValue);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Search Skills *" />
              )}
            />
          )}
        />
        {errorMessage(errors.skills)}
      </div>

      <div className={styles.inputField}>
        <h2>Ask these questions to the applicant?</h2>
        <FormGroup>
          <Controller
            name="workVisaRequired"
            defaultValue={false}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Will you require a work visa or sponsorship now or later in the future?"
              />
            )}
          />
          <Controller
            name="authorizedToWork"
            defaultValue={false}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Are you legally authorized to work in the USA"
              />
            )}
          />
        </FormGroup>
      </div>
    </>
  );
}
