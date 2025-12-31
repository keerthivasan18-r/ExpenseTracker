# Student Expense Tracker & Budget Management System

A modern, student-focused web application for tracking expenses and managing monthly budgets. Built with vanilla HTML, CSS, and JavaScript, this application provides an intuitive interface for students to monitor their spending habits, set budgets, and visualize their financial data through interactive charts and statistics.

## 📋 Summary

The **Student Expense Tracker & Budget Management System** is a single-page web application designed specifically for students to manage their personal finances efficiently. The application features a dark-themed, user-friendly interface that allows users to:

- **Track expenses** in real-time with rupee (₹) currency support
- **Set and monitor monthly budgets** with visual progress indicators
- **Categorize expenses** (Food, Travel, Fees, Fun, Others)
- **Visualize spending patterns** through interactive pie charts and category statistics
- **Use AI-powered expense entry** by describing expenses in natural language
- **Receive budget alerts** when spending exceeds the monthly limit
- **Manage expenses** with easy-to-use delete functionality

## 🎯 Problem Statement

Traditionally, people write down their expenses in a notepad and calculate totals manually, which is time-consuming and inefficient. This approach leads to several challenges:

- **Manual Calculation Errors**: Human errors in addition and subtraction
- **Time Consumption**: Tedious process of writing and calculating expenses manually
- **Lack of Insights**: No visual representation of spending patterns or category-wise breakdown
- **No Budget Tracking**: Difficult to monitor if spending exceeds the planned budget
- **Data Loss Risk**: Physical notes can be lost or damaged
- **No Historical Analysis**: Hard to review past expenses and identify spending trends

## 💡 Solution

This project provides a website that helps users easily track and manage their expenses in one place. The application offers:

- **Automated Calculations**: Instant calculation of totals, remaining budget, and spending percentages
- **Visual Analytics**: Interactive pie charts and bar graphs showing category-wise spending
- **Budget Alerts**: Real-time notifications when users exceed their monthly budget
- **AI-Powered Entry**: Natural language processing to auto-fill expense details from simple descriptions
- **Persistent Data**: In-memory storage (ready for backend integration) to maintain expense records
- **User-Friendly Interface**: Dark-themed, modern UI designed specifically for students
- **Quick Actions**: One-click expense deletion for error correction

## 🏗️ Architecture

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Styling**: Custom CSS with Flexbox and Grid layouts
- **Fonts**: Google Fonts (Poppins)
- **No External Dependencies**: Pure vanilla JavaScript implementation

### Application Structure

```
Expense Tracker/
├── index.html          # Main HTML structure (single-page application)
├── styles.css          # All styling and responsive design
├── app.js             # Application logic and state management
└── README.md          # Project documentation
```

### Component Architecture

#### 1. **Authentication Module**
- **Login Form**: Existing user authentication
- **Sign Up Form**: New user registration
- **Tab-based Navigation**: Seamless switching between login and signup
- **User State Management**: In-memory user data storage

#### 2. **Dashboard Module**
- **Summary Cards**: Display monthly budget, spent amount, and remaining budget
- **Budget Progress Bar**: Visual indicator of budget utilization
- **Budget Alert System**: Warning messages when budget is exceeded
- **Pie Chart Visualization**: Interactive chart showing category-wise spending distribution

#### 3. **Expense Management Module**
- **Quick Add Expense Form**: Manual expense entry with validation
- **AI Helper**: Natural language processing to auto-fill expense fields
- **Recent Expenses Table**: List of all expenses with delete functionality
- **Category Statistics**: Bar chart showing spending by category

#### 4. **Data Flow**

```
User Input → Form Validation → State Update → UI Refresh
                ↓
         Expense Addition/Deletion
                ↓
    Summary Calculation → Chart Updates → Alert Check
```

### Key Features Implementation

1. **AI Expense Parser**: Uses keyword matching and regex to extract:
   - Amount from text (first number found)
   - Category from keywords (chai, bus, fee, movie, etc.)
   - Title from first few words of description

2. **Budget Alert System**: Monitors total spent vs. budget and displays alerts dynamically

3. **Chart Rendering**: Canvas-based pie chart with hover tooltips showing category details

4. **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktops

## 🚀 How to Use

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No server or installation required (pure client-side application)

### Getting Started

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/keerthivasanfs/Expenses_tracker.git
   cd Expenses_tracker
   ```

2. **Open the Application**
   - Simply open `index.html` in your web browser
   - Or use a local server (optional):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```
   - Navigate to `http://localhost:8000` in your browser

3. **Create an Account**
   - Click on "New student? Sign Up" tab
   - Fill in your details:
     - Full Name
     - College/University
     - Email
     - Password (and confirm password)
   - Click "Create Account & Start Tracking"

4. **Set Your Monthly Budget**
   - After logging in, scroll to the "Budget Progress" section
   - Enter your monthly budget in ₹ (e.g., 5000)
   - Click "Save budget"

5. **Add Expenses**

   **Method 1: Manual Entry**
   - Fill in the "Quick Add Expense" form:
     - Expense title (e.g., "Evening chai with friends")
     - Category (Food, Travel, Fees, Fun, Others)
     - Amount in ₹
     - Date (click the calendar icon to select)
   - Click "Add Expense"

   **Method 2: AI-Powered Entry**
   - In the "Describe your expense in your words" box, type:
     - Example: "Spent 150 on bus to college and 50 on chai with friends"
   - Click "Let the app guess & fill the fields"
   - Review the auto-filled fields
   - Click "Add Expense"

6. **Monitor Your Spending**
   - View summary cards for budget, spent, and remaining amounts
   - Check the progress bar to see budget utilization percentage
   - Hover over the pie chart to see category-wise spending details
   - Review the "Spending by Category" section for detailed breakdowns

7. **Manage Expenses**
   - View all expenses in the "Recent Expenses" table
   - Click the "Delete" button next to any expense to remove it
   - The dashboard will automatically update all calculations and charts

8. **Logout**
   - Click the "Logout" button in the top-right corner
   - You'll be redirected to the login screen

### Features Guide

#### Budget Alerts
- When your total spending exceeds your monthly budget, a red alert message will appear below the progress bar
- The alert shows how much you've exceeded by
- The alert automatically disappears when you're back within budget

#### Pie Chart Interaction
- Hover over any slice of the pie chart to see:
  - Category name
  - Total amount spent in that category
  - Percentage of total spending

#### Category Statistics
- The "Spending by Category" section shows:
  - Category-wise totals
  - Visual bar charts comparing spending across categories
  - Helps identify which category consumes most of your budget

## 🔧 Future Enhancements

- Backend integration for persistent data storage
- Multi-user support with database
- Export expenses to CSV/PDF
- Monthly/Yearly reports
- Expense search and filtering
- Recurring expense reminders
- Mobile app version

## 📝 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

**Keerthivasan R**

- GitHub: [@keerthivasanfs](https://github.com/keerthivasanfs)
- Repository: [Expenses_tracker](https://github.com/keerthivasanfs/Expenses_tracker)

## 🙏 Acknowledgments

- Built as a student project for learning web development
- Designed with students in mind for practical expense management
- Inspired by the need for simple, accessible financial tracking tools

---

**Note**: This is a frontend-only application. Data is stored in browser memory and will be cleared on page refresh or logout. For production use, integrate with a backend service for persistent storage.

