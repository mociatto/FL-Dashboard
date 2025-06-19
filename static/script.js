// Fresh start - JavaScript will be added step by step 

// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing tabs...');
    
    const tabs = document.querySelectorAll('.tab-item');
    const arrow = document.querySelector('.tab-arrow-indicator');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Found tabs:', tabs.length);
    console.log('Found arrow:', arrow ? 'yes' : 'no');
    console.log('Found tab contents:', tabContents.length);
    
    // Position calculation constants
    const logoHeight = 30;             // Approximate logo height
    const tabNavigationMargin = 200;   // Tab navigation margin-top
    const tabSpacing = 100;             // Distance between each tab center
    const arrowOffset = 25;             // Additional offset for fine-tuning (adjust this!)
    
    // Calculate base position
    const basePosition = logoHeight + tabNavigationMargin;
    
    function moveArrowToTab(tabIndex) {
        if (!arrow) return;
        
        // Calculate position for the tab
        const targetPosition = basePosition + (tabIndex * tabSpacing) + arrowOffset;
        
        console.log(`Moving arrow to tab ${tabIndex}, position: ${targetPosition}px`);
        arrow.style.top = targetPosition + 'px';
    }
    
    function switchToTab(targetTab) {
        console.log('Switching to tab:', targetTab);
        
        // Remove active class from all tabs
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to clicked tab
        const activeTab = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            
            // Show corresponding tab content
            const activeContent = document.getElementById(`${targetTab}-content`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
            
            // Move arrow to active tab
            const tabIndex = Array.from(tabs).indexOf(activeTab);
            moveArrowToTab(tabIndex);
            
            // Update architecture visualization if switching to attack tab
            if (targetTab === 'attack') {
                setTimeout(() => {
                    if (typeof updateComponentPositions !== 'undefined') {
                        updateComponentPositions();
                    }
                }, 100);
            }
        }
    }
    
    // Add click event listeners to tabs
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            console.log(`Tab clicked: ${tabName} (index: ${index})`);
            switchToTab(tabName);
        });
    });
    
    // Initialize arrow position for the active tab
    const activeTab = document.querySelector('.tab-item.active');
    if (activeTab) {
        const activeIndex = Array.from(tabs).indexOf(activeTab);
        moveArrowToTab(activeIndex);
    }
    
    // Percentage button functionality
    const percentageButtons = document.querySelectorAll('.percentage-btn');
    
    percentageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            percentageButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            console.log('Selected percentage:', this.getAttribute('data-percentage') + '%');
        });
    });
    
    // Timer variables
    let timerInterval = null;
    let startTime = null;
    let elapsedTime = 0; // in seconds
    
    // Control button functionality
    const controlButtons = document.querySelectorAll('.control-btn');
    const timeDisplay = document.querySelector('.time-display');
    
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            controlButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            const action = this.getAttribute('data-action');
            console.log('Control action:', action);
            
            // Handle timer based on action
            if (action === 'play') {
                startTimer();
                // When training starts, backend will send actual sample counts
                console.log('Training started - waiting for backend sample counts');
            } else if (action === 'stop') {
                resetTimer();
                // Reset sample counts to default when training stops
                resetSampleCounts();
            }
        });
    });
    
    // Timer functions
    function startTimer() {
        if (timerInterval) return; // Already running
        
        startTime = Date.now() - (elapsedTime * 1000);
        timerInterval = setInterval(updateTimer, 1000);
        console.log('Timer started');
    }
    
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            console.log('Timer stopped');
        }
    }
    
    function resetTimer() {
        stopTimer();
        elapsedTime = 0;
        updateTimeDisplay(0);
        console.log('Timer reset');
    }
    
    function updateTimer() {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        updateTimeDisplay(elapsedTime);
    }
    
    function updateTimeDisplay(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const timeString = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
        
        if (timeDisplay) {
            timeDisplay.textContent = timeString;
        }
    }
    
    // Function to set time from backend (in seconds)
    function setRunningTime(totalSeconds) {
        elapsedTime = totalSeconds;
        updateTimeDisplay(totalSeconds);
        console.log('Running time set to:', totalSeconds, 'seconds');
    }
    
    // Function to set time from backend (HH:MM:SS format)
    function setRunningTimeFromString(timeString) {
        const parts = timeString.split(':');
        if (parts.length === 3) {
            const hours = parseInt(parts[0]) || 0;
            const minutes = parseInt(parts[1]) || 0;
            const seconds = parseInt(parts[2]) || 0;
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            setRunningTime(totalSeconds);
        }
    }
    
    // Progress bar update function (for backend integration)
    function updateProgress(percentage) {
        const progressFill = document.querySelector('.progress-fill');
        const progressPercentage = document.querySelector('.progress-percentage');
        
        if (progressFill && progressPercentage) {
            // Ensure percentage is between 0 and 100
            percentage = Math.max(0, Math.min(100, percentage));
            
            // Round to nearest integer for display (10.1% = 10%, 10.6% = 11%)
            const displayPercentage = Math.round(percentage);
            
            // Update progress bar width with exact percentage (1% accuracy)
            progressFill.style.width = percentage + '%';
            progressFill.setAttribute('data-progress', percentage);
            
            // Update percentage text with rounded integer
            progressPercentage.textContent = displayPercentage + '%';
            
            console.log('Progress updated to:', percentage + '% (displayed as ' + displayPercentage + '%)');
        }
    }
    
    // Example: Simulate progress updates (remove this in production)
    // Uncomment the following lines to test progress bar animation
    /*
    let currentProgress = 0;
    setInterval(() => {
        currentProgress += 0.5; // Test with decimal increments
        if (currentProgress > 100) currentProgress = 0;
        updateProgress(currentProgress);
    }, 100);
    */
    
    // Backend Integration Examples:
    // updateProgress(10.1);  // Shows as 10%
    // updateProgress(10.6);  // Shows as 11%
    // updateProgress(45.3);  // Shows as 45%
    // updateProgress(67.8);  // Shows as 68%
    
    // Slider functionality
    function initializeSliders() {
        // Rounds slider
        const roundsSlider = document.getElementById('rounds-slider');
        const roundsInput = document.getElementById('rounds-input');
        const roundsTrack = document.querySelector('.rounds-track');
        const roundsThumb = document.querySelector('.rounds-thumb');
        
        // Epochs slider
        const epochsSlider = document.getElementById('epochs-slider');
        const epochsInput = document.getElementById('epochs-input');
        const epochsTrack = document.querySelector('.epochs-track');
        const epochsThumb = document.querySelector('.epochs-thumb');
        
        // Update slider progress visual
        function updateSliderProgress(slider, track, thumb, value) {
            const min = parseInt(slider.min);
            const max = parseInt(slider.max);
            const percentage = ((value - min) / (max - min)) * 100;
            
            // Update CSS custom properties for both track and thumb
            track.style.setProperty('--progress', percentage + '%');
            thumb.style.setProperty('--progress', percentage + '%');
            
            // Force a repaint to ensure smooth transition
            track.offsetHeight;
        }
        
        // Rounds slider events
        if (roundsSlider && roundsInput) {
            // Initialize
            updateSliderProgress(roundsSlider, roundsTrack, roundsThumb, roundsSlider.value);
            
            roundsSlider.addEventListener('input', function() {
                roundsInput.value = this.value;
                updateSliderProgress(this, roundsTrack, roundsThumb, this.value);
                console.log('Rounds set to:', this.value);
            });
            
            roundsInput.addEventListener('input', function() {
                const value = Math.max(1, Math.min(100, parseInt(this.value) || 1));
                this.value = value;
                roundsSlider.value = value;
                updateSliderProgress(roundsSlider, roundsTrack, roundsThumb, value);
                console.log('Rounds set to:', value);
            });
        }
        
        // Epochs slider events
        if (epochsSlider && epochsInput) {
            // Initialize
            updateSliderProgress(epochsSlider, epochsTrack, epochsThumb, epochsSlider.value);
            
            epochsSlider.addEventListener('input', function() {
                epochsInput.value = this.value;
                updateSliderProgress(this, epochsTrack, epochsThumb, this.value);
                console.log('Epochs set to:', this.value);
            });
            
            epochsInput.addEventListener('input', function() {
                const value = Math.max(1, Math.min(100, parseInt(this.value) || 1));
                this.value = value;
                epochsSlider.value = value;
                updateSliderProgress(epochsSlider, epochsTrack, epochsThumb, value);
                console.log('Epochs set to:', value);
            });
        }
    }
    
    // Initialize sliders
    initializeSliders();
    
    // Dataset selection functionality
    const datasets = document.querySelectorAll('.dataset-box');
    datasets.forEach(dataset => {
        dataset.addEventListener('click', function() {
            // Remove active from all datasets
            datasets.forEach(d => d.classList.remove('active'));
            // Add active to clicked dataset
            this.classList.add('active');
            console.log('Dataset selected:', this.querySelector('.dataset-name').textContent);
            // Calculate sample counts based on new selection
            calculateSampleCounts();
        });
    });
    
    // Update percentage button functionality to trigger sample calculation
    const dataPercentageButtons = document.querySelectorAll('.data-percentage-btn');
    dataPercentageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            dataPercentageButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            console.log('Selected data percentage:', this.textContent);
            // Calculate sample counts based on new percentage
            calculateSampleCounts();
        });
    });
    
    // Initialize sample counts on page load
    calculateSampleCounts();
    
    // Initialize architecture visualization
    setTimeout(initializeArchitectureVisualization, 500);
});

