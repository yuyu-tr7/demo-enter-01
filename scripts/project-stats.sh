#!/bin/bash

# Project Statistics Script
# Shows useful statistics about our collaborative AI platform

echo "📊 Collaborative AI Platform - Project Statistics"
echo "================================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print colored output
print_stat() {
    echo -e "${BLUE}$1${NC}: $2"
}

print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# File Statistics
print_header "File Statistics"
TOTAL_FILES=$(find . -type f | wc -l)
JS_FILES=$(find . -name "*.js" -o -name "*.jsx" | wc -l)
CSS_FILES=$(find . -name "*.css" | wc -l)
JSON_FILES=$(find . -name "*.json" | wc -l)
SH_FILES=$(find . -name "*.sh" | wc -l)

print_stat "Total Files" "$TOTAL_FILES"
print_stat "JavaScript Files" "$JS_FILES"
print_stat "CSS Files" "$CSS_FILES"
print_stat "JSON Files" "$JSON_FILES"
print_stat "Shell Scripts" "$SH_FILES"

# Code Statistics
print_header "Code Statistics"
TOTAL_LINES=$(find . -name "*.js" -o -name "*.jsx" -o -name "*.css" | xargs wc -l | tail -1 | awk '{print $1}')
JS_LINES=$(find . -name "*.js" -o -name "*.jsx" | xargs wc -l | tail -1 | awk '{print $1}')
CSS_LINES=$(find . -name "*.css" | xargs wc -l | tail -1 | awk '{print $1}')

print_stat "Total Lines of Code" "$TOTAL_LINES"
print_stat "JavaScript Lines" "$JS_LINES"
print_stat "CSS Lines" "$CSS_LINES"

# Directory Structure
print_header "Directory Structure"
echo "Project Root: $(pwd)"
echo "Directories:"
find . -type d -not -path "./node_modules*" -not -path "./.git*" | head -10

# Package Information
print_header "Package Information"
if [ -f "package.json" ]; then
    PACKAGE_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
    PACKAGE_VERSION=$(grep '"version"' package.json | cut -d'"' -f4)
    print_stat "Package Name" "$PACKAGE_NAME"
    print_stat "Version" "$PACKAGE_VERSION"
    
    # Count dependencies
    DEPENDENCIES=$(grep -c '"' package.json | awk '{print $1/2-2}')
    print_stat "Dependencies" "$DEPENDENCIES"
else
    echo "No package.json found"
fi

# Git Information
print_header "Git Information"
if [ -d ".git" ]; then
    BRANCH=$(git branch --show-current)
    COMMITS=$(git rev-list --count HEAD)
    LAST_COMMIT=$(git log -1 --format="%h - %s (%cr)")
    
    print_stat "Current Branch" "$BRANCH"
    print_stat "Total Commits" "$COMMITS"
    print_stat "Last Commit" "$LAST_COMMIT"
else
    echo "Not a git repository"
fi

# Server Status
print_header "Server Status"
if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
    print_stat "Backend Server" "✅ Running on port 4000"
else
    print_stat "Backend Server" "❌ Not running"
fi

if curl -s http://localhost:5173 > /dev/null 2>&1 || curl -s http://localhost:5174 > /dev/null 2>&1; then
    print_stat "Frontend Server" "✅ Running"
else
    print_stat "Frontend Server" "❌ Not running"
fi

# Disk Usage
print_header "Disk Usage"
PROJECT_SIZE=$(du -sh . | cut -f1)
print_stat "Project Size" "$PROJECT_SIZE"

# Recent Activity
print_header "Recent Activity"
echo "Recently modified files:"
find . -type f -not -path "./node_modules*" -not -path "./.git*" -mtime -1 | head -5

echo -e "\n${GREEN}Statistics generated successfully!${NC}"
