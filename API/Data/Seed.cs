using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context){
          if(await context.Users.AnyAsync()) return;
          var userData=await File.ReadAllTextAsync("Data/UserSeedData.json");
          var options=new JsonSerializerOptions{PropertyNameCaseInsensitive=true};
          var users= JsonConvert.DeserializeObject<List<AppUser>>(userData);

          foreach(var user in users){
            using var hmac=new HMACSHA512();
            user.UserName=user.UserName.ToLower();
            user.PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));
            user.PasswordSalt=hmac.Key;
            context.Users.Add(user);
              foreach(var photos in  user.Photos){
                photos.AppUser=user;
                context.Photos.Add(photos);
              }
          }
          await context.SaveChangesAsync();
          var a= context.Users.ToList();
        }
    }
}