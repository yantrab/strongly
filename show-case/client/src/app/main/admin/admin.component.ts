import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../api/services/admin.service';
import { User } from '../../api/models/user';
import { FormComponent } from '../../components/form/form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  userFormModel = this.api.saveOrUpdateUserFormModel({
    displayProperties: ['firstName', 'lastName', 'email', 'phone', 'role'],
    formTitle: 'Add New User'
  });

  constructor(private api: AdminService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    api.users().subscribe(users => (this.users = users));
  }

  ngOnInit(): void {}
  openEditUserDialog(user?: User): void {
    if (user) this.userFormModel.formGroup.setValue(user);
    const dialogRef = this.dialog.open(FormComponent, {
      width: '80%',
      maxWidth: '540px',
      data: this.userFormModel
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const relevant = this.users.find(u => u._id === result._id);
        this.api.saveOrUpdateUser(result).subscribe(savedUser => {
          if (!relevant) this.users = this.users.concat([savedUser]);
          else {
            Object.keys(result).forEach(key => ((relevant as any)[key] = result[key]));
          }
          this.snackBar.open('User was saved successfully', 'Cancel', {
            duration: 2000
          });
        });
      }
    });
  }
}
