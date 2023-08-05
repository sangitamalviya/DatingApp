using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context,IMapper mapper)
        {
            this._mapper = mapper;
            this._context = context;
            
        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
             _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PageList<MessageDto>> GetMessageForUser(MessageParam messageParam)
        {
            var query=_context.Messages
            .OrderByDescending(x=>x.MessageSent)
            .AsQueryable();

            query=messageParam.Container switch
            {
                "Inbox" => query.Where(u=>u.RecipientUsername==messageParam.Username),
                "Outbox" =>query.Where(u=>u.SenderUsername==messageParam.Username 
                &&u.RecipientDeleted==false && u.SenderDeleted==false),
               _ => query.Where(u=>u.RecipientUsername==messageParam.Username &&
                u.DateRead == null)
            };

            var message=query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PageList<MessageDto>
                         .CreateAsync(message,messageParam.PageNumber,messageParam.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName,string recipientUserName)
        {
            var messages=await _context.Messages
            .Include(u=>u.Sender).ThenInclude(p=>p.Photos)
            .Include(u=>u.Recipient).ThenInclude(p=>p.Photos)
            .Where(
                m=>m.RecipientUsername==currentUserName &&
                m.RecipientDeleted==false &&
                 m.SenderUsername==recipientUserName ||
                 m.RecipientUsername==recipientUserName &&
                 m.SenderDeleted==false &&
                 m.SenderUsername==currentUserName
            )
            .OrderBy(m=>m.MessageSent)
            .ToListAsync();

            var unreadMessages=messages.Where(m=>m.DateRead==null &&
            m.RecipientUsername==currentUserName).ToList();

            if(unreadMessages.Any()){
                foreach(var message in unreadMessages){
                    message.DateRead=DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync()>0;
        }
    }
}