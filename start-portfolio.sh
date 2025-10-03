#!/bin/bash

# Portfolio Web App - Quick Start Script
# This script starts a local web server to view your photography portfolio

echo "🎨 Starting Praveen K Photography Portfolio..."
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -d "public" ]; then
    echo "❌ Error: public directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

PORT=3000
echo "📂 Serving from: public/"
echo "🌐 Port: $PORT"
echo ""

# Try different server options
if command -v python3 &> /dev/null; then
    echo "✅ Using Python 3 server"
    echo "🚀 Opening browser at http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "================================================"
    cd public
    python3 -m http.server $PORT
elif command -v php &> /dev/null; then
    echo "✅ Using PHP server"
    echo "🚀 Opening browser at http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "================================================"
    cd public
    php -S localhost:$PORT
elif command -v npx &> /dev/null; then
    echo "✅ Using Node.js http-server"
    echo "🚀 Opening browser at http://localhost:$PORT"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "================================================"
    npx http-server public -p $PORT -o
else
    echo "⚠️  No web server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: https://www.python.org/"
    echo "  - PHP: https://www.php.net/"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    echo "Or simply open public/index.html in your web browser"
    exit 1
fi

