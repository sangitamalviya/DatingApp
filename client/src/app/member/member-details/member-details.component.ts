import { Member } from 'src/app/_models/member';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { ActivatedRoute } from '@angular/router';
import {  NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';

import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/_models/message';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';

import { CommonModule } from '@angular/common';
import { MemberMessagesComponent } from 'src/app/members/member-messages/member-messages.component';
import { TimeagoModule } from 'ngx-timeago';


@Component({
  selector: 'app-member-details',
  standalone:true,
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
  imports :[CommonModule,TabsModule,NgxGalleryModule,TimeagoModule,MemberMessagesComponent]
})
export class MemberDetailsComponent implements OnInit{
  @ViewChild('memberTabs',{static: true}) memberTabs?:TabsetComponent;
  member:Member ={} as Member;
  galleryOptions:NgxGalleryOptions[]=[];
  galleryImages:NgxGalleryImage[]=[];
  activaTab?:TabDirective;
  messages:Message[]=[];

  constructor(private memberService:MembersService,private route:ActivatedRoute,private messageService:MessageService) { }
 
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

this.getImages();

 }

 getImages(){
  if(!this.member) return[];
  const imageUrls=[];
  for(const photo of this.member.photos){
    imageUrls.push({
      small:photo.url,
      medium:photo.url,
      big:photo.url
    })
  }

  return imageUrls;
 }


 onTabActivated(data:TabDirective){
this.activaTab=data;
if(this.activaTab.heading==='Messages'){
this.loadMesage()
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
}
