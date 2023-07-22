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

namespace API.Controllers
{
     [ApiController]
    public class AccountController:BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public IMapper _mapper { get; }
        public AccountController(DataContext context,ITokenService tokenService,IMapper mapper)
        {
            this._mapper = mapper;
            this._tokenService = tokenService;
            _context=context;
        }

        [HttpPost("register")] //api//account/register?username=dave&password=23
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if(await  UserExists(registerDto.Username)) return BadRequest("Username is taken");

             var user=_mapper.Map<AppUser>(registerDto);
             using var hmac = new HMACSHA512();

             user.UserName=registerDto.Username.ToLower();
             user.PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
             user.PasswordSalt=hmac.Key;
     

           _context.Users.Add(user);
           await _context.SaveChangesAsync();

           return new UserDto{
            UserName=user.UserName,
            Token=_tokenService.CreateToken(user),
            KnownAs=user.KnownAs
           };
        }

        private async Task<bool> UserExists(string username){
            return await _context.Users.AnyAsync(x=>x.UserName==username);
        }
         
         [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto){
            var user=await _context.Users.Include(p=>p.Photos).SingleOrDefaultAsync(x=>
                      x.UserName==loginDto.UserName);

            if(user==null)  return Unauthorized("invalid username");        
            using var hmac=new HMACSHA512(user.PasswordSalt);
            var ComputedHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for(int i=0;i<ComputedHash.Length;i++){
                if(ComputedHash[i]!=user.PasswordHash[i]) return Unauthorized("invalid password");
            }

            return new UserDto{
            UserName=user.UserName,
            Token=_tokenService.CreateToken(user),
            PhotoUrl=user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
            KnownAs=user.KnownAs
           };
        }
    }
}