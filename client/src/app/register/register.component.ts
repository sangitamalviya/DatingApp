import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Input() usersFromHomeComponent:any;
  @Output() canRegister = new EventEmitter();
model:any={}
constructor(private accountService:AccountService,private toastr:ToastrService){}

ngOnInit():void{
  console.log(this.model);
}
register(){
 this.accountService.register(this.model).subscribe({
  next:()=>{
    this.cancel();
  },
  error:error=>{
    this.toastr.error(error.error)
    console.log(error);
  }
  
 })
}

cancel(){
  this.canRegister.emit(false);
}

}
