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


// Define a generic Transaction schema
const transactionSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['income', 'expense'] },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    category: { type: String }
});

const incomeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    source: { type: String, required: true },  // Ensure these match with your frontend form fields
  });
  

const Transaction = mongoose.model('Transaction', transactionSchema);
//sign-Up user Route
app.post('/api/auth/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new user
        const newUser = new User({ username, password });
        await newUser.save();

        // Send response with success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error.message); // Log the specific error message
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

  
// Login Route
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.error('User not found:', username);  // Log for debugging
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.error('Invalid credentials for user:', username);  // Log for debugging
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);  // Log the actual error
      res.status(500).json({ message: 'Server error', error: error.message });
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


// Expense Routes
app.get('/api/expense/all', async (req, res) => {
    try {
      const expenses = await Expense.find();
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: 'Error fetching expenses' });
    }
  });
  
  
  const { Income } = require('./routes/income.js');

  app.get('/income-transactions', async (req, res) => {
    try {
        const incomeTransactions = await Income.find();
        res.json(incomeTransactions);
    } catch (err) {
        console.error('Error fetching income transactions:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// API endpoint to get stats for the dashboard
app.get('/api/stats', async (req, res) => {
    try {
        // Fetch income and expense transactions
        const incomeTransactions = await Income.find();
        const expenseTransactions = await Expense.find();

        if (!Array.isArray(incomeTransactions) || !Array.isArray(expenseTransactions)) {
            throw new Error('Invalid data format received from database.');
        }

        // Log retrieved transactions
        console.log('Income Transactions:', incomeTransactions);
        console.log('Expense Transactions:', expenseTransactions);

        // Validate transactions
        if (!Array.isArray(incomeTransactions) || !Array.isArray(expenseTransactions)) {
            return res.status(500).json({ 
                error: 'Invalid data format',
                message: 'Income or expense transactions are not in the expected format.' 
            });
        }

        // Calculate totals
        const totalIncome = incomeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalExpense = expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const balance = totalIncome - totalExpense;

        // Prepare history data
        const incomeHistory = {
            dates: incomeTransactions.map(t => t.date || null),
            amounts: incomeTransactions.map(t => t.amount || 0)
        };

        const expenseHistory = {
            dates: expenseTransactions.map(t => t.date || null),
            amounts: expenseTransactions.map(t => t.amount || 0)
        };

        // Retrieve latest transactions or set to null if empty
        const latestIncome = incomeTransactions.length > 0 ? incomeTransactions[incomeTransactions.length - 1] : null;
        const latestExpense = expenseTransactions.length > 0 ? expenseTransactions[expenseTransactions.length - 1] : null;

        // Prepare statistics
        const minIncome = incomeTransactions.length > 0 ? Math.min(...incomeTransactions.map(t => t.amount || 0)) : 0;
        const maxIncome = incomeTransactions.length > 0 ? Math.max(...incomeTransactions.map(t => t.amount || 0)) : 0;
        const minExpense = expenseTransactions.length > 0 ? Math.min(...expenseTransactions.map(t => t.amount || 0)) : 0;
        const maxExpense = expenseTransactions.length > 0 ? Math.max(...expenseTransactions.map(t => t.amount || 0)) : 0;

        // Send JSON response
        res.status(200).json({
            balance,
            income: totalIncome,
            expense: totalExpense,
            incomeHistory,
            expenseHistory,
            latestIncome,
            latestExpense,
            minIncome,
            maxIncome,
            minExpense,
            maxExpense
        });
    } catch (error) {
        // Handle errors
        console.error('Error fetching stats:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message 
        });
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

const Expense = require('./models/expense'); // Adjust path if necessary
