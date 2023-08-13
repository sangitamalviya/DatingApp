using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser,AppRole,int,IdentityUserClaim<int>,
    AppUserRole, IdentityUserLogin<int>,IdentityRoleClaim<int>,IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }


       // public DbSet<AppUser> Users {get;set;}
         public DbSet<Photo> Photos {get;set;}
           public DbSet<UserLike> Likes {get;set;}
               public DbSet<Message> Messages {get;set;}
             public DbSet<Group> Groups{get;set;}  
     public DbSet<Connection> Connections{get;set;}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

                 modelBuilder.Entity<AppUser>()
                 .HasMany(ur=>ur.UserRoles)
                 .WithOne(u=>u.User)
                 .HasForeignKey(ur=>ur.UserId)
                 .IsRequired();

 modelBuilder.Entity<AppRole>()
                 .HasMany(ur=>ur.UserRoles)
                 .WithOne(u=>u.Role)
                 .HasForeignKey(ur=>ur.RoleId)
                 .IsRequired();


            modelBuilder.Entity<UserLike>()
            .HasKey(k=>new {k.SourceUserId,k.TargetUserId});

            modelBuilder.Entity<UserLike>()
            .HasOne(s=>s.SourceUser)
            .WithMany(l=>l.LikedUsers)
            .HasForeignKey(s=>s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

             modelBuilder.Entity<UserLike>()
            .HasOne(s=>s.TargerUser)
            .WithMany(l=>l.LikedByUsers)
            .HasForeignKey(s=>s.TargetUserId)
            .OnDelete(DeleteBehavior.Cascade);

            
             modelBuilder.Entity<Message>()
            .HasOne(r=>r.Recipient)
            .WithMany(m=>m.MessageReceived)
            .OnDelete(DeleteBehavior.Restrict);

              modelBuilder.Entity<Message>()
            .HasOne(u=>u.Sender)
            .WithMany(m=>m.MessageSent)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }
}