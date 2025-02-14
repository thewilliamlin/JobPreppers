using System;
using System.Collections.Generic;

namespace JobPreppersDemo.Models;

public partial class Friend
{
    public int id { get; set; }

    public int userID { get; set; }

    public int friendID { get; set; }

    public string? status { get; set; }

    public DateTime? created_at { get; set; }

    public virtual User friend { get; set; } = null!;

    public virtual User user { get; set; } = null!;
}