// Function to update sample counts from backend
function updateSampleCounts(trainingSamples, validationSamples, testSamples) {
    document.getElementById('training-samples').textContent = trainingSamples || '-';
    document.getElementById('validation-samples').textContent = validationSamples || '-';
    document.getElementById('test-samples').textContent = testSamples || '-';
    console.log('Sample counts updated:', { trainingSamples, validationSamples, testSamples });
}

// Function to reset sample counts to '-'
function resetSampleCounts() {
    document.getElementById('training-samples').textContent = '-';
    document.getElementById('validation-samples').textContent = '-';
    document.getElementById('test-samples').textContent = '-';
    console.log('Sample counts reset to default');
}

// Function to calculate and display sample counts based on dataset and percentage
function calculateSampleCounts() {
    const selectedDataset = document.querySelector('.dataset-box.active');
    const selectedPercentage = document.querySelector('.data-percentage-btn.selected');
    
    if (!selectedDataset || !selectedPercentage) {
        resetSampleCounts();
        return;
    }
    
    const datasetName = selectedDataset.querySelector('.dataset-name').textContent;
    const percentage = parseInt(selectedPercentage.textContent.replace('%', '')) / 100;
    
    // Dataset sample counts (you can adjust these based on actual dataset sizes)
    const datasetSizes = {
        'HAM-10K': { total: 10015, train: 0.7, val: 0.15, test: 0.15 },
        'MNIST': { total: 70000, train: 0.7, val: 0.15, test: 0.15 },
        'CIFAR-10': { total: 60000, train: 0.7, val: 0.15, test: 0.15 },
        'COCO-2017': { total: 123287, train: 0.7, val: 0.15, test: 0.15 }
    };
    
    const dataset = datasetSizes[datasetName];
    if (dataset) {
        const totalSamples = Math.floor(dataset.total * percentage);
        const trainingSamples = Math.floor(totalSamples * dataset.train);
        const validationSamples = Math.floor(totalSamples * dataset.val);
        const testSamples = Math.floor(totalSamples * dataset.test);
        
        updateSampleCounts(trainingSamples, validationSamples, testSamples);
    }
}

