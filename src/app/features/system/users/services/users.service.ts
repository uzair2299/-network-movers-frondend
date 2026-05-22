import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  getUsers(): Observable<User[]> {
    return of([
      { id: 'U-1001', username: 'admin', email: 'admin@networkmovers.com', roles: ['admin'] },
      { id: 'U-1002', username: 'ops', email: 'ops@networkmovers.com', roles: ['operations'] }
    ]);
  }
}
