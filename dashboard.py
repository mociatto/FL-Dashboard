from flask import Flask, render_template, send_from_directory
from flask_socketio import SocketIO, emit
import webbrowser
import threading
import time
import os
import random
import json

app = Flask(__name__, static_folder='static', template_folder='templates')
socketio = SocketIO(app, cors_allowed_origins="*")

# Global variables for dashboard state
current_tab = 'home'
training_active = False
training_start_time = None
training_timer = 0
mock_data_thread = None

# Configuration states
current_config = {
    'dataset': 'HAM10K',
    'data_percentage': 5,
    'federated_rounds': 2,
    'epochs_per_round': 3,
    'current_round': 1,
    'current_epoch': 1,
    'progress': 0
}

# Live metrics storage
live_metrics = {
    'home': {
        'progress': 0,
        'timer': '00:00:00',
        'training_status': 'Ready to start training',
        'status_line2': 'HAM10K - Skin Cancer Classification'
    },
    'performance': {
        'live_accuracy': [],
        'live_loss': [],
        'f1_score': [],
        'precision_recall': [],
        'gender_fairness': {'female': 85, 'male': 78},
        'age_fairness': [75, 82, 79, 85, 73]  # Age groups 0-25, 26-40, 41-55, 56-70, 71-99
    },
    'attack': {
        'gender_leakage': [],
        'age_leakage': [],
        'connection_status': True
    },
    'defence': {
        'protection_active': False,
        'age_protection': 92.8,
        'gender_protection': 92.8,
        'age_leakage': 92.8,
        'gender_leakage_score': 92.8,
        'defence_strength': []
    }
}

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/asset/<path:filename>')
def serve_asset(filename):
    """Serve files from the asset folder"""
    return send_from_directory('asset', filename)

@socketio.on('connect')
def handle_connect():
    """Send initial dashboard state when client connects"""
    emit('dashboard_state', {
        'current_tab': current_tab,
        'config': current_config,
        'metrics': live_metrics,
        'training_active': training_active
    })

@socketio.on('switch_tab')
def handle_tab_switch(data):
    """Handle tab switching"""
    global current_tab
    current_tab = data.get('tab', 'home')
    emit('tab_switched', {'tab': current_tab}, broadcast=True)

@socketio.on('update_config')
def handle_config_update(data):
    """Handle configuration updates from frontend"""
    global current_config
    config_type = data.get('type')
    value = data.get('value')
    
    if config_type in ['data_percentage', 'federated_rounds', 'epochs_per_round']:
        current_config[config_type] = value
        emit('config_updated', {
            'type': config_type,
            'value': value
        }, broadcast=True)

@socketio.on('training_control')
def handle_training_control(data):
    """Handle play/stop training controls"""
    global training_active, training_start_time, mock_data_thread, training_timer
    
    action = data.get('action')
    print(f"Received training_control action: {action}, current training_active: {training_active}")
    
    if action == 'play' and not training_active:
        print("Starting training...")
        training_active = True
        training_start_time = time.time()
        training_timer = 0
        current_config['progress'] = 0
        current_config['current_round'] = 1
        current_config['current_epoch'] = 1
        
        # Start mock data generation
        if mock_data_thread is None or not mock_data_thread.is_alive():
            mock_data_thread = threading.Thread(target=generate_mock_data, daemon=True)
            mock_data_thread.start()
            print("Mock data thread started")
        
        emit('training_started', {'message': 'Training started'}, broadcast=True)
        print("Training started event emitted")
        
    elif action == 'stop' and training_active:
        print("Stopping training...")
        training_active = False
        training_start_time = None
        
        emit('training_stopped', {'message': 'Training stopped'}, broadcast=True)
        print("Training stopped event emitted")

@socketio.on('defence_control')
def handle_defence_control(data):
    """Handle defence protection controls"""
    action = data.get('action')
    
    if action == 'run_protection':
        live_metrics['defence']['protection_active'] = True
        emit('defence_status', {
            'protection_active': True,
            'message': 'Protection running - Confusing data inference'
        }, broadcast=True)
        
    elif action == 'stop_protection':
        live_metrics['defence']['protection_active'] = False
        emit('defence_status', {
            'protection_active': False,
            'message': 'Protection stopped - Data inference without protection'
        }, broadcast=True)

