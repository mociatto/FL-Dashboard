# HYBRIDVFL Dashboard

A modern, real-time dashboard for monitoring HYBRIDVFL federated learning processes with multi-tab interface, live metrics, and interactive controls.

## Features

### 🏠 **Home Tab**
- Server-side architecture visualization (Gender Inference, Fusion Model, Age Inference)
- Client-side components (Image Client, Tabular Client)
- Dataset selection (HAM10K active, others disabled)
- Configuration controls for data percentage, federated rounds, and epochs
- Real-time training progress bar and timer
- Live training status updates

### 📊 **Performance Tab**
- Live Accuracy chart with real-time updates
- Live Loss tracking
- F1 Score progression
- Overall Model Precision Recall (AUC PR)
- Gender Fairness metrics (Male/Female accuracy)
- Age Fairness across 5 age groups (0-25, 26-40, 41-55, 56-70, 71-99)

### 🎯 **Attack Tab**
- Animated server-client architecture with flowing connections
- Gender Leakage monitoring (target: 50% for binary classification)
- Age Leakage tracking (target: 20% for 5-class age groups)
- Live connection status indicators

### 🛡️ **Defence Tab**
- Protection control panel with Run/Stop buttons
- Real-time protection scores (Age Protection, Gender Protection, Age/Gender Leakage)
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

#### Deactivating Virtual Environment
When you're done, deactivate the virtual environment:
```bash
deactivate
```

## Usage

### Starting Training
1. Navigate to the Home tab
2. Configure your settings:
   - **Data Percentage**: Choose from 5%, 10%, 20%, 50%, 80%, 100%
   - **Federated Rounds**: Select 1-10 rounds
   - **Epochs Per Round**: Choose 1-10 epochs
3. Click the ▶️ **Play** button to start training
4. Monitor progress via the progress bar and timer
5. Click the ⏹️ **Stop** button to halt training

### Monitoring Performance
1. Switch to the **Performance** tab
2. View real-time charts updating every 5 seconds:
   - Training accuracy progression
   - Loss reduction over time
   - F1 score improvements
   - Precision-Recall metrics
   - Fairness across gender and age groups

### Attack Monitoring
1. Go to the **Attack** tab
2. Observe animated data flow between components
3. Monitor leakage metrics:
   - Gender leakage (lower is better, target: 50%)
   - Age leakage (lower is better, target: 20%)

### Defence Management
1. Access the **Defence** tab
2. Control protection mechanisms:
   - **Run Protection**: Activate privacy protection
   - **Stop Protection**: Disable protection
3. Monitor protection effectiveness:
   - View real-time protection scores (target: 92.8%+)
   - Track defence strength over time

## Technical Details

### Architecture
- **Backend**: Flask + Socket.IO for real-time communication
- **Frontend**: HTML5 + CSS3 + JavaScript with Chart.js
- **Real-time Updates**: WebSocket connections every 5 seconds
- **Mock Data**: Simulated training progression with realistic metrics

### File Structure
```
├── dashboard.py          # Flask server with Socket.IO
├── requirements.txt      # Python dependencies
├── templates/
│   └── dashboard.html   # Main HTML template
├── static/
│   ├── styles.css       # Complete styling with animations
│   └── script.js        # Dashboard functionality and charts
└── README.md            # This file
```

### Color Scheme (Vintage Theme)
- **Background**: Dark grey (#25272b)
- **Content Frame**: Light beige (#E8E0D6)
- **Orange Accent**: #E97B47 (Gender Inference, Age Inference, Leakage)
- **Blue Accent**: #6366F1 (Fusion Model, Datasets)
- **Green Accent**: #98B47C (Clients, Defence, Accuracy)
- **Yellow Accent**: #F59E0B (F1 Score, Protection)

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

### Color Theme Changes
Update the `chartColors` object in `script.js` and corresponding CSS color variables in `styles.css`.

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

### Debug Mode
Open browser console and run:
```javascript
debugCurrentState()
```

This will display current dashboard state, active charts, and configuration.

## Integration with Main Project

To integrate with your main HYBRIDVFL project:

1. Replace mock data generation with actual metric collection
2. Update `live_metrics` structure to match your data format
3. Modify Socket.IO event handlers to receive real training data
4. Implement actual training control (start/stop) functionality

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

For questions or support, refer to the main HYBRIDVFL project documentation. 