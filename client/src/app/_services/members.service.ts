import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_models/paginzation';
import { UserParams } from '../_models/userparams';
import { AccountService } from './account.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseUrl=environment.apiUrl;
members:Member[]=[];
memberCache=new Map();
user:User | undefined;
userparams:UserParams | undefined;

  constructor(private http:HttpClient,private accountService:AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next:user=>{
        if(user)
        {
        this.userparams=new UserParams(user);
        this.user=user;
        }
      }
    });
  }

getUserParams(){
  return this.userparams;
}

setUserParams(params:UserParams){
  this.userparams=params;
}

resetUserParams(){
  if(this.user){
    this.userparams=new UserParams(this.user);
    return this.userparams;
  }
  return;
}

  getMembers(userparams:UserParams){
   const response= this.memberCache.get(Object.values(userparams).join('-'));
   if(response) return of(response);
    let params = this.getPaginzationHeader(userparams.pageNumber,userparams.pageSize);
   // if(this.members.length>0)return of(this.members);
   params=params.append('minAge',userparams.minAge);
   params=params.append('maxAge',userparams.maxAge);
   params=params.append('gender',userparams.gender);
   params=params.append('orderBy',userparams.orderBy);
    return this.getPaginzatedResult<Member[]>(this.baseUrl + 'user',params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userparams).join('-'),response);
        return response;
  })
    )
  }

 

  getMember(username:string){
    const member=[...this.memberCache.values()]
    .reduce((arr,elem) =>arr.concat(elem.result),[])
    .find((member:Member) => member.userName===username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'user/'+username)
  }

updateMember(member:Member){
  return this.http.put(this.baseUrl + 'user',member).pipe(
    map(() => {
       const index = this.members.indexOf(member);
       this.members[index] = {...this.members[index],...member}
    })
  )
}

SetMainPhoto(photoId:number){
  return this.http.put(this.baseUrl + 'user/set-main-photo/' +photoId,{})
}

deletePhoto(photoId:number){
return this.http.delete(this.baseUrl + 'user/delete-photo/' + photoId)
}

addLike(username:string){
  return this.http.post(this.baseUrl + 'likes/' + username,{});
}

getLikes(predicate:string,pageNumber:number,pageSize:number){
  let params=this.getPaginzationHeader(pageNumber,pageSize);
  params=params.append('predicate',predicate);
  return this.getPaginzatedResult<Member[]>(this.baseUrl + 'likes' , params);
}

private getPaginzatedResult<T>(url:string,params: HttpParams) {
  const paginatedReslt:PaginatedResult<T>=new PaginatedResult<T>;
  return this.http.get<T>(url, { observe: 'response', params }).pipe(

    map(response => {
      if (response.body) {
      paginatedReslt.result = response.body;
      }
      const paginatoins = response.headers.get('Pagination');
      if (paginatoins) {
      paginatedReslt.paginzations = JSON.parse(paginatoins);
      }
      return paginatedReslt;
    })
  );
}

private getPaginzationHeader(pageNumber:number,pageSize:number) {
  let params = new HttpParams();

   params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

  return params;
}

}
