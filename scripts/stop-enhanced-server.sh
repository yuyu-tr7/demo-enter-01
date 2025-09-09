#!/bin/bash

# Enhanced Server Stop Script
# Stops the collaborative AI platform enhanced server

echo "🛑 Stopping Enhanced Collaborative AI Platform Server"
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

# Stop server by PID file
stop_by_pid() {
    if [ -f server.pid ]; then
        PID=$(cat server.pid)
        if ps -p $PID > /dev/null 2>&1; then
            print_status "Stopping server process (PID: $PID)..."
            kill $PID
            sleep 2
            
            if ps -p $PID > /dev/null 2>&1; then
                print_warning "Process still running, force killing..."
                kill -9 $PID
            fi
            
            print_success "Server stopped successfully"
        else
            print_warning "Server process not found (PID: $PID)"
        fi
        rm -f server.pid
    else
        print_warning "No PID file found"
    fi
}

# Stop server by port
stop_by_port() {
    PORT=4000
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_status "Stopping server on port $PORT..."
        lsof -ti :$PORT | xargs kill -9 2>/dev/null
        sleep 2
        
        if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_error "Failed to stop server on port $PORT"
            return 1
        else
            print_success "Server stopped on port $PORT"
        fi
    else
        print_warning "No server running on port $PORT"
    fi
}

# Stop server by process name
stop_by_process() {
    print_status "Looking for server processes..."
    
    # Find processes running the enhanced server
    PIDS=$(pgrep -f "node.*index-enhanced.cjs" 2>/dev/null)
    
    if [ ! -z "$PIDS" ]; then
        print_status "Found server processes: $PIDS"
        echo $PIDS | xargs kill -9 2>/dev/null
        sleep 2
        print_success "Server processes stopped"
    else
        print_warning "No server processes found"
    fi
}

# Clean up temporary files
cleanup() {
    print_status "Cleaning up temporary files..."
    
    # Remove PID file
    rm -f server.pid
    
    # Clean up old log files (keep last 10)
    if [ -d logs ]; then
        cd logs
        ls -t enhanced-server.log.* 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
        cd ..
    fi
    
    print_success "Cleanup completed"
}

# Check if server is still running
check_status() {
    if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Server is still running on port 4000"
        return 1
    else
        print_success "Server is not running"
        return 0
    fi
}

# Main execution
main() {
    echo
    
    # Try different methods to stop the server
    stop_by_pid
    stop_by_port
    stop_by_process
    
    # Clean up
    cleanup
    
    # Check final status
    if check_status; then
        echo
        print_success "🎉 Enhanced server stopped successfully!"
        echo
        echo "📊 Server Status:"
        echo "   - Port 4000: Available"
        echo "   - Process: Stopped"
        echo "   - Cleanup: Completed"
        echo
    else
        echo
        print_error "❌ Failed to stop server completely"
        echo
        echo "🔧 Manual cleanup required:"
        echo "   - Check running processes: ps aux | grep node"
        echo "   - Kill by port: lsof -ti :4000 | xargs kill -9"
        echo "   - Check logs: tail -f logs/enhanced-server.log"
        echo
        exit 1
    fi
}

# Run main function
main "$@"
