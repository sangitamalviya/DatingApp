import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MembersService } from '../_services/members.service';

export const memberDetailedResolver: ResolveFn<boolean> = (route, state) => {
  return inject(MembersService).getMember(route.paramMap.get('username')!);
};
