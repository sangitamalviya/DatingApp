import { Member } from 'src/app/_models/member';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';

import { CommonModule } from '@angular/common';
import { MemberMessagesComponent } from 'src/app/members/member-messages/member-messages.component';
import { TimeagoModule } from 'ngx-timeago';
import { PresenceService } from 'src/app/_services/presence.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';


@Component({
  selector: 'app-member-details',
  standalone:true,
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
  imports :[CommonModule,TabsModule,TimeagoModule,MemberMessagesComponent,GalleryModule]
})
export class MemberDetailsComponent implements OnInit,OnDestroy{
  @ViewChild('memberTabs',{static: true}) memberTabs?:TabsetComponent;
  member:Member ={} as Member;
  // galleryOptions:NgxGalleryOptions[]=[];
  // galleryImages:NgxGalleryImage[]=[];
  activaTab?:TabDirective;
  messages:Message[]=[];
  user?:User;
  images:GalleryItem[]=[];

  constructor(private accountService:AccountService,private route:ActivatedRoute,
    private messageService:MessageService,public presenceService:PresenceService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next:user =>{
          if(user) this.user=user;
        }
      })
    }
 
  ngOnInit():void{
this.route.data.subscribe({
  next:data=>this.member = data['member']
})

this.route.queryParams.subscribe({
  next:params =>{
    params['tab'] && this.selectTab(params['tab'])
  }
})

// this.galleryOptions=[{
//   width:'500px',
//   height:'500px',
//   imagePercent:100,
//   thumbnailsColumns:4,
//   imageAnimation:NgxGalleryAnimation.Slide,
// preview:false
// }]

// this.galleryImages = this.getImages();
this.getImages();
 }

 getImages(){
   if(!this.member) return;
   for(const photo of this.member.photos){
   this.images.push(new ImageItem({src:photo.url,thumb:photo.url}))
  }
  }


 onTabActivated(data:TabDirective){
this.activaTab=data;
if(this.activaTab.heading==='Messages' && this.user){
  this.messageService.createHubConnection(this.user,this.member.userName);
}
else{
  this.messageService.stopHubconnection();
}
 }

 selectTab(heading:String){
if(this.memberTabs)
{
  this.memberTabs.tabs.find(x=>x.heading===heading)!.active=true;
}
}

 loadMesage(){
  if(this.member){
    this.messageService.getMessageThread(this.member.userName).subscribe({
      next:messages => this.messages=messages
    })
  }
}
ngOnDestroy(): void {
  this.messageService.stopHubconnection();
}
}
