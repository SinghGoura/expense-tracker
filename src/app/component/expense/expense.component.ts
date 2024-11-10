import { ExpenseService } from './../../service/expence/expense.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

interface DeleteResponse {
  status: string; // Assuming the API returns a 'status' field
  message?: string; // Optional message field
}
@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [
    NzCardModule,
    NzFormModule,
    NzDatePickerModule,
    NzSelectModule,
    NzInputModule,
    ReactiveFormsModule,
    CommonModule,
    NzIconModule,
    
  ],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  
  expenses: any[] = []; // To store the fetched expenses
   categories = ['Food', 'Travel', 'Shopping', 'Utilities',"Bank Transfer","Business","Medical"];

  constructor(
    private http: HttpClient,  // For making HTTP requests
    private router: Router,
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.expenseForm = this.fb.group({
      title: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required]
    });
    this.getAllExpenses();
  }

  // Method to get the list of expenses from the API
  getAllExpenses(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: (data) => {
        this.expenses = data; // Bind the fetched expenses to the component
      },
      error: (err) => {
        console.error('Failed to load expenses', err);
        this.message.error('Failed to load expenses', { nzDuration: 500 });
      }
    });
  }

  // Submit form to post a new expense
  async submitForm(): Promise<void> {
    if (this.expenseForm.valid) {
      try {
        const formData = this.expenseForm.value;
        console.log(formData,"fht"); // Log the form data
  
        // Await the service call and handle it properly
       const response= await this.expenseService.postExpense(formData).toPromise();
      console.log(response,"hgjk")
        // Reset the form
        this.expenseForm.reset();
  
        // Refresh the expense list
        this.getAllExpenses();
  
        // Show success message
        this.message.success('Expense posted successfully', { nzDuration: 5000 });
      } catch (error) {
        console.error('Failed to post expense', error);  // Log the error
        this.message.error('Error posting expense: ', { nzDuration: 5000 })  // Show error message with details
      }
    } else {
      this.message.error('Please fill in all required fields', { nzDuration: 5000 });
    }
  }
  
updateExpense(id: number){
  this.router.navigateByUrl(`/expense/${id}/edit`);
}

  // Define the interface for the delete response


  // Method to delete an expense
//   deleteExpense(id: number) {
//     const url = `http://localhost:3000/api/expense/${id}`;
//     console.log('Delete URL:', url);
//     // Specify the DeleteResponse type in the HTTP delete call
//     this.http.delete<DeleteResponse>(`http://localhost:3000/api/expense/${id}`).subscribe(
//       (res: DeleteResponse) => {
//         console.log(res,"ghjxgfhjhkcxfghj");
        
//         if (res && res.status === 'success') {  // Adjust this depending on the response structure
//           this.message.success("Expense deleted successfully", { nzDuration: 5000 });
//           this.getAllExpenses(); // Refresh the expense list
//         } else {
//           this.message.error('Error in response despite 200 status', { nzDuration: 5000 });
//         }
//       },
//       error => {
//         console.error('Error response:', error);
//         this.message.error('Error deleting expense', { nzDuration: 5000 });
//       }
//     );
//   }
// }

deleteExpense(id: string) {  // Ensure the ID is a string (MongoDB ObjectId)
  const url = `http://localhost:3000/api/expense/${id}`;
  console.log('Delete URL:', url);

  // Expecting a JSON response, so set responseType to 'json'
  this.http.delete(url, { responseType: 'json' }).subscribe(
    (res: any) => { // The response will be a JSON object
      console.log(res, "Delete Response");

      if (res.message === 'Expense deleted successfully') {  // Adjust based on the actual response structure
        this.message.success("Expense deleted successfully", { nzDuration: 5000 });
        this.getAllExpenses(); // Refresh the expense list
      } else {
        this.message.error('Unexpected response despite 200 status', { nzDuration: 5000 });
      }
    },
    error => {
      console.error('Error response:', error); // Log the full error for debugging

      // Handle different error status codes more explicitly
      if (error.status === 404) {
        this.message.error('Expense not found', { nzDuration: 5000 });
      } else if (error.status === 500) {
        this.message.error('Server error while deleting expense', { nzDuration: 5000 });
      } else {
        this.message.error('Error deleting expense', { nzDuration: 5000 });
      }
    }
  );
}


}