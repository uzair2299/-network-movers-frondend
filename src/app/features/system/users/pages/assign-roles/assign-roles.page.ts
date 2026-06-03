import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { RolesService } from '../../../roles/services/roles.service';
import { UsersService } from '../../services/users.service';
import { Role } from '../../../roles/models/role.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-assign-roles',
  templateUrl: './assign-roles.page.html',
  styleUrls: ['./assign-roles.page.css']
})
export class AssignRolesPage implements OnInit {
  user: User | null = null;
  availableRoles: Role[] = [];
  filteredRoles: Role[] = [];
  selectedRoleCodes: Set<string> = new Set<string>();
  
  isLoading: boolean = true;
  isSaving: boolean = false;
  searchQuery: string = '';
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rolesService: RolesService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idStr = params.get('id');
        if (idStr) {
          const id = parseInt(idStr, 10);
          return this.usersService.getUserById(id);
        }
        return of(null);
      })
    ).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          if (user.roles) {
            user.roles.forEach(roleCode => this.selectedRoleCodes.add(roleCode));
          }
          this.loadRoles();
        } else {
          this.error = "User not found.";
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.error = "Failed to load user details.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRoles(): void {
    // Fetch all roles (assuming size 1000 is enough to get all without pagination for this UI)
    this.rolesService.getRoles(0, 1000).subscribe({
      next: (response) => {
        this.availableRoles = response.content || [];
        this.filteredRoles = [...this.availableRoles];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load roles', err);
        this.error = "Failed to load available roles.";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query.toLowerCase();
    this.filterRoles();
  }

  filterRoles(): void {
    if (!this.searchQuery) {
      this.filteredRoles = [...this.availableRoles];
    } else {
      this.filteredRoles = this.availableRoles.filter(role => 
        role.name.toLowerCase().includes(this.searchQuery) ||
        role.code.toLowerCase().includes(this.searchQuery) ||
        (role.description && role.description.toLowerCase().includes(this.searchQuery))
      );
    }
  }

  isRoleSelected(roleCode: string): boolean {
    return this.selectedRoleCodes.has(roleCode);
  }

  toggleRole(roleCode: string, checked: boolean): void {
    if (checked) {
      this.selectedRoleCodes.add(roleCode);
    } else {
      this.selectedRoleCodes.delete(roleCode);
    }
  }

  areAllSelected(): boolean {
    if (this.filteredRoles.length === 0) return false;
    return this.filteredRoles.every(role => this.selectedRoleCodes.has(role.code));
  }

  toggleAll(checked: boolean): void {
    if (checked) {
      this.filteredRoles.forEach(role => this.selectedRoleCodes.add(role.code));
    } else {
      this.filteredRoles.forEach(role => this.selectedRoleCodes.delete(role.code));
    }
  }

  cancel(): void {
    this.router.navigate(['/system/users']);
  }

  save(): void {
    if (!this.user) return;
    
    this.isSaving = true;
    const rolesArray = Array.from(this.selectedRoleCodes);
    
    this.usersService.updateUserRoles(this.user.id, rolesArray).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/system/users']);
      },
      error: (err) => {
        console.error('Failed to save roles', err);
        this.error = "Failed to save roles. Please try again.";
        this.isSaving = false;
      }
    });
  }
}
