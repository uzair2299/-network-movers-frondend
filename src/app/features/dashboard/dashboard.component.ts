import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuickMoveBookDialogComponent } from './dialogs/quick-move-book-dialog/quick-move-book-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private dialog: MatDialog) {}

  openQuickBook() {
    this.dialog.open(QuickMoveBookDialogComponent, {
      width: '1000px',
      maxWidth: '95vw',
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop',
      disableClose: true
    });
  }
}
