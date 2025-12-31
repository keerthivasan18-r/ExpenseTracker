#!/bin/bash

echo "========================================="
echo "Pushing Expense Tracker to GitHub"
echo "========================================="

# Navigate to project directory
cd "C:\Users\KEERTHIVASAN\Desktop\Expense Tracker" || cd "$(dirname "$0")"

echo ""
echo "Step 1: Initializing Git repository..."
git init

echo ""
echo "Step 2: Adding remote repository..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/keerthivasanfs/Expenses_tracker.git

echo ""
echo "Step 3: Adding files..."
git add index.html
git add styles.css
git add app.js
git add README.md

echo ""
echo "Step 4: Committing files..."
git commit -m "Initial commit: Student Expense Tracker & Budget Management System

- Complete expense tracking system with rupee (₹) support
- User authentication (login/signup)
- Budget management with alerts
- AI-powered expense entry
- Interactive pie chart and category statistics
- Delete expense functionality
- Dark theme UI optimized for students"

echo ""
echo "Step 5: Setting main branch..."
git branch -M main

echo ""
echo "Step 6: Pushing to GitHub..."
git push -u origin main

echo ""
echo "========================================="
echo "✅ Successfully pushed to GitHub!"
echo "Repository: https://github.com/keerthivasanfs/Expenses_tracker"
echo "========================================="

