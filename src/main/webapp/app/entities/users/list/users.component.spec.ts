import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UsersService } from '../service/users.service';

import { UsersComponent } from './users.component';

describe('Users Management Component', () => {
  let comp: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UsersComponent],
    })
      .overrideTemplate(UsersComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UsersService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.users?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
