using System;
using System.Collections.Generic;

namespace ProductCrud.Models;

public partial class Attachment
{
    public int AttachmentId { get; set; }

    public int? MessageId { get; set; }

    public string? FilePath { get; set; }

    public string? FileType { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual Message? Message { get; set; }
}