// Protection Controls Functionality
document.addEventListener('DOMContentLoaded', function() {
    const protectionButtons = document.querySelectorAll('.protection-btn');
    
    protectionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            // Remove selected class from all buttons
            protectionButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            // Handle defense indicator visibility
            const defenseIndicator = document.getElementById('defense-indicator');
            if (defenseIndicator) {
                if (action === 'run') {
                    defenseIndicator.classList.add('active');
                    console.log('Defense indicator activated');
                } else if (action === 'stop') {
                    defenseIndicator.classList.remove('active');
                    console.log('Defense indicator deactivated');
                }
            }
            
            // Send action to backend
            console.log('Protection action:', action);
            // Here you would typically make an API call to your backend
            // fetch('/api/protection', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ action })
            // });
        });
    });
});

// Function to update metric values and colors
function updateMetricBox(id, value) {
    const box = document.getElementById(id);
    if (!box) return;
    
    const valueElement = box.querySelector('.metric-value');
    if (valueElement) {
        valueElement.textContent = value + '%';
    }
    
    // Determine state based on value and metric type
    let state = '';
    if (id === 'age-protection' || id === 'gender-protection') {
        if (value < 35) state = 'low';
        else if (value < 70) state = 'medium';
        else state = 'high';
    } else if (id === 'age-leakage') {
        if (value < 35) state = 'low-inverse';
        else if (value < 70) state = 'medium-inverse';
        else state = 'high-inverse';
    } else if (id === 'gender-leakage') {
        if (value < 55) state = 'low-inverse';
        else if (value < 70) state = 'medium-inverse';
        else state = 'high-inverse';
    }
    
    // Update box state
    box.setAttribute('data-state', state);
}

