// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { UserService } from 'path-to-user-service';

// @Component({
//   selector: 'app-edit-user',
//   templateUrl: './edit-user.component.html',
//   styleUrls: ['./edit-user.component.css'],
// })
// export class EditUserComponent implements OnInit {
//   editForm: FormGroup;

//   constructor(
//     private formBuilder: FormBuilder,
//     private userService: UserService
//   ) {}

//   ngOnInit(): void {
//     this.editForm = this.formBuilder.group({
//       fullName: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', Validators.required],
//       mobile: ['', Validators.required],
//     });
//   }

//   onSubmit(): void {
//     if (this.editForm.invalid) {
//       return;
//     }

//     this.userService.updateUserData(this.editForm.value);

//     this.editForm.reset();
//   }
// }
