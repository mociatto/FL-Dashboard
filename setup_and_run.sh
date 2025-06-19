#!/bin/bash

echo "🚀 HYBRIDVFL Dashboard Setup & Launch"
echo "======================================"

# Check if virtual environment exists
if [ ! -d "hybridvfl-dashboard-env" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv hybridvfl-dashboard-env
    
    echo "⚡ Activating virtual environment..."
    source hybridvfl-dashboard-env/bin/activate
    
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    
    echo "✅ Setup complete!"
else
    echo "🔄 Virtual environment exists, activating..."
    source hybridvfl-dashboard-env/bin/activate
fi

echo ""
echo "🌟 Starting HYBRIDVFL Dashboard..."
echo "📊 Dashboard will open at: http://localhost:5050"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the dashboard
python dashboard.py 