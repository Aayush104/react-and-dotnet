﻿using System;
using System.Collections.Generic;

namespace ProductCrud.Models;

public partial class MessageStatus
{
    public int StatusId { get; set; }

    public int? MessageId { get; set; }

    public int? UserId { get; set; }

    public string? Status { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Message? Message { get; set; }

    public virtual User? User { get; set; }
}
