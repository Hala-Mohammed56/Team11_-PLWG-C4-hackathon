// Global variables
let availableResumes = [];
let isAnalyzing = false;
const loadingOverlay = document.createElement('div');
loadingOverlay.className = 'loading-overlay';
loadingOverlay.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Analyzing resumes...</p>
`;
document.body.appendChild(loadingOverlay);

// Add loading overlay styles
const style = document.createElement('style');
style.textContent = `
    .loading-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: white;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Show/hide loading overlay
function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

// DOM elements
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('resultsSection');
const rankingContainer = document.getElementById('rankingContainer');

// Job form elements
const jobTitle = document.getElementById('jobTitle');
const jobDescription = document.getElementById('jobDescription');
const requiredSkills = document.getElementById('requiredSkills');

// Add notification container
const notificationContainer = document.createElement('div');
notificationContainer.className = 'notification-container';
document.body.appendChild(notificationContainer);

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
    }

    .notification {
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-bottom: 10px;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification.success {
        border-left: 4px solid #10b981;
    }

    .notification.error {
        border-left: 4px solid #ef4444;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyle);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadAllResumes();
    updateAnalyzeButton();
});

function initializeEventListeners() {
    // Button events
    analyzeBtn.addEventListener('click', startAnalysis);
    clearBtn.addEventListener('click', clearAll);
    
    // Form events
    jobTitle.addEventListener('input', updateAnalyzeButton);
    jobDescription.addEventListener('input', updateAnalyzeButton);
}

async function loadAllResumes() {
    try {
        showLoading(true);
        const response = await fetch('http://localhost:8001/list-resumes');
        const data = await response.json();
        availableResumes = data.resumes;
        showNotification('Resumes loaded successfully', 'success');
    } catch (error) {
        console.error('Error loading resumes:', error);
        showNotification('Error loading resumes', 'error');
    } finally {
        showLoading(false);
    }
}

function clearAll() {
    jobTitle.value = '';
    jobDescription.value = '';
    requiredSkills.value = '';
    resultsSection.style.display = 'none';
    updateAnalyzeButton();
    showNotification('All fields cleared', 'info');
}

function updateAnalyzeButton() {
    const hasJobDescription = jobDescription.value.trim().length > 0;
    analyzeBtn.disabled = !hasJobDescription || isAnalyzing;
}

// Analysis functions
async function startAnalysis() {
    const jobTitle = document.getElementById('jobTitle').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const requiredSkills = document.getElementById('requiredSkills').value;

    if (!jobDescription) {
        showNotification('Please enter a job description', 'error');
        return;
    }

    try {
        showLoading(true);
        const formData = new FormData();
        formData.append('job_title', jobTitle);
        formData.append('job_description', jobDescription);
        formData.append('required_skills', requiredSkills);

        const response = await fetch('http://localhost:8001/rank-resumes', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        displayResults(data.results);
        showNotification('Analysis complete!', 'success');
    } catch (error) {
        console.error('Error during analysis:', error);
        showNotification('Error during analysis: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function displayResults(results) {
    rankingContainer.innerHTML = '';
    
    // Filter and sort results
    const filteredResults = results
        .filter(candidate => candidate.score >= 60) // Filter out scores below 60%
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 20); // Get top 20 results
    
    if (filteredResults.length === 0) {
        rankingContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <h3>No Matching Candidates</h3>
                <p>No candidates met the minimum score requirement of 60%.</p>
            </div>
        `;
    } else {
        filteredResults.forEach((candidate, index) => {
            const candidateCard = document.createElement('div');
            candidateCard.className = 'candidate-card';
            
            const scoreClass = candidate.score >= 80 ? 'high-match' : 
                              candidate.score >= 70 ? 'medium-match' : 'low-match';
            
            candidateCard.innerHTML = `
                <div class="candidate-rank">#${index + 1}</div>
                <div class="candidate-info">
                    <h3>${candidate.name}</h3>
                    <div class="score-container">
                        <div class="overall-score ${scoreClass}">
                            <span class="score-label">Match Score</span>
                            <span class="score-value">${candidate.score}%</span>
                        </div>
                        <div class="detailed-scores">
                            <div class="score-item">
                                <span class="score-label">Content Similarity</span>
                                <span class="score-value">${candidate.similarity_score}%</span>
                            </div>
                            <div class="score-item">
                                <span class="score-label">Skills Match</span>
                                <span class="score-value">${candidate.skill_match_percentage}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="skills-container">
                        <h4>Matching Skills</h4>
                        <div class="skills-list">
                            ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            rankingContainer.appendChild(candidateCard);
        });
    }
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    notificationContainer.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'Enter':
                if (!analyzeBtn.disabled) {
                    event.preventDefault();
                    startAnalysis();
                }
                break;
            case 'Backspace':
                event.preventDefault();
                clearAll();
                break;
        }
    }
});

// Prevent default drag behaviors on document
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault()); 