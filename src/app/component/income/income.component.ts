import { IncomeService } from './../../service/expence/income/income.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [
    NzCardModule, 
    ReactiveFormsModule, 
    NzFormModule,
    NzDatePickerModule, 
    NzSelectModule, 
    NzInputModule, 
    NzIconModule,
    CommonModule,
  ],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent {

  incomes: any;
  incomeForm!: FormGroup;
  categories: string[] = ["Salary", "Freelancing", "Investments", "Stocks", "Bitcoin", "Bank Transfer", "Youtube", "Other"];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private incomeService: IncomeService
  ) {}

  ngOnInit() {
    console.log(this.categories); // Check if this logs the category array
    this.incomeForm = this.fb.group({
      title: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required],
      source: [null, Validators.required] // Add the source field
    });
    this.getAllIncomes(); // Corrected method name
  }
  
  async submitForm(): Promise<void> {
    if (this.incomeForm.valid) {
      try {
        const formData = this.incomeForm.value;
        console.log(formData,"fht"); // Log the form data
  
        // Await the service call and handle it properly
       const response= await this.incomeService.postIncome(formData).toPromise();
      console.log(response,"hgjk")
        // Reset the form
        this.incomeForm.reset();
  
        // Refresh the expense list
        this.getAllIncomes();
  
        // Show success message
        this.message.success('Income posted successfully', { nzDuration: 5000 });
      } catch (error) {
        console.error('Failed to post income', error);  // Log the error
        this.message.error('Error posting income: ', { nzDuration: 5000 })  // Show error message with details
      }
    } else {
      this.message.error('Please fill in all required fields', { nzDuration: 5000 });
    }
  }
  
  

  updateIncome(id: number){
    this.router.navigateByUrl(`/income/${id}/edit`);
  }

  getAllIncomes() {
    this.incomeService.getAllIncomes().subscribe(
      res => {
        this.incomes = res;
      },
      error => {
        console.error('Error details:', error); // Log the full error to console
        this.message.error("Error while getting incomes: " + error.message, { nzDuration: 5000 });
      }
    );
  }

  deleteIncome(id: number) {
    const url = `http://localhost:3000/api/income/${id}`;  // Corrected the URL to point to the income endpoint
    console.log('Delete URL:', url);
  
    // Use responseType: 'text' to handle plain text responses
    this.http.delete(url, { responseType: 'text' }).subscribe(
      (res: string) => {
        console.log(res, "Delete Response");
  
        if (res === 'Income deleted successfully') {  // Adjust based on the actual response from your backend
          this.message.success("Income deleted successfully", { nzDuration: 5000 });
          this.getAllIncomes(); // Refresh the income list
        } else {
          this.message.error('Unexpected response despite 200 status', { nzDuration: 5000 });
        }
      },
      error => {
        console.error('Error response:', error);
        this.message.error('Error deleting income', { nzDuration: 5000 });
      }
    );
  }
  
}