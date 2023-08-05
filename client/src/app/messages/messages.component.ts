import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_models/paginzation';
import { MessageService } from '../_services/message.service';
import { Message } from '../_models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit{
message?:Message[];
paginzations?:Pagination;
Container='Unread';
PageNumber=1;
pageSize=5;
loading=false;

constructor(private messageService:MessageService) {
}
  ngOnInit(): void {
   this.loadMessage();
  }

loadMessage(){
  this.loading=true;
  this.messageService.getMessage(this.PageNumber,this.pageSize,this.Container).subscribe({
    next:response =>{
      this.message=response.result;
      this.paginzations=response.paginzations;
      this.loading=false;
    }
  })
}

pageChanged(event:any){
if(this.PageNumber!==event.page){
  this.PageNumber=event.page;
  this.loadMessage();
}
}

deleteMessage(id:number){
  debugger
this.messageService.deleteMessage(id).subscribe({
  next:() => this.message?.splice(this.message.findIndex(m=>m.id==id),1)
})
}
}
