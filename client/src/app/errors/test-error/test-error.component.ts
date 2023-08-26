import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { subscribeOn } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css']
})
export class TestErrorComponent {
baseurl=environment.apiUrl;
validationsError:string[]=[];
constructor(private http:HttpClient){

}

ngOnInit(){

}

get404Error(){
this.http.get(this.baseurl + 'buggy/not-found').subscribe({
  next:response => console.log(response),
  error : error=> console.error()
  })
}

get400Error(){
  this.http.get(this.baseurl + 'buggy/bad-request').subscribe({
    next:response => console.log(response),
    error : error=> console.error()
    })
  }

  get500Error(){
    this.http.get(this.baseurl + 'buggy/server-error').subscribe({
      next:response => console.log(response),
      error : error=> console.error()
      })
    }

    get401Error(){
      this.http.get(this.baseurl + 'buggy/auth').subscribe({
        next:response => console.log(response),
        error : error=> console.error()
        })
      }

      get400ValidationError(){
        this.http.post(this.baseurl + 'account/register',{}).subscribe({
          next:response => console.log(response),
          error : error=> {
           console.error();
           this.validationsError=error;
          }
          })
        }
  }
      