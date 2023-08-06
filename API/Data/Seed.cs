using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManger,RoleManager<AppRole> roleManager){
          if(await userManger.Users.AnyAsync()) return;
          var userData=await File.ReadAllTextAsync("Data/UserSeedData.json");
          var options=new JsonSerializerOptions{PropertyNameCaseInsensitive=true};
          var users= JsonConvert.DeserializeObject<List<AppUser>>(userData);

           var roles=new List<AppRole>{
            new AppRole{Name="Member"},
             new AppRole{Name="Admin"},
              new AppRole{Name="Moderator"},
           };

           foreach(var role in roles){
            await roleManager.CreateAsync(role);
           }

          foreach(var user in users){
            user.UserName=user.UserName.ToLower();
            await userManger.CreateAsync(user,"Pa$$0rd");
            await userManger.AddToRoleAsync(user,"Member");
          }

          var admin=new AppUser{
            UserName="admin"
          };

          await userManger.CreateAsync(admin,"Pa$$0rd");
            await userManger.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
         
        }
    }
}