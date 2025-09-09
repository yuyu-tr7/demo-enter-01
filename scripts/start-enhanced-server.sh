#!/bin/bash

# Enhanced Server Startup Script
# Starts the collaborative AI platform with enhanced backend features

echo "🚀 Starting Enhanced Collaborative AI Platform Server"
echo "=================================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p server/data
    mkdir -p server/uploads/images
    mkdir -p server/uploads/documents
    mkdir -p server/uploads/temp
    mkdir -p logs
    
    print_success "Directories created successfully"
}

# Set up environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cat > .env << EOF
# Enhanced Collaborative AI Platform Environment Variables
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production-$(date +%s)
DATABASE_URL=sqlite:./server/data/collaborative_ai.db
EOF
        print_success "Environment file created"
    else
        print_warning "Environment file already exists"
    fi
}

# Check if ports are available
check_ports() {
    print_status "Checking port availability..."
    
    if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 4000 is already in use. Stopping existing process..."
        lsof -ti :4000 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 5173 is already in use (frontend may be running)"
    fi
    
    print_success "Ports checked"
}

# Start the enhanced server
start_server() {
    print_status "Starting enhanced server..."
    
    # Kill any existing server processes
    pkill -f "node.*index-enhanced.cjs" 2>/dev/null || true
    
    # Start the server
    nohup node server/index-enhanced.cjs > logs/enhanced-server.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > server.pid
    
    # Wait for server to start
    sleep 5
    
    # Check if server is running
    if curl -s http://localhost:4000/api/health > /dev/null 2>&1; then
        print_success "Enhanced server started successfully (PID: $SERVER_PID)"
        print_success "Server URL: http://localhost:4000"
        print_success "Health Check: http://localhost:4000/api/health"
        print_success "WebSocket: ws://localhost:4000"
    else
        print_error "Failed to start enhanced server"
        print_error "Check logs: tail -f logs/enhanced-server.log"
        exit 1
    fi
}

# Show server information
show_info() {
    echo
    print_success "🎉 Enhanced Collaborative AI Platform is running!"
    echo
    echo "📊 Server Information:"
    echo "   - Backend API: http://localhost:4000"
    echo "   - Health Check: http://localhost:4000/api/health"
    echo "   - WebSocket: ws://localhost:4000"
    echo "   - Database: server/data/collaborative_ai.db"
    echo "   - Logs: logs/enhanced-server.log"
    echo
    echo "🔧 Available Features:"
    echo "   - JWT Authentication"
    echo "   - SQLite Database"
    echo "   - Real-time WebSocket Collaboration"
    echo "   - File Upload/Download"
    echo "   - AI Agent Integration"
    echo "   - Activity Logging"
    echo "   - Role-based Access Control"
    echo
    echo "📚 API Documentation:"
    echo "   - See API_DOCUMENTATION.md for complete API reference"
    echo "   - Test with: curl http://localhost:4000/api/health"
    echo
    echo "🛠️ Management Commands:"
    echo "   - Stop server: ./scripts/stop-enhanced-server.sh"
    echo "   - View logs: tail -f logs/enhanced-server.log"
    echo "   - Check status: curl http://localhost:4000/api/health"
    echo
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    if [ -f server.pid ]; then
        PID=$(cat server.pid)
        kill $PID 2>/dev/null || true
        rm -f server.pid
    fi
    print_success "Cleanup completed"
}

# Handle Ctrl+C
trap cleanup INT

# Main execution
main() {
    echo
    check_node
    check_npm
    create_directories
    setup_env
    install_dependencies
    check_ports
    start_server
    show_info
    
    echo
    print_status "Press Ctrl+C to stop the server"
    echo
    
    # Keep script running
    while true; do
        sleep 1
    done
}

# Run main function
main "$@"
