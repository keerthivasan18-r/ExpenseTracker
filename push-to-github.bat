@echo off
echo Initializing Git repository...
git init

echo Adding remote repository...
git remote add origin https://github.com/keerthivasanfs/Expenses_tracker.git

echo Adding all files...
git add index.html
git add styles.css
git add app.js
git add README.md

echo Committing files...
git commit -m "Initial commit: Student Expense Tracker & Budget Management System"

echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo Done! Your project has been pushed to GitHub.
pause

