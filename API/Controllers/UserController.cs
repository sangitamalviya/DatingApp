using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] //Get /api/user
    [Authorize]
    public class UserController : BaseApiController
    {

        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
       
        public UserController(IUserRepository userRepository,IMapper mapper)
        {
            this._mapper = mapper;
            this._userRepository = userRepository;
           
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users=await _userRepository.GetMembersAsync();
            // var userToReturn=_mapper.Map<IEnumerable<MemberDto>>(users);
           return Ok(users);
         
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
           
          
        }
    }
}