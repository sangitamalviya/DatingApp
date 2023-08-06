using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManger;
public AdminController(UserManager<AppUser> userManager)
{
    _userManger=userManager;
}

        [Authorize(Policy="RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles(){
           var users=await _userManger.Users.OrderBy(u=>u.UserName)
           .Select( u => new {
            u.Id,
            UserName=u.UserName,
            Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
           })
           .ToListAsync();

           return Ok(users);
        }

       
        [Authorize(Policy="ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModernation(){
            return Ok("Admin or moderators can see this");
        }
    

[Authorize(Policy ="RequireAdminRole")]
[HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRole(string username,[FromQuery]string roles){
        if(string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");
   
     var selectedRoles=roles.Split(",").ToArray();
     var user=await _userManger.FindByNameAsync(username);

     if(user==null) return NotFound();
     var userRoles=await _userManger.GetRolesAsync(user);
            var result = await _userManger.AddToRolesAsync(user, selectedRoles.Except(userRoles));

     if(!result.Succeeded) return BadRequest("Failed to add to roles");
     result=await _userManger.RemoveFromRolesAsync(user,userRoles.Except(selectedRoles));

     if(!result.Succeeded) return BadRequest("Failed to remove from roles");

     return Ok(await _userManger.GetRolesAsync(user));
    }
}
}