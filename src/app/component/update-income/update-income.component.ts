import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { IncomeService } from '../../service/expence/income/income.service';

@Component({
  selector: 'app-update-income',
  standalone: true,
  imports: [NzCardModule, 
    ReactiveFormsModule, 
    NzFormModule,
    NzDatePickerModule, 
    NzSelectModule, 
    NzInputModule, 
    NzIconModule,
    CommonModule,],
  templateUrl: './update-income.component.html',
  styleUrl: './update-income.component.css'
})
export class UpdateIncomeComponent {


  expense: any;
  id!: number;
  incomeForm!: FormGroup;
  categories: string[] = ["Salary", "Freelancing", "Investments", "Stocks", "Bitcoin", "Bank Transfer", "Youtube", "Other"];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private incomeService: IncomeService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];

    console.log(this.categories); // Check if this logs the category array
    this.incomeForm = this.fb.group({
      title: [null, Validators.required],
      amount: [null, Validators.required],
      date: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required]
    });
this.getIncomeById();
    
  }

  getIncomeById(): void {
    if (!this.id) {
      this.message.error('Expense ID is missing or invalid.');
      return; // Exit early if 'id' is not set
    }

    this.incomeService.getIncomeById(this.id).subscribe({
      next: (res) => {
        if (res) {
          console.log(res,"hgj");
          
          this.incomeForm.patchValue(res); // Patch the form with the fetched data
        } else {
          this.message.warning('No income data found for the given ID.');
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

  submitForm(){
    this.incomeService.updateIncome(this.id,this.incomeForm.value).subscribe(res=>{
      this.message.success("Income updated successfully",{nzDuration:5000});
      this.router.navigate(['/income']);
    },
    error=>{
      this.message.error("Error while updating income",{nzDuration:5000});
      console.log(error);
    })
  }
}
