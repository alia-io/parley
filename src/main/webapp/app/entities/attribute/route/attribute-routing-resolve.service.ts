import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAttribute, Attribute } from '../attribute.model';
import { AttributeService } from '../service/attribute.service';

@Injectable({ providedIn: 'root' })
export class AttributeRoutingResolveService implements Resolve<IAttribute> {
  constructor(protected service: AttributeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAttribute> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((attribute: HttpResponse<Attribute>) => {
          if (attribute.body) {
            return of(attribute.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Attribute());
  }
}
