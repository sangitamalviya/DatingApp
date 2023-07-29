import { getLocaleDateTimeFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginatedResult, Pagination } from 'src/app/_models/paginzation';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userparams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit{
members$:Observable<Member[]> | undefined;
paginzations:Pagination | undefined;
userparams:UserParams | undefined;
members:Member[] | undefined;
genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}]
/**
 *
 */
constructor(private memberService:MembersService) {
  this.userparams=this.memberService.getUserParams();
  }

  ngOnInit(){
   // this.members$=this.memberService.getMembers();
    this.loadMembers();
  }

  loadMembers(){
    if(this.userparams){
      this.memberService.setUserParams(this.userparams);
      this.memberService.getMembers(this.userparams).subscribe({
        next:response =>{
          if(response.result && response.paginzations){
            this.members=response.result;
            this.paginzations=response.paginzations;
            console.log('itemsPerPage' + this.paginzations?.itemPerPage);
          }
        }
      })
    }
  }

  resetFilters(){
    this.userparams=this.memberService.resetUserParams();
      this.loadMembers();
  }
  // loadMembers(){
  //   this.memberService.getMembers().subscribe({
  //     next:members=>this.members=members
  //   })
  // }

  pageChanged(event:any){
    if(this.userparams && this.userparams?.pageNumber!==event.page)
    {
      this.userparams.pageNumber=event.page;
      this.memberService.setUserParams(this.userparams);
      this.loadMembers();
    }

  }
}
