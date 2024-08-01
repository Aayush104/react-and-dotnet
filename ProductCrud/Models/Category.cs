using System;
using System.Collections.Generic;

namespace ProductCrud.Models;

public partial class Category
{
    public int Cid { get; set; }

    public string Cname { get; set; } = null!;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
