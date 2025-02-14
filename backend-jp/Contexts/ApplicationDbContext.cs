using System;
using System.Collections.Generic;
using JobPreppersDemo.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace JobPreppersDemo.Contexts;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Degree> Degrees { get; set; }

    public virtual DbSet<Friend> Friends { get; set; }

    public virtual DbSet<Job> Jobs { get; set; }

    public virtual DbSet<JobEmployer> JobEmployers { get; set; }

    public virtual DbSet<JobLocation> JobLocations { get; set; }

    public virtual DbSet<JobPost> JobPosts { get; set; }

    public virtual DbSet<JobQualification> JobQualifications { get; set; }

    public virtual DbSet<Resume> Resumes { get; set; }

    public virtual DbSet<School> Schools { get; set; }

    public virtual DbSet<Skill> Skills { get; set; }

    public virtual DbSet<Study> Studies { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserEducation> UserEducations { get; set; }

    public virtual DbSet<UserExperience> UserExperiences { get; set; }

    public virtual DbSet<UserProject> UserProjects { get; set; }

    public virtual DbSet<UserSkill> UserSkills { get; set; }

    public virtual DbSet<Work> Works { get; set; }

    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Degree>(entity =>
        {
            entity.HasKey(e => e.degreeID).HasName("PRIMARY");

            entity.ToTable("Degree");

            entity.Property(e => e.degree_name).HasMaxLength(255);
        });

        modelBuilder.Entity<Friend>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.HasIndex(e => e.friendID, "friendID");

            entity.HasIndex(e => new { e.userID, e.friendID }, "userID").IsUnique();

            entity.Property(e => e.created_at)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp");
            entity.Property(e => e.status)
                .HasDefaultValueSql("'pending'")
                .HasColumnType("enum('pending','accepted','rejected')");

            entity.HasOne(d => d.friend).WithMany(p => p.Friendfriends)
                .HasForeignKey(d => d.friendID)
                .HasConstraintName("Friends_ibfk_2");

            entity.HasOne(d => d.user).WithMany(p => p.Friendusers)
                .HasForeignKey(d => d.userID)
                .HasConstraintName("Friends_ibfk_1");
        });

        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.jobID).HasName("PRIMARY");

            entity.Property(e => e.benefits).HasColumnType("json");
            entity.Property(e => e.bonus).HasColumnType("json");
            entity.Property(e => e.company).HasMaxLength(100);
            entity.Property(e => e.description).HasColumnType("text");
            entity.Property(e => e.endDate).HasColumnType("datetime");
            entity.Property(e => e.location).HasMaxLength(100);
            entity.Property(e => e.perks).HasColumnType("json");
            entity.Property(e => e.postDate).HasColumnType("datetime");
            entity.Property(e => e.title).HasMaxLength(100);
            entity.Property(e => e.type).HasMaxLength(50);
        });

        modelBuilder.Entity<JobEmployer>(entity =>
        {
            entity.HasKey(e => e.companyID).HasName("PRIMARY");

            entity.ToTable("JobEmployer");

            entity.HasIndex(e => e.companyName, "JobEmployer_pk").IsUnique();

            entity.Property(e => e.Department).HasMaxLength(100);
            entity.Property(e => e.companyName).HasMaxLength(100);
        });

        modelBuilder.Entity<JobLocation>(entity =>
        {
            entity.HasKey(e => e.locationID).HasName("PRIMARY");

            entity.HasIndex(e => e.name, "JobLocation_pk").IsUnique();

            entity.Property(e => e.name).HasMaxLength(300);
        });

        modelBuilder.Entity<JobPost>(entity =>
        {
            entity.HasKey(e => e.postID).HasName("PRIMARY");

            entity.HasIndex(e => e.employerID, "JobPosts_Employers_companyID_fk");

            entity.HasIndex(e => e.locationID, "JobPosts_JobLocation_locationID_fk");

            entity.HasIndex(e => e.qualificationID, "JobPosts_JobQualifications_qualID_fk");

            entity.Property(e => e.benefits).HasColumnType("json");
            entity.Property(e => e.bonus).HasColumnType("json");
            entity.Property(e => e.currency).HasMaxLength(4);
            entity.Property(e => e.description).HasColumnType("json");
            entity.Property(e => e.endDate).HasColumnType("datetime");
            entity.Property(e => e.link).HasColumnType("text");
            entity.Property(e => e.paymentType).HasMaxLength(50);
            entity.Property(e => e.perks).HasColumnType("json");
            entity.Property(e => e.postDate).HasColumnType("datetime");
            entity.Property(e => e.title).HasMaxLength(150);
            entity.Property(e => e.type).HasMaxLength(50);

            entity.HasOne(d => d.employer).WithMany(p => p.JobPosts)
                .HasForeignKey(d => d.employerID)
                .HasConstraintName("JobPosts_Employers_companyID_fk");

            entity.HasOne(d => d.location).WithMany(p => p.JobPosts)
                .HasForeignKey(d => d.locationID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("JobPosts_JobLocation_locationID_fk");

            entity.HasOne(d => d.qualification).WithMany(p => p.JobPosts)
                .HasForeignKey(d => d.qualificationID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("JobPosts_JobQualifications_qualID_fk");
        });

        modelBuilder.Entity<JobQualification>(entity =>
        {
            entity.HasKey(e => e.qualID).HasName("PRIMARY");

            entity.Property(e => e.EducationLevel).HasMaxLength(255);
            entity.Property(e => e.Skills).HasColumnType("json");
        });

        modelBuilder.Entity<Resume>(entity =>
        {
            entity.HasKey(e => e.resumeID).HasName("PRIMARY");

            entity.ToTable("Resume");

            entity.HasIndex(e => e.userID, "userID");

            entity.Property(e => e.upload_date)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp");

            entity.HasOne(d => d.user).WithMany(p => p.Resumes)
                .HasForeignKey(d => d.userID)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("Resume_ibfk_1");
        });

        modelBuilder.Entity<School>(entity =>
        {
            entity.HasKey(e => e.schoolID).HasName("PRIMARY");

            entity.ToTable("School");

            entity.Property(e => e.school_name).HasMaxLength(255);
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.skillID).HasName("PRIMARY");

            entity.HasIndex(e => e.Name, "Name").IsUnique();

            entity.Property(e => e.Category).HasMaxLength(255);
        });

        modelBuilder.Entity<Study>(entity =>
        {
            entity.HasKey(e => e.studyID).HasName("PRIMARY");

            entity.ToTable("Study");

            entity.Property(e => e.study_name).HasMaxLength(255);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.userID).HasName("PRIMARY");

            entity.HasIndex(e => e.email, "email").IsUnique();

            entity.HasIndex(e => e.username, "username").IsUnique();

            entity.Property(e => e.account_type).HasDefaultValueSql("'1'");
            entity.Property(e => e.email).HasMaxLength(100);
            entity.Property(e => e.first_name).HasMaxLength(50);
            entity.Property(e => e.last_name).HasMaxLength(50);
            entity.Property(e => e.location).HasMaxLength(255);
            entity.Property(e => e.password).HasMaxLength(255);
            entity.Property(e => e.title).HasMaxLength(100);
            entity.Property(e => e.username).HasMaxLength(50);
        });

        modelBuilder.Entity<UserEducation>(entity =>
        {
            entity.HasKey(e => e.userEducationID).HasName("PRIMARY");

            entity.ToTable("UserEducation");

            entity.HasIndex(e => e.degreeID, "degreeID");

            entity.HasIndex(e => e.schoolID, "schoolID");

            entity.HasIndex(e => e.studyID, "studyID");

            entity.HasIndex(e => e.userID, "userID");

            entity.Property(e => e.description).HasColumnType("text");

            entity.HasOne(d => d.degree).WithMany(p => p.UserEducations)
                .HasForeignKey(d => d.degreeID)
                .HasConstraintName("UserEducation_ibfk_3");

            entity.HasOne(d => d.school).WithMany(p => p.UserEducations)
                .HasForeignKey(d => d.schoolID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("UserEducation_ibfk_2");

            entity.HasOne(d => d.study).WithMany(p => p.UserEducations)
                .HasForeignKey(d => d.studyID)
                .HasConstraintName("UserEducation_ibfk_4");

            entity.HasOne(d => d.user).WithMany(p => p.UserEducations)
                .HasForeignKey(d => d.userID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("UserEducation_ibfk_1");
        });

        modelBuilder.Entity<UserExperience>(entity =>
        {
            entity.HasKey(e => e.userExperienceID).HasName("PRIMARY");

            entity.ToTable("UserExperience");

            entity.HasIndex(e => e.userID, "userID");

            entity.HasIndex(e => e.workID, "workID");

            entity.Property(e => e.description).HasColumnType("text");
            entity.Property(e => e.job_title).HasMaxLength(100);

            entity.HasOne(d => d.user).WithMany(p => p.UserExperiences)
                .HasForeignKey(d => d.userID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("UserExperience_ibfk_1");

            entity.HasOne(d => d.work).WithMany(p => p.UserExperiences)
                .HasForeignKey(d => d.workID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("UserExperience_ibfk_2");
        });

        modelBuilder.Entity<UserProject>(entity =>
        {
            entity.HasKey(e => e.projectID).HasName("PRIMARY");

            entity.HasIndex(e => e.userID, "userID");

            entity.Property(e => e.description).HasColumnType("text");
            entity.Property(e => e.project_title).HasMaxLength(255);

            entity.HasOne(d => d.user).WithMany(p => p.UserProjects)
                .HasForeignKey(d => d.userID)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("UserProjects_ibfk_1");
        });

        modelBuilder.Entity<UserSkill>(entity =>
        {
            entity.HasKey(e => e.userSkillID).HasName("PRIMARY");

            entity.HasIndex(e => e.skillID, "skillID");

            entity.HasIndex(e => e.userID, "userID");

            entity.HasOne(d => d.skill).WithMany(p => p.UserSkills)
                .HasForeignKey(d => d.skillID)
                .HasConstraintName("UserSkills_ibfk_2");

            entity.HasOne(d => d.user).WithMany(p => p.UserSkills)
                .HasForeignKey(d => d.userID)
                .HasConstraintName("UserSkills_ibfk_1");
        });

        modelBuilder.Entity<Work>(entity =>
        {
            entity.HasKey(e => e.workID).HasName("PRIMARY");

            entity.ToTable("Work");

            entity.Property(e => e.location).HasMaxLength(255);
            entity.Property(e => e.work_name).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
