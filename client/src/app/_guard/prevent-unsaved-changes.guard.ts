import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, CanDeactivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';

import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { ConfirmService } from '../_services/confirm.service';


export const PreventUnsavedChangesGuard : CanDeactivateFn<MemberEditComponent> = (component) => {
 
     const confirmService=inject(ConfirmService);
     
      if(component.editForm?.dirty){
        return confirmService.confirm();
      }
   return true;
  }

