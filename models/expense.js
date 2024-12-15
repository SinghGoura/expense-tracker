const mongoose = require('mongoose');

// Define the schema for expenses
const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true, // Amount is mandatory
    },
    date: {
        type: Date,
        required: true, // Date is mandatory
        default: Date.now, // Default to current date if not provided
    },
    description: {
        type: String, // Optional description for the expense
        default: ''
    },
    category: {
        type: String, // Category of the expense (e.g., Food, Travel)
        default: 'General'
    }
});

// Create and export the Expense model
module.exports = mongoose.model('Expense', expenseSchema);
