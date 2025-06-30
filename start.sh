#!/bin/bash

# 🚀 CloneAI Production Startup Script
echo "🚀 Starting CloneAI Production System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo -e "${BLUE}🔍 Checking dependencies...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command_exists python; then
    if ! command_exists python3; then
        echo -e "${RED}❌ Python not found. Please install Python 3.9+${NC}"
        exit 1
    fi
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies check passed${NC}"

# Check environment files
echo -e "${BLUE}🔧 Checking environment configuration...${NC}"

if [ ! -f "api/.env" ]; then
    echo -e "${YELLOW}⚠️  API .env file not found. Creating from template...${NC}"
    if [ -f "api/.env.example" ]; then
        cp api/.env.example api/.env
        echo -e "${YELLOW}📝 Please edit api/.env with your API keys${NC}"
    else
        echo -e "${RED}❌ No .env.example found. Please create api/.env manually${NC}"
        exit 1
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    npm install
fi

if [ ! -d "api/venv" ]; then
    echo -e "${BLUE}🐍 Creating Python virtual environment...${NC}"
    cd api
    $PYTHON_CMD -m venv venv
    cd ..
fi

# Kill existing processes
echo -e "${BLUE}🛑 Stopping existing processes...${NC}"
pkill -f "python.*server" 2>/dev/null || true
pkill -f "node.*vite" 2>/dev/null || true
sleep 2

# Create logs directory
mkdir -p logs

# Start backend server
echo -e "${GREEN}🚀 Starting backend server...${NC}"
cd api

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    echo -e "${RED}❌ Could not activate virtual environment${NC}"
    exit 1
fi

# Install Python dependencies if needed
pip install -r requirements.txt > /dev/null 2>&1

nohup $PYTHON_CMD server_production.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${BLUE}⏳ Waiting for backend to start...${NC}"
sleep 5

# Check if backend is running
if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend server started successfully${NC}"
else
    echo -e "${RED}❌ Backend server failed to start${NC}"
    echo -e "${YELLOW}📋 Check logs/backend.log for details${NC}"
fi

# Start frontend server
echo -e "${GREEN}🚀 Starting frontend server...${NC}"
nohup npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo -e "${BLUE}⏳ Waiting for frontend to start...${NC}"
sleep 8

# Check if frontend is running
FRONTEND_URL=""
if curl -s http://localhost:3000 > /dev/null; then
    FRONTEND_URL="http://localhost:3000"
    echo -e "${GREEN}✅ Frontend server started on port 3000${NC}"
elif curl -s http://localhost:3000 > /dev/null; then
    FRONTEND_URL="http://localhost:3000"
    echo -e "${GREEN}✅ Frontend server started on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend server failed to start${NC}"
    echo -e "${YELLOW}📋 Check logs/frontend.log for details${NC}"
fi

# Create PID file for stop script
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid

echo ""
echo -e "${GREEN}🎉 CloneAI Production System Started Successfully!${NC}"
echo ""
echo -e "${BLUE}📡 Services:${NC}"
echo -e "   • Backend API: ${GREEN}http://localhost:8000${NC}"
if [ ! -z "$FRONTEND_URL" ]; then
    echo -e "   • Frontend UI: ${GREEN}$FRONTEND_URL${NC}"
fi
echo -e "   • Health Check: ${GREEN}http://localhost:8000/health${NC}"
echo ""
echo -e "${BLUE}📋 Management:${NC}"
echo -e "   • Stop services: ${YELLOW}./stop.sh${NC}"
echo -e "   • View logs: ${YELLOW}tail -f logs/*.log${NC}"
echo -e "   • Backend logs: ${YELLOW}tail -f logs/backend.log${NC}"
echo -e "   • Frontend logs: ${YELLOW}tail -f logs/frontend.log${NC}"
echo ""
echo -e "${BLUE}🔧 Configuration:${NC}"
echo -e "   • API Keys: ${YELLOW}api/.env${NC}"
echo -e "   • Frontend Config: ${YELLOW}.env.local${NC}"
echo ""
echo -e "${GREEN}Ready to clone websites with AI! 🤖✨${NC}"
echo -e "${BLUE}Open your browser and navigate to the Frontend UI to get started.${NC}"