def generate_mock_data():
    """Generate mock training data every 5 seconds"""
    global training_timer
    
    while training_active:
        time.sleep(5)  # Update every 5 seconds
        
        if not training_active:
            break
            
        # Update timer
        if training_start_time:
            training_timer = int(time.time() - training_start_time)
            hours = training_timer // 3600
            minutes = (training_timer % 3600) // 60
            seconds = training_timer % 60
            timer_str = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
            live_metrics['home']['timer'] = timer_str
        
        # Update progress (0-100%)
        current_config['progress'] = min(100, current_config['progress'] + random.randint(2, 8))
        
        # Update training status
        if current_config['progress'] < 100:
            live_metrics['home']['training_status'] = f"Training Round {current_config['current_round']} - Epoch {current_config['current_epoch']}"
            live_metrics['home']['status_line2'] = f"Total Samples: 1002  Current Round: {current_config['current_round']}  Current Epoch: {current_config['current_epoch']}"
            
            # Progress epochs and rounds
            if random.random() > 0.7:  # 30% chance to advance epoch
                current_config['current_epoch'] += 1
                if current_config['current_epoch'] > current_config['epochs_per_round']:
                    current_config['current_epoch'] = 1
                    current_config['current_round'] += 1
                    if current_config['current_round'] > current_config['federated_rounds']:
                        current_config['current_round'] = 1
        else:
            live_metrics['home']['training_status'] = "Training Completed Successfully"
            live_metrics['home']['status_line2'] = "Model ready for evaluation"
        
        # Generate performance metrics
        live_metrics['performance']['live_accuracy'].append(
            min(100, max(50, 60 + random.randint(-5, 15) + len(live_metrics['performance']['live_accuracy']) * 2))
        )
        live_metrics['performance']['live_loss'].append(
            max(0.5, 2.0 - len(live_metrics['performance']['live_loss']) * 0.1 + random.uniform(-0.2, 0.1))
        )
        live_metrics['performance']['f1_score'].append(
            min(100, max(40, 50 + random.randint(-5, 20) + len(live_metrics['performance']['f1_score']) * 3))
        )
        live_metrics['performance']['precision_recall'].append(
            min(100, max(45, 55 + random.randint(-10, 25) + len(live_metrics['performance']['precision_recall']) * 2.5))
        )
        
        # Generate attack metrics
        live_metrics['attack']['gender_leakage'].append(
            max(0, min(100, 50 + random.randint(-20, 30)))
        )
        live_metrics['attack']['age_leakage'].append(
            max(0, min(100, 20 + random.randint(-10, 40)))
        )
        
        # Generate defence metrics
        live_metrics['defence']['defence_strength'].append(
            max(1, min(10, 5 + random.randint(-2, 3)))
        )
        
        # Keep only last 20 data points for charts
        for metric_category in live_metrics.values():
            for key, value in metric_category.items():
                if isinstance(value, list) and len(value) > 20:
                    metric_category[key] = value[-20:]
        
        # Emit updated metrics
        print(f"Emitting metrics update - Progress: {current_config['progress']}%, Timer: {live_metrics['home']['timer']}")
        socketio.emit('metrics_update', {
            'config': current_config,
            'metrics': live_metrics,
            'training_active': training_active
        })

def cleanup_threads():
    """Clean up background threads"""
    global training_active, mock_data_thread
    training_active = False
    if mock_data_thread and mock_data_thread.is_alive():
        mock_data_thread.join(timeout=1)

if __name__ == '__main__':
    port = 5050
    url = f'http://localhost:{port}'
    
    print("HYBRIDVFL Dashboard")
    print("=" * 30)
    print(f"Dashboard starting at: {url}")
    print("Multi-tab interface with live metrics")
    print("=" * 30)
    
    try:
        # Open browser
        try:
            webbrowser.open(url)
        except Exception:
            pass
        
        # Start dashboard server
        socketio.run(app, host='0.0.0.0', port=port, debug=False)
        
    except KeyboardInterrupt:
        print("\nShutting down dashboard...")
        cleanup_threads()
    except Exception as e:
        print(f"Dashboard error: {e}")
        cleanup_threads() 