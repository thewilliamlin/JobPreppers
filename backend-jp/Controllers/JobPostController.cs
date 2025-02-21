using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using JobPreppersDemo.Contexts;
using JobPreppersDemo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JobPreppersDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobPostController : Controller
    {
        private readonly ApplicationDbContext _context;
        public class PostFilterRequest
        {
            public DateTime? Date { get; set; }
            public List<string>? Type { get; set; }

            public List<string>? Company { get; set; }

            public int Min_Salary { get; set; }

            public double? Longitude { get; set; }

            public double? Latitude { get; set; }

            public int Distance { get; set; }


        }


        public class JobPostDto
        {
            public string company { get; set; } = string.Empty;
            public int minimumSalary { get; set; }
            public DateTime postDate { get; set; }
            public DateTime endDate { get; set; }
            public string title { get; set; } = string.Empty;
            public string type { get; set; } = string.Empty;
            public string location { get; set; } = string.Empty;
            public string description { get; set; } = string.Empty;

        }

        // public class PostRequest
        // {

        // }


        public JobPostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // // GET: api/jobpost
        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {

            try
            {

                // var jobs = await _context.Jobs.ToListAsync();
                var jobs = await _context.JobPosts
                                .Include(job => job.qualification)
                                .Include(job => job.employer)
                                .Include(job => job.location)
                                .Select(job => new
                                {
                                    company = job.employer.companyName,
                                    minimumSalary = job.minimumSalary,
                                    benefits = job.benefits,
                                    postDate = job.postDate,
                                    endDate = job.endDate,
                                    description = job.description,
                                    title = job.title,
                                    type = job.type,
                                    link = job.link,
                                    location = job.location.name

                                }
                                )
                                .ToListAsync();

                if (jobs == null)
                {
                    return NotFound("No jobs found.");
                }
                return Ok(new { jobs });

            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner Exception StackTrace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });


            }

        }

        // // GET: api/jobpost/add
        [HttpPost("add")]
        public async Task<ActionResult> PostJob([FromBody] JobPost request)
        {

            try
            {
                int employerID;
                // Add need to look for Company
                if (string.IsNullOrWhiteSpace(request.employer.companyName))
                {
                    return BadRequest("Employer info needed");
                }
                var employer = await _context.JobEmployers.FirstOrDefaultAsync(e => e.companyName == request.employer.companyName);
                if (employer == null)
                {
                    employer = new JobEmployer
                    {
                        companyName = request.employer.companyName
                    };
                    _context.JobEmployers.Add(employer);
                    await _context.SaveChangesAsync();
                    //Add
                }
                employerID = employer.companyID;


                int locationID;
                // Add need to look for Company
                if (string.IsNullOrWhiteSpace(request.location.name))
                {
                    return BadRequest("Employer info needed");
                }
                var location = await _context.JobLocations.FirstOrDefaultAsync(e => e.name == request.location.name);
                if (location == null)
                {
                    location = new JobLocation
                    {
                        name = request.location.name,
                        longitude = request.location.longitude,
                        latitude = request.location.latitude,
                    };
                    _context.JobLocations.Add(location);
                    await _context.SaveChangesAsync();
                    //Add
                }
                locationID = location.locationID;



                // Add - need to firstorDefault for location
                int qualificationID;
                var qualification = new JobQualification
                {
                    Skills = request.qualification.Skills,
                    MinimumExperience = request.qualification.MinimumExperience,
                    EducationLevel = request.qualification.EducationLevel,
                };
                _context.JobQualifications.Add(qualification);
                await _context.SaveChangesAsync();
                qualificationID = qualification.qualID;
                // Add location
                var newJobPost = new JobPost
                {
                    title = request.title,
                    description = request.description,
                    employerID = employerID,
                    locationID = locationID,
                    minimumSalary = request.minimumSalary,
                    postDate = request.postDate,
                    endDate = request.endDate,
                    type = request.type,
                    qualificationID = qualificationID,
                    benefits = request.benefits,
                    perks = request.perks,
                    bonus = request.bonus,
                    paymentType = request.paymentType,
                    link = request.link,

                };

                _context.JobPosts.Add(newJobPost);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Job added successfully", jobId = newJobPost.postID });
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner Exception StackTrace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });


            }

        }


        [HttpPost("filter")]
        public async Task<IActionResult> FilterJobs([FromBody] PostFilterRequest request)
        {
            IQueryable<JobPostDto> query;


            if (request.Latitude != null && request.Longitude != null && request.Distance != 0)
            {
                var distance = request.Distance * 1609.34;
                query = _context.JobPosts.FromSqlInterpolated(
                    $@"
                    SELECT jp.* FROM JobPosts jp,
                    JOIN JobLocations l on jp.locationID = l.locationID
                    WHERE (LOWER(l.name) REGEXP 'remote') OR ST_Distance_Sphere(Point({request.Longitude}, {request.Latitude}), Point(l.longitude, l.latitude)) <= {distance}"
                ).Include(job => job.employer)
                .Include(job => job.location)
                .Select(job => new JobPostDto
                {
                    company = job.employer.companyName,
                    minimumSalary = job.minimumSalary,
                    postDate = job.postDate,
                    endDate = job.endDate,
                    title = job.title,
                    type = job.type,
                    location = job.location.name,
                    description = job.description

                });

            }

            else
            {
                query = _context.JobPosts
                .Include(job => job.employer)
                .Include(job => job.location)
                .Select(job => new JobPostDto
                {
                    company = job.employer.companyName,
                    minimumSalary = job.minimumSalary,
                    postDate = job.postDate,
                    endDate = job.endDate,
                    title = job.title,
                    type = job.type,
                    location = job.location.name,
                    description = job.description

                });

            }

            if (request.Date != null)
            {
                var filterDate = request.Date.Value.Date;
                query = query.Where(job => job.postDate >= filterDate);
            }

            if (request.Type != null && request.Type.Any())
            {

                query = query.Where(job => request.Type.Contains(job.type));
            }

            if (request.Company != null && request.Company.Any())
            {
                query = query.Where(job => request.Company.Contains(job.company));
            }

            if (request.Min_Salary != 0)
            {
                query = query.Where(job => job.minimumSalary >= request.Min_Salary);
            }


            var filteredJobs = await query.ToListAsync();


            if (filteredJobs == null || filteredJobs.Count == 0)
            {
                return Ok(new List<Job>()); // Return an empty list with HTTP 200
            }

            return Ok(filteredJobs);
        }


        [HttpGet("company")]
        public async Task<IActionResult> GetCompany()
        {

            try
            {

                // var jobs = await _context.Jobs.ToListAsync();
                var jobs = await _context.JobPosts
                                .Include(job => job.employer)
                                .Select(job => new
                                {
                                    company = job.employer.companyName,
                                }
                                )
                                .ToListAsync();

                if (jobs == null)
                {
                    return NotFound("No jobs found.");
                }
                return Ok(new { jobs });

            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner Exception StackTrace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });


            }

        }


    }



}

