using System;
using System.Collections.Generic;

namespace ProductCrud.Models;

public partial class Message
{
    public int MessageId { get; set; }

    public int? ConversationId { get; set; }

    public int? SenderId { get; set; }

    public string? Context { get; set; }

    public DateTime? SentAt { get; set; }

    public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();

    public virtual Conversation? Conversation { get; set; }

    public virtual ICollection<MessageStatus> MessageStatuses { get; set; } = new List<MessageStatus>();

    public virtual User? Sender { get; set; }
}
