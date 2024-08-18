using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductCrud.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ProductCrud.ModelEdit;

namespace ProductCrud.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase

    { 

        private readonly ProductCrudContext _context;
        public ChatController(ProductCrudContext context)
        { 
        _context = context;     
        }

        [HttpGet("UserList")]
        [Authorize]
        public IActionResult GetUserList()
        {

            var user = HttpContext.User.FindFirst("Id");
            var userId = user?.Value;

            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }


            var checkUser = _context.Users
                             .Where(e => e.UserId != Convert.ToInt32(userId))
                             .ToList();

            return Ok(checkUser);



        }
        [HttpGet("GetMessages/{senderId}/{receiverId}")]
        public async Task<IActionResult> GetMessages([FromRoute] string senderId, [FromRoute] string receiverId)
        {
            if (int.TryParse(senderId, out int senderIdInt) && int.TryParse(receiverId, out int receiverIdInt))
            {
                var conversation = await _context.Conversations
                    .Include(c => c.Messages)
                    .FirstOrDefaultAsync(c => (c.SenderId == senderIdInt && c.ReceiverId == receiverIdInt) ||
                                              (c.SenderId == receiverIdInt && c.ReceiverId == senderIdInt));

                if (conversation != null)
                {
                    var messageDtos = conversation.Messages
                        .Select(m => new MessageDto
                        {
                            MessageId = m.MessageId,
                            Context = m.Context,
                            SentAt = m.SentAt
                        }).ToList();

                    return Ok(new ConversationDto
                    {
                        ConversationId = conversation.ConversationId,
                        Messages = messageDtos
                    });
                }

                return NotFound("Conversation not found.");
            }

            return BadRequest("Invalid senderId or receiverId.");
        }



    }
}
