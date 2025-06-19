# HYBRIDVFL Dashboard

A modern, real-time dashboard for monitoring HYBRIDVFL federated learning processes with multi-tab interface, live metrics, and interactive controls.

## Features

### **Home Tab**
- Dataset selection (HAM10K active for now)
- Dataset portion control for model training
- Configuration controls for federated rounds and epochs
- Real-time training progress bar and timer
- Live training status updates

### **Performance Tab**
- Live Accuracy chart with real-time updates
- Live Loss tracking
- F1 Score progression
- Overall Model Precision Recall (AUC PR)
- Gender Fairness metrics
- Age Fairness across age groups

### **Attack Tab**
- Animated server-client architecture with flowing connections
- Gender Leakage monitoring
- Age Leakage tracking
- Live connection status indicators

### **Defence Tab**
- Protection control panel with Run/Stop buttons
- Real-time protection scores
- Defence Strength chart showing protection effectiveness
- Interactive protection status management

## Installation

### Prerequisites
- Python 3.8+
- pip package manager

### Setup Instructions

#### Option 1: Quick Setup (Recommended)
```bash
# Navigate to your project directory
cd your-project-directory

# Run the setup script (creates virtual environment and installs dependencies)
./setup_and_run.sh
```

#### Option 2: Manual Setup
1. **Navigate to project directory**
   ```bash
   cd your-project-directory
   ```

2. **Create and activate virtual environment**
   ```bash
   # Create virtual environment
   python3 -m venv hybridvfl-dashboard-env
   
   # Activate virtual environment
   source hybridvfl-dashboard-env/bin/activate  # On macOS/Linux
   # OR
   hybridvfl-dashboard-env\Scripts\activate     # On Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the dashboard**
   ```bash
   python dashboard.py
   ```

5. **Access the dashboard**
   - The dashboard will automatically open in your default browser
   - Manual access: http://localhost:5050


### File Structure
```
├── asset/
│   ├── attack-icon.svg    # Icon files used in dashboard
│   ├── ...
├── static/
│   ├── styles.css         # Complete styling with animations
│   └── script.js          # Dashboard functionality
├── templates/
│   └── dashboard.html     # Main HTML template
├── dashboard.py           # Flask server with Socket.IO
├── README.md              # This file
└── requirements.txt       # Python dependencies
```

### Responsive Design
- Desktop-first approach with mobile adaptations
- Smooth tab transitions with CSS arrow indicator
- Responsive chart resizing
- Touch-friendly mobile interface

## Customization

### Adding New Metrics
1. Update `live_metrics` in `dashboard.py`
2. Add corresponding chart in `initializeCharts()` in `script.js`
3. Implement update logic in relevant `update*Charts()` function

### Modifying Update Frequency
Change the `time.sleep(5)` value in `generate_mock_data()` function in `dashboard.py`.

## Troubleshooting

### Common Issues

**Dashboard not opening automatically:**
- Manually navigate to http://localhost:5050
- Check if port 5050 is available

**Charts not displaying:**
- Ensure Chart.js is loading properly
- Check browser console for JavaScript errors
- Verify canvas elements have proper IDs

**Real-time updates not working:**
- Check Socket.IO connection status in browser console
- Verify Flask-SocketIO is properly installed
- Ensure no firewall blocking WebSocket connections

**Performance issues:**
- Reduce chart data retention (currently 20 points max)
- Adjust update frequency in `dashboard.py`
- Close unused browser tabs

**Dashboard displaying incorrectly:**
- Try to zoom out on browser tab to find propper view

### Debug Mode
Open browser console and run:
```javascript
debugCurrentState()
```

This will display current dashboard state, active charts, and configuration.

## Browser Support

- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: WebSocket support, ES6+, CSS Grid, Flexbox

## Performance Notes

- Chart animations use hardware acceleration when available
- Data points are limited to last 20 values for optimal performance
- Background updates pause when dashboard is not in focus
- Memory usage optimized for long-running sessions

---