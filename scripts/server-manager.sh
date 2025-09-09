#!/bin/bash

# Server Manager Script for Collaborative AI Platform
# Manages frontend and backend servers

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_PORT=4000
FRONTEND_PORT=5173
BACKEND_PID_FILE="server.pid"
FRONTEND_PID_FILE="frontend.pid"
LOG_DIR="logs"

# Create log directory
mkdir -p "$LOG_DIR"

# Functions
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

# Check if port is in use
is_port_in_use() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Get process ID by port
get_pid_by_port() {
    local port=$1
    lsof -ti :$port 2>/dev/null
}

# Start backend server
start_backend() {
    print_status "Starting backend server..."
    
    if is_port_in_use $BACKEND_PORT; then
        print_warning "Backend server is already running on port $BACKEND_PORT"
        return 0
    fi
    
    # Start backend in background
    nohup node server/index.cjs > "$LOG_DIR/backend.log" 2>&1 &
    local pid=$!
    echo $pid > "$BACKEND_PID_FILE"
    
    # Wait for server to start
    sleep 3
    
    if is_port_in_use $BACKEND_PORT; then
        print_success "Backend server started successfully (PID: $pid)"
    else
        print_error "Failed to start backend server"
        return 1
    fi
}

# Start frontend server
start_frontend() {
    print_status "Starting frontend server..."
    
    if is_port_in_use $FRONTEND_PORT; then
        print_warning "Frontend server is already running on port $FRONTEND_PORT"
        return 0
    fi
    
    # Start frontend in background
    nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
    local pid=$!
    echo $pid > "$FRONTEND_PID_FILE"
    
    # Wait for server to start
    sleep 5
    
    if is_port_in_use $FRONTEND_PORT; then
        print_success "Frontend server started successfully (PID: $pid)"
    else
        print_error "Failed to start frontend server"
        return 1
    fi
}

# Stop backend server
stop_backend() {
    print_status "Stopping backend server..."
    
    if [ -f "$BACKEND_PID_FILE" ]; then
        local pid=$(cat "$BACKEND_PID_FILE")
        if kill $pid 2>/dev/null; then
            print_success "Backend server stopped (PID: $pid)"
        else
            print_warning "Backend server process not found"
        fi
        rm -f "$BACKEND_PID_FILE"
    fi
    
    # Kill by port if still running
    local port_pid=$(get_pid_by_port $BACKEND_PORT)
    if [ ! -z "$port_pid" ]; then
        kill $port_pid 2>/dev/null
        print_success "Killed backend server on port $BACKEND_PORT"
    fi
}

# Stop frontend server
stop_frontend() {
    print_status "Stopping frontend server..."
    
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local pid=$(cat "$FRONTEND_PID_FILE")
        if kill $pid 2>/dev/null; then
            print_success "Frontend server stopped (PID: $pid)"
        else
            print_warning "Frontend server process not found"
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi
    
    # Kill by port if still running
    local port_pid=$(get_pid_by_port $FRONTEND_PORT)
    if [ ! -z "$port_pid" ]; then
        kill $port_pid 2>/dev/null
        print_success "Killed frontend server on port $FRONTEND_PORT"
    fi
}

# Check server status
check_status() {
    print_status "Checking server status..."
    
    echo
    echo "Backend Server:"
    if is_port_in_use $BACKEND_PORT; then
        local pid=$(get_pid_by_port $BACKEND_PORT)
        print_success "✅ Running on port $BACKEND_PORT (PID: $pid)"
    else
        print_error "❌ Not running"
    fi
    
    echo
    echo "Frontend Server:"
    if is_port_in_use $FRONTEND_PORT; then
        local pid=$(get_pid_by_port $FRONTEND_PORT)
        print_success "✅ Running on port $FRONTEND_PORT (PID: $pid)"
    else
        print_error "❌ Not running"
    fi
}

# Show logs
show_logs() {
    local service=$1
    
    case $service in
        "backend")
            if [ -f "$LOG_DIR/backend.log" ]; then
                print_status "Backend logs (last 20 lines):"
                tail -20 "$LOG_DIR/backend.log"
            else
                print_warning "No backend logs found"
            fi
            ;;
        "frontend")
            if [ -f "$LOG_DIR/frontend.log" ]; then
                print_status "Frontend logs (last 20 lines):"
                tail -20 "$LOG_DIR/frontend.log"
            else
                print_warning "No frontend logs found"
            fi
            ;;
        "all")
            print_status "All logs:"
            for log_file in "$LOG_DIR"/*.log; do
                if [ -f "$log_file" ]; then
                    echo "=== $(basename "$log_file") ==="
                    tail -10 "$log_file"
                    echo
                fi
            done
            ;;
        *)
            print_error "Usage: $0 logs {backend|frontend|all}"
            ;;
    esac
}

# Clean up
cleanup() {
    print_status "Cleaning up..."
    stop_backend
    stop_frontend
    print_success "Cleanup completed"
}

# Main function
main() {
    case $1 in
        "start")
            start_backend
            start_frontend
            check_status
            ;;
        "stop")
            stop_backend
            stop_frontend
            ;;
        "restart")
            stop_backend
            stop_frontend
            sleep 2
            start_backend
            start_frontend
            check_status
            ;;
        "status")
            check_status
            ;;
        "logs")
            show_logs $2
            ;;
        "cleanup")
            cleanup
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|status|logs|cleanup}"
            echo
            echo "Commands:"
            echo "  start    - Start both servers"
            echo "  stop     - Stop both servers"
            echo "  restart  - Restart both servers"
            echo "  status   - Check server status"
            echo "  logs     - Show logs (backend|frontend|all)"
            echo "  cleanup  - Stop all servers and clean up"
            ;;
    esac
}

# Handle Ctrl+C
trap cleanup INT

# Run main function
main "$@"
