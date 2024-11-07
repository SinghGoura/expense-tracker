// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection strings
const DB1 = "mongodb+srv://gauravsinghbhu211:E2FgqwHmHAATKtu3@cluster0.z92i4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/expense";
const DB2 = 'mongodb://localhost:27017/expense';

mongoose.connect(DB1)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);

// Login Route
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  


// Protected route example (only accessible with a valid token)
app.get('/api/protected', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ message: 'Protected data', userId: decoded.userId });
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
});


// Expense Schema and Model
const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }
});

const Expense = mongoose.model('Expense', expenseSchema);

// Expense Routes
app.get('/api/expense/all', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).send('Error fetching expenses');
    }
});

app.get('/api/expense/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findById(id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        res.json(expense);
    } catch (error) {
        console.error('Error fetching expense:', error);
        res.status(500).json({ message: 'Error fetching expense', error: error.message });
    }
});

app.post('/api/expense', async (req, res) => {
    const newExpense = new Expense(req.body);

    try {
        await newExpense.save();
        res.status(201).json({ message: 'Expense created', expense: newExpense });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Error creating expense', error: error.message });
    }
});

app.put('/api/expense/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const updatedExpense = await Expense.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });

        res.json({ message: 'Expense updated successfully', expense: updatedExpense });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Error updating expense', error: error.message });
    }
});

app.delete('/api/expense/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        const expense = await Expense.findById(id);
        if (!expense) return res.status(404).json({ error: 'Expense not found' });

        await Expense.findByIdAndDelete(id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        return res.status(500).json({ error: 'Error deleting expense' });
    }
});

// Import routes for income
const incomeRoutes = require('./routes/income');
app.use('/api/income', incomeRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
