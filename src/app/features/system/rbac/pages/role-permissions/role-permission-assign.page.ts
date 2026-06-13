import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RbacService } from '../../services/rbac.service';
import { Role, Permission, RolePermission } from '../../models/rbac.models';
import { ToastService } from '../../../../../shared/services/toast.service';
import { SelectOption } from '../../../../../shared/components/form-select/form-select.component';

interface PermissionWrapper {
  permission: Permission;
  control: FormControl;
  assignedId?: string; // Mapping ID if originally assigned, so we can delete/revoke
}

interface GroupedPermission {
  resourceId: string;
  resourceName: string;
  permissions: PermissionWrapper[];
}

@Component({
  selector: 'app-role-permission-assign',
  templateUrl: './role-permission-assign.page.html',
  styleUrls: ['./role-permission-assign.page.css']
})
export class RolePermissionAssignPage implements OnInit {
  roles: Role[] = [];
  permissions: Permission[] = [];
  selectedRoleId: string = '';
  roleControl = new FormControl('');
  roleOptions: SelectOption[] = [];

  groupedPermissions: GroupedPermission[] = [];
  isLoading = false;
  isSaving = false;

  constructor(
    private rbacService: RbacService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.roleControl.valueChanges.subscribe(val => {
      this.selectedRoleId = val || '';
      this.onRoleChange();
    });
  }

  loadInitialData(): void {
    this.isLoading = true;
    forkJoin({
      rolesRes: this.rbacService.getRoles(0, 100),
      permsRes: this.rbacService.getPermissions(0, 1000)
    }).pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {
          this.roles = res.rolesRes?.content || [];
          this.roleOptions = this.roles.map(r => ({
            label: `${r.name} (${r.code})`,
            value: r.id
          }));
          this.permissions = res.permsRes?.content || [];
          
          // Check if roleId passed in query parameters
          this.route.queryParamMap.subscribe(params => {
            const roleId = params.get('roleId');
            if (roleId && this.roles.some(r => r.id === roleId)) {
              this.roleControl.setValue(roleId);
            }
          });
        },
        error: (err) => {
          console.error('Error loading initial data', err);
          this.toastService.showError('Failed to load initial roles and permissions.');
        }
      });
  }

  onRoleChange(): void {
    if (!this.selectedRoleId) {
      this.groupedPermissions = [];
      return;
    }

    this.isLoading = true;
    this.rbacService.getPermissionsForRole(this.selectedRoleId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (assigned) => {
          this.buildGroupedPermissions(assigned);
        },
        error: (err) => {
          console.error('Error loading permissions for role', err);
          this.toastService.showError('Failed to load permissions for the selected role.');
        }
      });
  }

  buildGroupedPermissions(assigned: RolePermission[]): void {
    const assignedMap = new Map<string, string>(); // permissionId -> rolePermissionId (mapping ID)
    assigned.forEach(rp => {
      assignedMap.set(rp.permissionId, rp.id);
    });

    const groupsMap = new Map<string, GroupedPermission>();

    this.permissions.forEach(perm => {
      // Create wrapper with a FormControl
      const wrapper: PermissionWrapper = {
        permission: perm,
        control: new FormControl(assignedMap.has(perm.id)),
        assignedId: assignedMap.get(perm.id)
      };

      const resId = perm.resourceId || 'unassigned';
      const resName = perm.resourceName || 'Global Permissions';

      if (!groupsMap.has(resId)) {
        groupsMap.set(resId, {
          resourceId: resId,
          resourceName: resName,
          permissions: []
        });
      }

      groupsMap.get(resId)!.permissions.push(wrapper);
    });

    // Sort permissions within groups and sort groups by name
    this.groupedPermissions = Array.from(groupsMap.values())
      .sort((a, b) => a.resourceName.localeCompare(b.resourceName));
    
    this.groupedPermissions.forEach(group => {
      group.permissions.sort((a, b) => a.permission.name.localeCompare(b.permission.name));
    });
  }

  toggleGroup(group: GroupedPermission, checked: boolean): void {
    group.permissions.forEach(p => p.control.setValue(checked));
  }

  isGroupAllChecked(group: GroupedPermission): boolean {
    return group.permissions.every(p => p.control.value);
  }

  saveAssignments(): void {
    if (!this.selectedRoleId) return;

    const originallyAssignedIds: string[] = [];
    const currentlyCheckedIds: string[] = [];

    this.groupedPermissions.forEach(group => {
      group.permissions.forEach(p => {
        if (p.assignedId) {
          originallyAssignedIds.push(p.permission.id);
        }
        if (p.control.value) {
          currentlyCheckedIds.push(p.permission.id);
        }
      });
    });

    const hasChanges = 
      originallyAssignedIds.length !== currentlyCheckedIds.length ||
      originallyAssignedIds.some(id => !currentlyCheckedIds.includes(id)) ||
      currentlyCheckedIds.some(id => !originallyAssignedIds.includes(id));

    if (!hasChanges) {
      this.toastService.showInfo('No changes detected.');
      this.router.navigate(['../'], { relativeTo: this.route });
      return;
    }

    this.isSaving = true;
    this.rbacService.assignRolePermissionsBulk(this.selectedRoleId, currentlyCheckedIds)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Role permissions saved successfully.');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('Error saving assignments', err);
          this.toastService.showError('Failed to save assignments.');
        }
      });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
