using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductCrud.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ProductCrud.Hubsss
{
   
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;
        private readonly ProductCrudContext _context;

        public ChatHub(ILogger<ChatHub> logger, ProductCrudContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task SendMessage(string senderId, string receiverId, string message)
        {
            _logger.LogInformation("SendMessage called with senderId: {SenderId}, receiverId: {ReceiverId}, message: {Message}", senderId, receiverId, message);

            if (int.TryParse(senderId, out int senderIdInt) && int.TryParse(receiverId, out int receiverIdInt))
            {
                var conversation = _context.Conversations
                    .FirstOrDefault(c => (c.SenderId == senderIdInt && c.ReceiverId == receiverIdInt) ||
                                         (c.SenderId == receiverIdInt && c.ReceiverId == senderIdInt));

                if (conversation == null)
                {
                    int converId = _context.Conversations.Any()
                        ? _context.Conversations.Max(e => e.ConversationId) + 1
                        : 1;

                    conversation = new Conversation
                    {
                        ConversationId = converId,
                        SenderId = senderIdInt,
                        ReceiverId = receiverIdInt,
                        CreatedAt = DateTime.Now
                    };

                    _context.Conversations.Add(conversation);
                    await _context.SaveChangesAsync();
                }

                int messageId = _context.Messages.Any()
                    ? _context.Messages.Max(e => e.MessageId) + 1
                    : 1;

                Message m = new Message
                {
                    MessageId = messageId,
                    ConversationId = conversation.ConversationId,
                    SenderId = senderIdInt,
                    Context = message,
                    SentAt = DateTime.Now
                };

                _context.Messages.Add(m);
                await _context.SaveChangesAsync();

                // Send the message to both the sender and receiver
              //  await Clients.User(senderId).SendAsync("ReceiveMessage", senderId, message);
                await Clients.All.SendAsync("ReceiveMessage", senderId, message);
            }
            else
            {
                _logger.LogWarning("Invalid data received: senderId, receiverId, and message must be provided.");
                throw new InvalidDataException("Invalid data received: senderId, receiverId, and message must be provided.");
            }
        }
    }
}

      
    

