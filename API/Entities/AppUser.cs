using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using API.Extensions;
using System.Text.Json.Serialization;

namespace API.Entities
{
    public class AppUser
    {
       
        public int Id { get; set; }
        [Required]
        public String  UserName { get; set; }
        public byte[] PasswordHash{get;set;}
        public byte[] PasswordSalt {get;set;}
        public DateOnly DateOfBirth{get;set;} 
        public string KnownAs{get;set;}
        public DateTime Created{get;set;}=DateTime.UtcNow;
           public DateTime LastActive{get;set;}=DateTime.UtcNow;
           public string Gender{get;set;}
            public string Introduction{get;set;}
             public string LookingFor{get;set;}
              public string Interests{get;set;} 
              public string City{get;set;}
               public string Country{get;set;}
                public virtual ICollection<Photo> Photos{get;set;}
          public List<UserLike> LikedByUsers{get;set;}
          public List<UserLike> LikedUsers{get;set;}

      public List<Message> MessageSent{get;set;}
      public List<Message> MessageReceived{get;set;}
    }

   
}