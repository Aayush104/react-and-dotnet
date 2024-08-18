using System;
using System.Collections.Generic;

namespace ProductCrud.Models;

public partial class Conversation
{
    public int ConversationId { get; set; }

    public int SenderId { get; set; }

    public int ReceiverId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
