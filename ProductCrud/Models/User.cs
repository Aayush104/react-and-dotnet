using System;
using System.Collections.Generic;

namespace ProductCrud.Models;

public partial class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public string EmailAddress { get; set; } = null!;

    public string UserAddress { get; set; } = null!;

    public string? UserPassword { get; set; }

    public string UserRole { get; set; } = null!;

    public string? Otp { get; set; }

    public DateTime? ExpieryDate { get; set; }

    public virtual ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
