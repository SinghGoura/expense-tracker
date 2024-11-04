// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB using environment variable or default connection string
mongoose.connect('mongodb://localhost:27017/expense')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Define your Expense schema and model
const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }
});

const Expense = mongoose.model('Expense', expenseSchema);

// RESTful API Endpoints

// Get all expenses
app.get('/api/expense/all', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses); // Respond with the expenses data
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).send('Error fetching expenses');
    }
});

// Get expenses by id
app.get('/api/expense/:id', async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters

    try {
        const expense = await Expense.findById(id); // Find the expense by ID

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' }); // Handle not found case
        }

        res.json(expense); // Respond with the expense data
    } catch (error) {
        console.error('Error fetching expense:', error);
        res.status(500).json({ message: 'Error fetching expense', error: error.message }); // Send error message
    }
});


// Post new expense
app.post('/api/expense', async (req, res) => {
    // Log the request body for debugging
    console.log(req.body); 

    // Create a new instance of the Expense model with the request body
    const newExpense = new Expense(req.body);
    
    try {
        // Save the new expense to the database
        await newExpense.save();
        console.log(newExpense, "Expense created successfully");
        
        // Send a 201 Created response with the created expense object
        res.status(201).json({ message: 'Expense created', expense: newExpense });
    } catch (error) {
        console.error('Error creating expense:', error);
        
        // Send a 500 Internal Server Error response with a more descriptive message
        res.status(500).json({ message: 'Error creating expense', error: error.message });
    }
});

// Update
app.put('/api/expense/:id', async (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameters
    const updatedData = req.body; // Get the data to update from the request body
    console.log(`Received request to update expense with ID: ${req.params.id}`);
    
    try {
        // Find the expense by ID and update it with the new data from the request body
        const updatedExpense = await Expense.findByIdAndUpdate(id, updatedData, {
            new: true,           // Return the updated document
            runValidators: true, // Validate the data before updating
        });

        // If the expense is not found, respond with a 404 status
        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Respond with a success message and the updated expense data
        res.json({
            message: 'Expense updated successfully',
            expense: updatedExpense,
        });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({
            message: 'Error updating expense',
            error: error.message, // Include the error message in the response
        });
    }
});



// Delete an expense by ID
// Delete an expense by ID
// Delete an expense by ID
app.delete('/api/expense/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    // Log the ID being deleted for debugging
    console.log(`Attempting to delete expense with ID: ${id}`);

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        // Check if the expense exists in the database
        const expense = await Expense.findById(id);
        if (!expense) {
            console.log('Expense not found in the database');
            return res.status(404).json({ error: 'Expense not found' });
        }

        // Delete the expense
        const result = await Expense.findByIdAndDelete(id);

        // If deletion is successful, send a success response
        res.status(200).json({ message: 'Expense deleted successfully' });
    } 
    catch (error) {
        console.error('Error deleting expense:', error);
        return res.status(500).json({ error: 'Error deleting expense' });
    }
});

// Import routes for income
const incomeRoutes = require('./routes/income');
app.use('/api/income', incomeRoutes);  // Add this line to prefix routes with '/api/income'



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
