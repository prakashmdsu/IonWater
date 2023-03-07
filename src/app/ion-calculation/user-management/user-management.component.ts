import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../services/user-management.service';
import { UserManagement } from '../services/user-manangement';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: UserManagement[] = [];
  constructor(private readonly userManager: UserManagementService<UserManagement>) { }

  ngOnInit(): void {
    this.userManager.GetUserManager("users").subscribe(res => {
      this.users = res;
    });
  }

}
