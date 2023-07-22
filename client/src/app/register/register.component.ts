import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Input() usersFromHomeComponent:any;
  @Output() canRegister = new EventEmitter();
  registerForm:FormGroup = new FormGroup({});
maxDate:Date=new Date();
validationsErrors:string[] | undefined;

constructor(private accountService:AccountService,private toastr:ToastrService,private fb:FormBuilder,
  private router:Router){}



initalizeForm(){
  this.registerForm=this.fb.group({
    gender:['male'],
      username:['',Validators.required],
      knownAs:['',Validators.required],
      dateofBirth:['',Validators.required],
      city:['',Validators.required],
    country:['',Validators.required],
    password:['',[Validators.required,
      Validators.minLength(4),Validators.maxLength(8)]],
    confirmPassword:['',[Validators.required,this.matchValue('password')]],
  });

  this.registerForm.controls['password'].valueChanges.subscribe({
    next:() => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
  })
}

matchValue(matchTo:string):ValidatorFn{
  return (control:AbstractControl) =>{
    return control.value===control.parent?.get(matchTo)?.value ? null: {notMatching : true}
  }
}

ngOnInit():void{
  this.initalizeForm();
  this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
}
register(){
  debugger
  const dob=this.getDateOnly(this.registerForm.controls['dateofBirth'].value);
   const values = {...this.registerForm.value,dateofBirth:dob};
  console.log(values);


  this.accountService.register(values).subscribe({
   next:()=>{
     this.router.navigateByUrl('/member')
   },
   error:error=>{
     this.validationsErrors=error;
   }
  
  })
}

cancel(){
  this.canRegister.emit(false);
}

private getDateOnly(dob:string | undefined){
  if(!dob) return;
  let theDob=new Date(dob);
  return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset())).toISOString().slice(0,10);
}
}
