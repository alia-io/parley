import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUsers, Users } from '../users.model';
import { UsersService } from '../service/users.service';

@Injectable({ providedIn: 'root' })
export class UsersRoutingResolveService implements Resolve<IUsers> {
  constructor(protected service: UsersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUsers> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((users: HttpResponse<Users>) => {
          if (users.body) {
            return of(users.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Users());
  }
}
