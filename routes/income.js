// income.js

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); // Use express Router for routing

// Define the Income schema and model
const incomeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }// Description of the income
});

const Income = mongoose.model('Income', incomeSchema);

// RESTful API Endpoints

// Get all income
router.get('/all', async (req, res) => {
    try {
        const incomes = await Income.find();
        
        // Check if incomes are found
        if (!incomes || incomes.length === 0) {
            return res.status(404).json({ message: 'No incomes found' });
        }

        console.log(incomes, "success"); // Optionally log for debugging
        
        res.status(200).json(incomes); // Send back income data with status 200 (OK)
    } catch (error) {
        console.error('Error fetching income:', error);

        // Send error response with appropriate status code and message
        res.status(500).json({ message: 'Error fetching income', error: error.message });
    }
});

// Get income by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const income = await Income.findById(id);

        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }

        res.json(income);
    } catch (error) {
        console.error('Error fetching income:', error);
        res.status(500).json({ message: 'Error fetching income', error: error.message });
    }
});

// Create new income
router.post('/', async (req, res) => {
    console.log('Received request to create income:', req.body); // Log request body for debugging
    try {
        const newIncome = new Income(req.body);
        await newIncome.save();
        console.log('Income created successfully:', newIncome);
        res.status(201).json({ message: 'Income created', income: newIncome });
    } catch (error) {
        console.error('Error creating income:', error); // Log the error
        res.status(500).json({ message: 'Error creating income', error: error.message });
    }
});

// Update income
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedIncome = await Income.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true
        });

        if (!updatedIncome) {
            return res.status(404).json({ message: 'Income not found' });
        }

        res.json({
            message: 'Income updated successfully',
            income: updatedIncome,
        });
    } catch (error) {
        console.error('Error updating income:', error);
        res.status(500).json({
            message: 'Error updating income',
            error: error.message,
        });
    }
});

// Delete income
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const result = await Income.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'Income not found' });
        }

        res.status(200).json({ message: 'Income deleted successfully' });
    } catch (error) {
        console.error('Error deleting income:', error);
        res.status(500).json({ error: 'Error deleting income' });
    }
});

module.exports = router;
