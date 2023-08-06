using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
     [ApiController]
    public class AccountController:BaseApiController
    {
        public UserManager<AppUser> _userManager { get; }
     
        private readonly ITokenService _tokenService;
        public IMapper _mapper { get; }
        public AccountController(UserManager<AppUser> userManager,ITokenService tokenService,IMapper mapper)
        {
            this._userManager = userManager;
            this._mapper = mapper;
            this._tokenService = tokenService;
        }

        [HttpPost("register")] //api//account/register?username=dave&password=23
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await  UserExists(registerDto.Username)) return BadRequest("Username is taken");

             var user=_mapper.Map<AppUser>(registerDto);
          
             user.UserName=registerDto.Username.ToLower();
           var result=await _userManager.CreateAsync(user,registerDto.Password);
           if(!result.Succeeded) return BadRequest();
           var roleResult=await _userManager.AddToRoleAsync(user,"Member");

           if(!roleResult.Succeeded) return BadRequest(result.Errors);

           return new UserDto{
            UserName=user.UserName,
            Token=await _tokenService.CreateToken(user),
            KnownAs=user.KnownAs,
            Gender=user.Gender
           };
        }

        private async Task<bool> UserExists(string username){
            return await _userManager.Users.AnyAsync(x=>x.UserName==username);
        }
         
         [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){
            var user=await _userManager.Users.Include(p=>p.Photos).SingleOrDefaultAsync(x=>
                      x.UserName==loginDto.UserName);

            if(user==null)  return Unauthorized("invalid username"); 
            var result=await _userManager.CheckPasswordAsync(user,loginDto.Password);
           
            return new UserDto{
            UserName=user.UserName,
            Token=await _tokenService.CreateToken(user),
            PhotoUrl=user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
            KnownAs=user.KnownAs,
            Gender=user.Gender
           };
        }
    }
}