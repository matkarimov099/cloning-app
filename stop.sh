#!/bin/bash

# CloneAI Stop Script
# This script stops both frontend and backend

echo "🛑 Stopping CloneAI application..."

# Kill processes by PID if available
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill $BACKEND_PID 2>/dev/null; then
        echo "✅ Backend stopped (PID: $BACKEND_PID)"
    fi
    rm .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill $FRONTEND_PID 2>/dev/null; then
        echo "✅ Frontend stopped (PID: $FRONTEND_PID)"
    fi
    rm .frontend.pid
fi

# Kill any remaining processes
pkill -f "server_simple.py" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo "🧹 All CloneAI processes stopped"

# Clean up log files (optional)
read -p "🗑️  Remove log files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f backend.log frontend.log
    echo "📄 Log files removed"
fi
