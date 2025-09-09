#!/bin/bash

# Development Setup Script for Collaborative AI Platform
# This script automates the development environment setup

echo "🚀 Setting up Collaborative AI Platform Development Environment"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Check if backend server is running
check_backend() {
    print_status "Checking if backend server is running..."
    if curl -s http://localhost:4000/api/health > /dev/null; then
        print_success "Backend server is running on port 4000"
    else
        print_warning "Backend server is not running. Starting it now..."
        start_backend
    fi
}

# Start backend server
start_backend() {
    print_status "Starting backend server..."
    # Start backend in background
    nohup node server/index.cjs > server.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > server.pid
    
    # Wait a moment for server to start
    sleep 3
    
    if curl -s http://localhost:4000/api/health > /dev/null; then
        print_success "Backend server started successfully (PID: $BACKEND_PID)"
    else
        print_error "Failed to start backend server"
        exit 1
    fi
}

# Check if frontend server is running
check_frontend() {
    print_status "Checking if frontend server is running..."
    if curl -s http://localhost:5173 > /dev/null || curl -s http://localhost:5174 > /dev/null; then
        print_success "Frontend server is running"
    else
        print_warning "Frontend server is not running. You can start it with: npm run dev"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p logs
    mkdir -p uploads
    mkdir -p temp
    print_success "Directories created successfully"
}

# Set up environment variables
setup_env() {
    print_status "Setting up environment variables..."
    if [ ! -f .env ]; then
        cat > .env << EOF
# Development Environment Variables
NODE_ENV=development
PORT=4000
FRONTEND_PORT=5173
DATABASE_URL=sqlite:./dev.db
JWT_SECRET=your-secret-key-here
EOF
        print_success "Environment file created"
    else
        print_warning "Environment file already exists"
    fi
}

# Main execution
main() {
    echo
    check_node
    check_npm
    create_directories
    setup_env
    install_dependencies
    check_backend
    check_frontend
    
    echo
    print_success "Development environment setup complete!"
    echo
    echo "Next steps:"
    echo "1. Start frontend: npm run dev"
    echo "2. Backend is running on: http://localhost:4000"
    echo "3. Frontend will be available on: http://localhost:5173"
    echo "4. Check server logs: tail -f server.log"
    echo
}

# Run main function
main "$@"