// Example function to update all metrics (call this when receiving data from backend)
function updateAllMetrics(data) {
    if (data.ageProtection !== undefined) {
        updateMetricBox('age-protection', data.ageProtection);
    }
    if (data.genderProtection !== undefined) {
        updateMetricBox('gender-protection', data.genderProtection);
    }
    if (data.ageLeakage !== undefined) {
        updateMetricBox('age-leakage', data.ageLeakage);
    }
    if (data.genderLeakage !== undefined) {
        updateMetricBox('gender-leakage', data.genderLeakage);
    }
}

// Example of how to use the update functions:
// updateAllMetrics({
//     ageProtection: 75,
//     genderProtection: 82,
//     ageLeakage: 25,
//     genderLeakage: 45
// }); 

// Architecture Visualization Functionality
function initializeArchitectureVisualization() {
    console.log('Initializing architecture visualization...');
    
    const components = document.querySelectorAll('.draggable-component');
    const svg = document.querySelector('.connections-svg');
    const container = document.querySelector('.architecture-background');
    
    if (!svg || !container) {
        console.log('Architecture visualization elements not found');
        return;
    }
    
    let draggedElement = null;
    let offset = { x: 0, y: 0 };
    
    // Component positions for connection calculations
    const componentPositions = {};
    
    // Initialize component positions
    function updateComponentPositions() {
        let validPositions = 0;
        
        components.forEach(component => {
            const rect = component.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // Check if component has valid positioning
            if (rect.width > 0 && rect.height > 0) {
                componentPositions[component.id] = {
                    x: rect.left - containerRect.left + rect.width / 2,
                    y: rect.top - containerRect.top + rect.height / 2
                };
                validPositions++;
            }
        });
        
        // Only update connection lines if we have valid positions
        if (validPositions === components.length) {
            updateConnectionLines();
        } else {
            // Retry after a short delay if not all components are positioned
            setTimeout(updateComponentPositions, 50);
        }
    }
    
    // Update connection lines based on component positions
    function updateConnectionLines() {
        const serverPos = componentPositions['server-component'];
        const agePos = componentPositions['age-inference'];
        const genderPos = componentPositions['gender-inference'];
        const imagePos = componentPositions['image-client'];
        const tabularPos = componentPositions['tabular-client'];
        
        if (!serverPos) return;
        
        // Update each connection line pair (send and receive)
        if (agePos) {
            updateLine('server-age-line-send', serverPos, agePos);
            updateLine('server-age-line-receive', serverPos, agePos);
        }
        if (genderPos) {
            updateLine('server-gender-line-send', serverPos, genderPos);
            updateLine('server-gender-line-receive', serverPos, genderPos);
        }
        if (imagePos) {
            updateLine('server-image-line-send', serverPos, imagePos);
            updateLine('server-image-line-receive', serverPos, imagePos);
        }
        if (tabularPos) {
            updateLine('server-tabular-line-send', serverPos, tabularPos);
            updateLine('server-tabular-line-receive', serverPos, tabularPos);
        }
    }
    
    // Update individual line coordinates with proper perpendicular offset
    function updateLine(lineId, startPos, endPos) {
        const line = document.getElementById(lineId);
        if (line) {
            // Calculate the direction vector
            const dx = endPos.x - startPos.x;
            const dy = endPos.y - startPos.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate perpendicular offset (3px spacing)
            const offsetDistance = 5;
            const perpX = (-dy / length) * offsetDistance;
            const perpY = (dx / length) * offsetDistance;
            
            // Apply offset based on line type (send vs receive)
            let offsetX = 0;
            let offsetY = 0;
            
            if (lineId.includes('-send')) {
                // Send lines get positive offset
                offsetX = perpX;
                offsetY = perpY;
            } else if (lineId.includes('-receive')) {
                // Receive lines get negative offset (opposite direction)
                offsetX = -perpX;
                offsetY = -perpY;
            }
            
            line.setAttribute('x1', startPos.x + offsetX);
            line.setAttribute('y1', startPos.y + offsetY);
            line.setAttribute('x2', endPos.x + offsetX);
            line.setAttribute('y2', endPos.y + offsetY);
        }
    }
    
    // Mouse down event handler
    function handleMouseDown(e) {
        if (e.target.closest('.draggable-component')) {
            draggedElement = e.target.closest('.draggable-component');
            draggedElement.classList.add('dragging');
            
            // Pause connection line animations during dragging
            document.querySelectorAll('.connection-line').forEach(line => {
                line.style.animationPlayState = 'paused';
            });
            
            const rect = draggedElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            offset.x = e.clientX - rect.left;
            offset.y = e.clientY - rect.top;
            
            e.preventDefault();
            console.log('Started dragging:', draggedElement.id);
        }
    }
    
    // Mouse move event handler
    function handleMouseMove(e) {
        if (!draggedElement) return;
        
        const containerRect = container.getBoundingClientRect();
        let newX = e.clientX - containerRect.left - offset.x;
        let newY = e.clientY - containerRect.top - offset.y;
        
        // Boundary checking
        const componentWidth = draggedElement.offsetWidth;
        const componentHeight = draggedElement.offsetHeight;
        
        newX = Math.max(0, Math.min(newX, container.offsetWidth - componentWidth));
        newY = Math.max(0, Math.min(newY, container.offsetHeight - componentHeight));
        
        draggedElement.style.left = newX + 'px';
        draggedElement.style.top = newY + 'px';
        draggedElement.style.transform = 'none'; // Remove initial transform
        
        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(updateComponentPositions);
    }
    
    // Mouse up event handler
    function handleMouseUp(e) {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            
            // Resume connection line animations after dragging
            document.querySelectorAll('.connection-line').forEach(line => {
                line.style.animationPlayState = 'running';
            });
            
            console.log('Stopped dragging:', draggedElement.id);
            draggedElement = null;
        }
    }
    
    // Add event listeners
    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Initialize positions and connections with multiple attempts
    const initializeConnections = () => {
        updateComponentPositions();
        // Double-check after a short delay to ensure proper initialization
        setTimeout(() => {
            updateComponentPositions();
        }, 200);
    };
    
    // Initial setup
    setTimeout(initializeConnections, 100);
    
    // Backup initialization on window load
    window.addEventListener('load', () => {
        setTimeout(initializeConnections, 100);
    });
    
    // Update connections on window resize
    window.addEventListener('resize', () => {
        setTimeout(updateComponentPositions, 100);
    });
    
    console.log('Architecture visualization initialized');
}

// Add architecture visualization to existing DOMContentLoaded
// (This will be called from the main DOMContentLoaded function) 