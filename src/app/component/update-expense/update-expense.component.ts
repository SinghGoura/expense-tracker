import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../service/expence/expense.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-expense',
  standalone: true,
  imports: [
    NzFormModule,
    NzCardModule,
    NzSelectModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzInputModule
  ],
  templateUrl: './update-expense.component.html',
  styleUrls: ['./update-expense.component.css']  // Correct the property to 'styleUrls'
})

export class UpdateExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  categories = [
    'Food',
    'Travel',
    'Shopping',
    'Utilities',
    'Rent',
    'Entertainment',
    'Healthcare',
    'Education',
    'Transportation',
    'Personal Care',
    'Insurance',
    'Miscellaneous'
  ];
    expense: any;
  id!: number;

  constructor( 
    private http: HttpClient, 
    private router: Router,
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private message: NzMessageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Retrieve the 'id' from the route parameters
    this.id = this.activatedRoute.snapshot.params['id'];

    // Initialize the expense form with form controls and validators
    this.expenseForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required]
    });

    // Ensure the 'id' is valid before fetching the expense data
    if (this.id) {
      console.log("high");
      
      this.getExpenseById();
    } else {
      // Handle the case where 'id' is missing or invalid
      this.message.error('Expense ID is missing or invalid.');
    }
  }

  getExpenseById(): void {
    if (!this.id) {
      this.message.error('Expense ID is missing or invalid.');
      return; // Exit early if 'id' is not set
    }

    this.expenseService.getExpenseById(this.id).subscribe({
      next: (res) => {
        if (res) {
          console.log(res,"hgj");
          
          this.expenseForm.patchValue(res); // Patch the form with the fetched data
        } else {
          this.message.warning('No expense data found for the given ID.');
        }
      },
      error: (error) => {
        const errorMessage = error?.message || 'An unknown error occurred';
        const errorStatus = error?.status ? ` (Status: ${error.status})` : '';

        // Display the error message with the specific error details
        this.message.error(`Something went wrong: ${errorMessage}${errorStatus}`, { nzDuration: 5000 });
      }
    });
  }

  // Submit form and handle update logic
  updateExpense(): void {
    if (this.expenseForm.valid) {
      const expenseData = { id: this.id, ...this.expenseForm.value }; // Include id in the data
      this.expenseService.updateExpense(this.id, expenseData).subscribe({
        next: (response) => {
          console.log('Expense updated successfully:', response);
          this.message.success('Expense updated successfully', { nzDuration: 5000 });
          this.router.navigate(['/expenses']); // Redirect to the expense list after updating
        },
        error: (error) => {
          const errorMessage = error?.message || 'An unknown error occurred';
          const errorStatus = error?.status ? ` (Status: ${error.status})` : '';
          this.message.error(`Error updating expense: ${errorMessage}${errorStatus}`, { nzDuration: 5000 });
        }
      });
    } else {
      this.message.error('Please fill in all required fields', { nzDuration: 5000 });
    }
  }

  submitForm(){
    this.expenseService.updateExpense(this.id,this.expenseForm.value).subscribe(res=>{
      this.message.success("Expense updated successfully",{nzDuration:5000});
      this.router.navigate(['/expense']);
    },
    error=>{
      this.message.error("Error while updating expense",{nzDuration:5000});
      console.log(error);
    })
  }
}
