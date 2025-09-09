# Shell Scripting Guide
## Complete Guide to Bash Shell Scripting

### 🐚 What is Shell Scripting?

**Shell scripting** is writing programs using shell commands that can be executed directly from the command line. It's a powerful way to automate tasks, manage systems, and create tools for development workflows.

### 📚 Table of Contents

1. [Basic Concepts](#basic-concepts)
2. [Script Structure](#script-structure)
3. [Variables and Data Types](#variables-and-data-types)
4. [Control Structures](#control-structures)
5. [Functions](#functions)
6. [File Operations](#file-operations)
7. [Process Management](#process-management)
8. [Error Handling](#error-handling)
9. [Real-World Examples](#real-world-examples)
10. [Best Practices](#best-practices)

---

## 🔧 Basic Concepts

### **What is a Shell?**
- **Shell**: Command-line interface that interprets user commands
- **Bash**: Most common shell on Linux/macOS (Bourne Again Shell)
- **Script**: Text file containing shell commands

### **Why Use Shell Scripts?**
- **Automation**: Automate repetitive tasks
- **System Administration**: Manage servers and systems
- **Development Workflows**: Build, test, deploy applications
- **File Processing**: Batch process files
- **Integration**: Connect different tools and services

---

## 📝 Script Structure

### **Basic Template**
```bash
#!/bin/bash
# Shebang - tells system which interpreter to use

# Comments start with #

# Variables
VARIABLE_NAME="value"

# Functions
function_name() {
    echo "This is a function"
}

# Main script logic
echo "Hello, World!"
```

### **Making Scripts Executable**
```bash
# Method 1: Using chmod
chmod +x script.sh
./script.sh

# Method 2: Using bash directly
bash script.sh

# Method 3: Using sh
sh script.sh
```

---

## 🔢 Variables and Data Types

### **Variable Declaration**
```bash
# Basic assignment
NAME="John Doe"
AGE=25
IS_STUDENT=true

# Using variables
echo "Name: $NAME"
echo "Age: $AGE"

# Command substitution
CURRENT_DATE=$(date)
FILE_COUNT=$(ls -1 | wc -l)
```

### **Special Variables**
```bash
# Script arguments
echo "First argument: $1"
echo "Second argument: $2"
echo "All arguments: $@"
echo "Number of arguments: $#"

# Script information
echo "Script name: $0"
echo "Process ID: $$"
echo "Exit status: $?"
```

### **Environment Variables**
```bash
# Access environment variables
echo "Home directory: $HOME"
echo "Current user: $USER"
echo "Path: $PATH"

# Set environment variables
export DATABASE_URL="postgresql://localhost:5432/mydb"
export NODE_ENV="production"
```

---

## 🔄 Control Structures

### **Conditional Statements**
```bash
# If-else
if [ "$1" = "start" ]; then
    echo "Starting service..."
elif [ "$1" = "stop" ]; then
    echo "Stopping service..."
else
    echo "Usage: $0 {start|stop}"
fi

# Case statement
case $1 in
    "start")
        echo "Starting..."
        ;;
    "stop")
        echo "Stopping..."
        ;;
    "restart")
        echo "Restarting..."
        ;;
    *)
        echo "Unknown command"
        ;;
esac
```

### **Loops**
```bash
# For loop
for i in {1..5}; do
    echo "Iteration $i"
done

# For loop with files
for file in *.txt; do
    echo "Processing $file"
done

# While loop
counter=1
while [ $counter -le 5 ]; do
    echo "Counter: $counter"
    counter=$((counter + 1))
done
```

---

## 🔧 Functions

### **Function Definition**
```bash
# Method 1: Using function keyword
function greet() {
    echo "Hello, $1!"
}

# Method 2: Direct definition
greet_user() {
    local name=$1
    local age=$2
    echo "Hello $name, you are $age years old"
}

# Function with return value
calculate_sum() {
    local num1=$1
    local num2=$2
    local sum=$((num1 + num2))
    echo $sum
}

# Using functions
greet "World"
greet_user "Alice" 30
result=$(calculate_sum 5 3)
echo "Sum: $result"
```

---

## 📁 File Operations

### **File Testing**
```bash
# Check if file exists
if [ -f "file.txt" ]; then
    echo "File exists"
fi

# Check if directory exists
if [ -d "directory" ]; then
    echo "Directory exists"
fi

# Check file permissions
if [ -r "file.txt" ]; then
    echo "File is readable"
fi

if [ -w "file.txt" ]; then
    echo "File is writable"
fi

if [ -x "script.sh" ]; then
    echo "Script is executable"
fi
```

### **File Manipulation**
```bash
# Create files and directories
mkdir -p logs/backup
touch logs/app.log

# Copy files
cp source.txt destination.txt

# Move/rename files
mv old_name.txt new_name.txt

# Remove files
rm -f temp_file.txt
rm -rf old_directory

# Find files
find . -name "*.js" -type f
find . -name "*.log" -mtime -7  # Modified in last 7 days
```

### **File Reading and Writing**
```bash
# Read file line by line
while IFS= read -r line; do
    echo "Line: $line"
done < "input.txt"

# Write to file
echo "This is a log entry" >> logs/app.log

# Create file with content
cat > config.txt << EOF
database_url=localhost:5432
api_key=your-api-key
debug_mode=true
EOF
```

---

## ⚙️ Process Management

### **Running Commands**
```bash
# Run command and capture output
output=$(ls -la)
echo "Files: $output"

# Run command in background
npm start &
BACKEND_PID=$!

# Wait for process to complete
wait $BACKEND_PID

# Check if process is running
if ps -p $BACKEND_PID > /dev/null; then
    echo "Process is running"
else
    echo "Process has stopped"
fi
```

### **Signal Handling**
```bash
# Handle Ctrl+C (SIGINT)
trap 'echo "Script interrupted"; exit 1' INT

# Handle script exit
trap 'echo "Cleaning up..."; rm -f temp_file.txt' EXIT

# Custom signal handler
cleanup() {
    echo "Cleaning up..."
    kill $BACKEND_PID 2>/dev/null
    rm -f server.pid
}

trap cleanup EXIT
```

---

## ❌ Error Handling

### **Exit Codes**
```bash
# Check command success
if command -v node >/dev/null 2>&1; then
    echo "Node.js is installed"
else
    echo "Node.js is not installed"
    exit 1
fi

# Custom exit codes
if [ ! -f "config.json" ]; then
    echo "Error: config.json not found"
    exit 2
fi
```

### **Error Redirection**
```bash
# Redirect errors to file
npm install 2> error.log

# Redirect both output and errors
npm run build > build.log 2>&1

# Suppress errors
rm -f temp_file.txt 2>/dev/null
```

---

## 🌟 Real-World Examples

### **1. Development Server Manager**
```bash
#!/bin/bash
# dev-server.sh - Manage development servers

start_servers() {
    echo "Starting development servers..."
    
    # Start backend
    nohup node server/index.cjs > logs/backend.log 2>&1 &
    echo $! > server.pid
    
    # Start frontend
    nohup npm run dev > logs/frontend.log 2>&1 &
    echo $! > frontend.pid
    
    echo "Servers started successfully"
}

stop_servers() {
    echo "Stopping servers..."
    
    if [ -f server.pid ]; then
        kill $(cat server.pid) 2>/dev/null
        rm server.pid
    fi
    
    if [ -f frontend.pid ]; then
        kill $(cat frontend.pid) 2>/dev/null
        rm frontend.pid
    fi
    
    echo "Servers stopped"
}

case $1 in
    "start") start_servers ;;
    "stop") stop_servers ;;
    "restart") stop_servers && start_servers ;;
    *) echo "Usage: $0 {start|stop|restart}" ;;
esac
```

### **2. Database Backup Script**
```bash
#!/bin/bash
# backup-db.sh - Backup database

BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump $DATABASE_URL > $BACKUP_DIR/$BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Backup created: $BACKUP_FILE"
    
    # Compress backup
    gzip $BACKUP_DIR/$BACKUP_FILE
    
    # Remove old backups (keep last 7 days)
    find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
    
    echo "Backup completed successfully"
else
    echo "Backup failed"
    exit 1
fi
```

### **3. Deployment Script**
```bash
#!/bin/bash
# deploy.sh - Deploy application

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Build application
echo "📦 Building application..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

# Deploy to staging
echo "🚀 Deploying to staging..."
rsync -av --delete dist/ user@staging-server:/var/www/app/

# Run database migrations
echo "🗄️ Running database migrations..."
ssh user@staging-server "cd /var/www/app && npm run migrate"

# Restart services
echo "🔄 Restarting services..."
ssh user@staging-server "sudo systemctl restart nginx"

echo "✅ Deployment completed successfully!"
```

---

## 📋 Best Practices

### **1. Script Organization**
```bash
#!/bin/bash
# Script name and purpose
# Author: Your Name
# Date: 2025-01-01
# Version: 1.0

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="logs/script.log"

# Functions
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Main script
main() {
    log "Script started"
    # Your script logic here
    log "Script completed"
}

# Run main function
main "$@"
```

### **2. Error Handling**
```bash
# Always check command success
if ! command -v required_tool >/dev/null 2>&1; then
    echo "Error: required_tool is not installed"
    exit 1
fi

# Use set -e for automatic error handling
set -e

# Handle specific errors
trap 'echo "Error on line $LINENO"' ERR
```

### **3. Input Validation**
```bash
# Check arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 <arg1> <arg2>"
    exit 1
fi

# Validate file exists
if [ ! -f "$1" ]; then
    echo "Error: File $1 does not exist"
    exit 1
fi
```

### **4. Documentation**
```bash
# Always include:
# - Script purpose
# - Usage instructions
# - Required dependencies
# - Examples
# - Author and date
```

---

## 🛠️ Common Shell Script Patterns

### **1. Configuration Management**
```bash
# Load configuration
source config.sh

# Or use environment variables
export CONFIG_FILE="${CONFIG_FILE:-config/default.conf}"
```

### **2. Logging**
```bash
# Simple logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}
```

### **3. Temporary Files**
```bash
# Create temporary file
TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT
```

### **4. User Input**
```bash
# Read user input
read -p "Enter your name: " USER_NAME
read -s -p "Enter password: " PASSWORD
echo
```

---

## 🎯 Shell Scripting in Our AI Platform

### **Development Scripts**
- `dev-setup.sh`: Set up development environment
- `start-servers.sh`: Start frontend and backend
- `test-all.sh`: Run all tests
- `deploy.sh`: Deploy to production

### **Maintenance Scripts**
- `backup-db.sh`: Database backup
- `clean-logs.sh`: Clean old log files
- `update-deps.sh`: Update dependencies
- `health-check.sh`: Check system health

### **CI/CD Scripts**
- `build.sh`: Build application
- `test.sh`: Run test suite
- `deploy-staging.sh`: Deploy to staging
- `deploy-prod.sh`: Deploy to production

---

## 📚 Learning Resources

### **Online Resources**
- [Bash Guide for Beginners](https://tldp.org/LDP/Bash-Beginners-Guide/html/)
- [Advanced Bash Scripting Guide](https://tldp.org/LDP/abs/html/)
- [ShellCheck](https://www.shellcheck.net/) - Shell script analyzer

### **Practice Exercises**
1. Create a script to monitor disk usage
2. Build a log file analyzer
3. Write a backup automation script
4. Create a system health checker

---

## 🎉 Conclusion

Shell scripting is a powerful tool for:
- **Automation**: Automate repetitive tasks
- **System Administration**: Manage servers and applications
- **Development Workflows**: Build, test, and deploy applications
- **Data Processing**: Process files and data
- **Integration**: Connect different tools and services

Start with simple scripts and gradually build more complex automation tools. The key is to practice regularly and always test your scripts thoroughly!
