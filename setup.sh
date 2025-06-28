#!/bin/bash

# CloneAI Quick Setup Script
# This script sets up and starts both frontend and backend

echo "🚀 Setting up CloneAI..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if required tools are installed
echo "📋 Checking dependencies..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Dependencies check passed"

# Setup backend
echo "🐍 Setting up Python backend..."
cd api

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Backend setup complete"

# Setup frontend
echo "🌐 Setting up React frontend..."
cd ..

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete"

# Create .env file if it doesn't exist
if [ ! -f "api/.env" ]; then
    echo "📄 Creating .env file..."
    cp api/.env.example api/.env
    echo "⚠️  Please add your AI API keys to api/.env file"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start backend:  cd api && source venv/bin/activate && python server_simple.py"
echo "2. Start frontend: npm run dev"
echo ""
echo "Or use the start script:"
echo "./start.sh"
