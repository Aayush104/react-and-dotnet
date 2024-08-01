using System;
using System.Collections.Generic;

namespace ProductCrud.Models;

public partial class Product
{
    public int Pid { get; set; }

    public string Pname { get; set; } = null!;

    public string Pdescription { get; set; } = null!;

    public decimal Price { get; set; }

    public int? UserId { get; set; }

    public int? Cid { get; set; }

    public virtual Category? CidNavigation { get; set; }

    public virtual User? User { get; set; }
}
