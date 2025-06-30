#!/bin/bash

# 🛑 CloneAI Production Stop Script
echo "🛑 Stopping CloneAI Production System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Stop processes using PID files
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    echo -e "${BLUE}🛑 Stopping backend server (PID: $BACKEND_PID)...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    rm -f .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    echo -e "${BLUE}🛑 Stopping frontend server (PID: $FRONTEND_PID)...${NC}"
    kill $FRONTEND_PID 2>/dev/null || true
    rm -f .frontend.pid
fi

# Fallback: kill by process name
echo -e "${BLUE}🧹 Cleaning up remaining processes...${NC}"
pkill -f "python.*server_production" 2>/dev/null || true
pkill -f "python.*server" 2>/dev/null || true
pkill -f "node.*vite" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true

# Wait for processes to terminate
sleep 2

# Check if processes are still running
BACKEND_RUNNING=$(pgrep -f "server_production" || true)
FRONTEND_RUNNING=$(pgrep -f "vite" || true)

if [ -z "$BACKEND_RUNNING" ]; then
    echo -e "${GREEN}✅ Backend server stopped${NC}"
else
    echo -e "${YELLOW}⚠️  Backend server still running (PID: $BACKEND_RUNNING)${NC}"
    echo -e "${YELLOW}   Force kill with: kill -9 $BACKEND_RUNNING${NC}"
fi

if [ -z "$FRONTEND_RUNNING" ]; then
    echo -e "${GREEN}✅ Frontend server stopped${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend server still running (PID: $FRONTEND_RUNNING)${NC}"
    echo -e "${YELLOW}   Force kill with: kill -9 $FRONTEND_RUNNING${NC}"
fi

# Clean up log files (optional)
read -p "$(echo -e ${BLUE}Clean up log files? [y/N]: ${NC})" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f logs/*.log
    echo -e "${GREEN}✅ Log files cleaned${NC}"
fi

echo ""
echo -e "${GREEN}🎉 CloneAI Production System Stopped${NC}"
echo ""
echo -e "${BLUE}📋 To restart:${NC}"
echo -e "   • Production: ${YELLOW}./start_production.sh${NC}"
echo -e "   • Development: ${YELLOW}./start.sh${NC}"
