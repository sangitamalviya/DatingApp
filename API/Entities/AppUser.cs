using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace API.Entities
{
    public class AppUser
    {
       
        public int Id { get; set; }
        [Required]
        public String  UserName { get; set; }
        public byte[] PasswordHash{get;set;}
        public byte[] PasswordSalt {get;set;}
    }
}