import * as yup from 'yup'

//Step 1 
export const describeJobSchema = yup.object({
    company : yup.string().required("Company Name is required"),
    title : yup.string().required("Job Title is required"),
    location: yup.string().required("Location is required"),
    type : yup.object().shape({
        value: yup.string().required(),
        label: yup.string().required(),
      }).required("Job Type is required"),
    description: yup.string().required("Job Description is required")

});


//Step 2 
export const benefitsSchema = yup.object({
    minimumSalary : yup.number().integer()
    .min(0,"Minimum Salary can't have negative salary")
    .integer("Salary shouldn't include cents")
    .required("Salary is a necessity"),
    // .min(15000,"Can't be less than the minimum wage"),
    maximumSalary: yup.number()
    .transform((value) => Number.isNaN(value) ? null : value )
    .nullable()
    .min(0, "Maximum Salary can't have negative salary")
    .moreThan(yup.ref("minimumSalary"), "Maximum Salary needs to more than the minimum salary."),
    currencies : yup.string()
    .required("Currency is required")
    .nullable()

})

//Step 3
export const qualificationSchema = yup.object({
    minimumExperience : yup.number()
    .typeError("Number of Experience must be number")
    .required("Please enter a minimum number of experience")
    .min(0, "Can't have negative number of experience")
    .max(20, "Can't have more than 30 years of experience"),
    education : yup.string()
    .required("Please select the minimum education needed for this job."),
    maximumExperience: yup.number()
    .integer()
    .transform((value) => Number.isNaN(value) ? null : value )
    .nullable()
    .moreThan(yup.ref("minimumExperience"), "Maximum Experience needs to be more than the minimum salary."),
    skills : yup.array().of(
        yup.string().required(),
    ).min(1, "Skills is required, please select atleast one")

    
    
})
const currentDate = new Date();
//Step 4
export const applicationProcessSchema = yup.object({
    
    postDate : yup.date()
    .min(currentDate, "Date must be greater than the current date")
    .required("Post Date is required"),

    endDate : yup.date()
    .required("End Date is required")
    .min(yup.ref('postDate'), 'End date cannot be earlier than start date'),

    numberOfHires : yup.number()
    .transform((value) => Number.isNaN(value) ? null : value )
    .nullable()
    .positive("Number of Hires can't be negative")
    .required("Number of Hires is required"),

    
    applicationLink : yup.string()
    .url("Enter a valid URL")
    .required("Apply Link is needed ")

})