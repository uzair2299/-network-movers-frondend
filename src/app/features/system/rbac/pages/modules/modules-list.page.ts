import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Module } from '../../models/rbac.models';
import { RbacService } from '../../services/rbac.service';
import { ModuleDialogComponent } from '../../dialogs/module-dialog/module-dialog.component';
import { ModuleDetailDialogComponent } from '../../dialogs/module-detail-dialog/module-detail-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-modules-list',
  templateUrl: './modules-list.page.html',
  styleUrls: ['./modules-list.page.css']
})
export class ModulesListPage implements OnInit, OnDestroy {
  modules: Module[] = [];
  isLoading = false;
  error: string | null = null;
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  sortColumn: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  
  get sort(): string {
    return `${this.sortColumn},${this.sortDirection}`;
  }
  
  moreActions = [
    { id: 'export', label: 'Export Modules' },
    { id: 'import', label: 'Import Modules' }
  ];

  moduleActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Module' },
    { id: 'delete', label: 'Delete Module' }
  ];

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text', sortable: true, bold: true },
    { key: 'code', label: 'Code', type: 'text', sortable: true },
    { key: 'description', label: 'Description', type: 'text', sortable: true },
    { key: 'active', label: 'Status', type: 'status', sortable: true },
    { 
      key: 'actions', 
      label: '', 
      type: 'actions', 
      actionsDropdown: true,
      dropdownItems: this.moduleActions
    }
  ];

  constructor(
    private rbacService: RbacService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.currentPage = 0;
      this.loadModules();
    });

    this.loadModules();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadModules(): void {
    this.isLoading = true;
    this.error = null;
    this.rbacService.getModules(this.currentPage, this.pageSize, this.sort, this.searchQuery)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.modules = response.content;
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching modules', err);
          this.error = 'Failed to load modules. Please try again later.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadModules();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadModules();
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  createNewModule(): void {
    const dialogRef = this.dialog.open(ModuleDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { isEdit: false },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: Module | null) => {
      if (result) {
        this.isLoading = true;
        this.rbacService.createModule(result).subscribe({
          next: () => {
            this.toastService.showSuccess('Module created successfully.', 'Success');
            this.loadModules();
          },
          error: (err) => {
            console.error('Error creating module', err);
            this.toastService.showError('Failed to create module.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleModuleAction(actionId: string, module: Module): void {
    if (actionId === 'edit') {
      this.editModule(module);
    } else if (actionId === 'view') {
      this.viewModule(module);
    } else if (actionId === 'delete') {
      this.deleteModule(module);
    } else {
      console.log('Module action clicked:', actionId, 'for module:', module.name);
    }
  }

  handleTableAction(event: { action: string, item: Module }): void {
    this.handleModuleAction(event.action, event.item);
  }

  deleteModule(module: Module): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Delete Module',
        message: `Are you sure you want to delete the module "${module.name}"? This action will deactivate it.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.rbacService.deleteModule(module.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Module deleted successfully.', 'Success');
            this.loadModules();
          },
          error: (err) => {
            console.error('Error deleting module', err);
            this.toastService.showError('Failed to delete module. ' + (err.error?.message || ''), 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  viewModule(module: Module): void {
    this.isLoading = true;
    this.rbacService.getModuleById(module.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (fullModule) => {
        this.dialog.open(ModuleDetailDialogComponent, {
          width: '600px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: { module: fullModule },
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });
      },
      error: (err) => {
        console.error('Error fetching module details', err);
        this.toastService.showError('Failed to load module details.', 'Error');
      }
    });
  }

  editModule(module: Module): void {
    const dialogRef = this.dialog.open(ModuleDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { module, isEdit: true },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: Module | null) => {
      if (result) {
        this.isLoading = true;
        this.rbacService.updateModule(module.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Module updated successfully.', 'Success');
            this.loadModules();
          },
          error: (err) => {
            console.error('Error updating module', err);
            this.toastService.showError('Failed to update module.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.loadModules();
  }
}
