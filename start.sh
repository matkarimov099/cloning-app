#!/bin/bash

# CloneAI Start Script
# This script starts both frontend and backend in the background

echo "🚀 Starting CloneAI application..."

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "server_simple.py" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait a moment for processes to terminate
sleep 2

# Start backend
echo "🐍 Starting Python backend..."
cd api

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run ./setup.sh first"
    exit 1
fi

# Activate virtual environment and start server
source venv/bin/activate
nohup python server_simple.py > ../backend.log 2>&1 &
BACKEND_PID=$!

cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Check if backend is running
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend started successfully on http://localhost:5000"
else
    echo "❌ Backend failed to start. Check backend.log for errors."
    exit 1
fi

# Start frontend
echo "🌐 Starting React frontend..."
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 5

# Check if frontend is running
if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Frontend started successfully on http://localhost:3001"
else
    echo "⚠️  Frontend might be starting on a different port. Check frontend.log for details."
fi

echo ""
echo "🎉 CloneAI is running!"
echo ""
echo "📍 Application URLs:"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:5000"
echo "   API Docs: http://localhost:5000/health"
echo "   Test Page: file://$(pwd)/test-integration.html"
echo ""
echo "📄 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 To stop the application:"
echo "   ./stop.sh"
echo ""
echo "💡 To view logs in real-time:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"

# Store PIDs for later cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# Open browser (optional)
if command -v xdg-open > /dev/null; then
    sleep 2
    xdg-open http://localhost:3001 &
elif command -v open > /dev/null; then
    sleep 2
    open http://localhost:3001 &
fi
