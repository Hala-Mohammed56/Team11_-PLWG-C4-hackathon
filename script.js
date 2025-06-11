// Global variables
let uploadedFiles = [];
let isAnalyzing = false;

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadedFilesContainer = document.getElementById('uploadedFiles');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultsSection = document.getElementById('resultsSection');
const rankingContainer = document.getElementById('rankingContainer');

// Job form elements
const jobTitle = document.getElementById('jobTitle');
const jobDescription = document.getElementById('jobDescription');
const requiredSkills = document.getElementById('requiredSkills');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateAnalyzeButton();
});

function initializeEventListeners() {
    // File upload events
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Button events
    analyzeBtn.addEventListener('click', startAnalysis);
    clearBtn.addEventListener('click', clearAll);
    
    // Form events
    jobTitle.addEventListener('input', updateAnalyzeButton);
    jobDescription.addEventListener('input', updateAnalyzeButton);
    
    // Browse text click
    document.querySelector('.browse-text').addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
}

// File handling functions
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    addFiles(files);
    event.target.value = ''; // Reset input
}

function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(event.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
        showNotification('Only PDF files are allowed', 'warning');
    }
    
    if (pdfFiles.length > 0) {
        addFiles(pdfFiles);
    }
}

function addFiles(files) {
    files.forEach(file => {
        // Check if file already exists
        const existingFile = uploadedFiles.find(f => f.name === file.name && f.size === file.size);
        if (existingFile) {
            showNotification(`File "${file.name}" is already uploaded`, 'warning');
            return;
        }
        
        // Add file to array
        uploadedFiles.push(file);
        
        // Create file item element
        createFileItem(file);
    });
    
    updateAnalyzeButton();
    showNotification(`${files.length} file(s) uploaded successfully`, 'success');
}

function createFileItem(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
        <div class="file-info">
            <i class="fas fa-file-pdf"></i>
            <div>
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
        </div>
        <button class="remove-file" onclick="removeFile('${file.name}', ${file.size})">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    uploadedFilesContainer.appendChild(fileItem);
}

function removeFile(fileName, fileSize) {
    // Remove from array
    uploadedFiles = uploadedFiles.filter(file => !(file.name === fileName && file.size === fileSize));
    
    // Remove from DOM
    const fileItems = uploadedFilesContainer.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        const nameElement = item.querySelector('.file-name');
        const sizeElement = item.querySelector('.file-size');
        if (nameElement.textContent === fileName && sizeElement.textContent === formatFileSize(fileSize)) {
            item.remove();
        }
    });
    
    updateAnalyzeButton();
    showNotification('File removed', 'info');
}

function clearAll() {
    uploadedFiles = [];
    uploadedFilesContainer.innerHTML = '';
    jobTitle.value = '';
    jobDescription.value = '';
    requiredSkills.value = '';
    resultsSection.style.display = 'none';
    updateAnalyzeButton();
    showNotification('All data cleared', 'info');
}

function updateAnalyzeButton() {
    const hasFiles = uploadedFiles.length > 0;
    const hasJobDescription = jobDescription.value.trim().length > 0;
    
    analyzeBtn.disabled = !hasFiles || !hasJobDescription || isAnalyzing;
}

// Analysis functions
async function startAnalysis() {
    if (isAnalyzing) return;
    
    isAnalyzing = true;
    loadingOverlay.style.display = 'flex';
    updateAnalyzeButton();
    
    try {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate mock results
        const results = generateMockResults();
        
        // Display results
        displayResults(results);
        
        showNotification('Analysis completed successfully!', 'success');
        
    } catch (error) {
        console.error('Analysis error:', error);
        showNotification('Analysis failed. Please try again.', 'error');
    } finally {
        isAnalyzing = false;
        loadingOverlay.style.display = 'none';
        updateAnalyzeButton();
    }
}

function generateMockResults() {
    const jobSkills = requiredSkills.value.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
    const allPossibleSkills = [
        'javascript', 'python', 'react', 'nodejs', 'html', 'css', 'sql', 'java', 
        'angular', 'vue', 'mongodb', 'postgresql', 'aws', 'docker', 'kubernetes',
        'machine learning', 'data analysis', 'ui/ux design', 'project management',
        'agile', 'scrum', 'git', 'typescript', 'express', 'django', 'flask'
    ];
    
    return uploadedFiles.map((file, index) => {
        // Generate random but realistic data
        const score = Math.floor(Math.random() * 30) + 70; // 70-100 range
        const experience = Math.floor(Math.random() * 8) + 1; // 1-8 years
        const education = ['Bachelor\'s', 'Master\'s', 'PhD'][Math.floor(Math.random() * 3)];
        
        // Generate skills (some matching, some not)
        const candidateSkills = [];
        const numSkills = Math.floor(Math.random() * 8) + 5; // 5-12 skills
        
        // Add some required skills
        if (jobSkills.length > 0) {
            const matchingSkills = Math.floor(Math.random() * Math.min(jobSkills.length, 4)) + 1;
            for (let i = 0; i < matchingSkills; i++) {
                if (Math.random() > 0.3) {
                    candidateSkills.push(jobSkills[Math.floor(Math.random() * jobSkills.length)]);
                }
            }
        }
        
        // Add random skills
        while (candidateSkills.length < numSkills) {
            const skill = allPossibleSkills[Math.floor(Math.random() * allPossibleSkills.length)];
            if (!candidateSkills.includes(skill)) {
                candidateSkills.push(skill);
            }
        }
        
        return {
            id: index + 1,
            name: file.name.replace('.pdf', ''),
            fileName: file.name,
            score: score,
            experience: experience,
            education: education,
            skills: candidateSkills,
            location: ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Remote'][Math.floor(Math.random() * 5)],
            email: `${file.name.replace('.pdf', '').toLowerCase().replace(/\s+/g, '.')}@email.com`
        };
    }).sort((a, b) => b.score - a.score); // Sort by score descending
}

function displayResults(results) {
    rankingContainer.innerHTML = '';
    
    results.forEach((candidate, index) => {
        const candidateCard = createCandidateCard(candidate, index + 1);
        rankingContainer.appendChild(candidateCard);
    });
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function createCandidateCard(candidate, rank) {
    const jobSkills = requiredSkills.value.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
    
    const card = document.createElement('div');
    card.className = 'candidate-card';
    
    // Determine score color
    let scoreColor = 'var(--success-color)';
    if (candidate.score < 80) scoreColor = 'var(--warning-color)';
    if (candidate.score < 70) scoreColor = 'var(--danger-color)';
    
    card.innerHTML = `
        <div class="candidate-header">
            <div class="candidate-info">
                <h3>#${rank} ${candidate.name}</h3>
                <p>${candidate.fileName}</p>
            </div>
            <div class="score-badge" style="background: ${scoreColor}">
                ${candidate.score}%
            </div>
        </div>
        
        <div class="candidate-details">
            <div class="detail-item">
                <div class="detail-label">Experience</div>
                <div class="detail-value">${candidate.experience} years</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Education</div>
                <div class="detail-value">${candidate.education}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Location</div>
                <div class="detail-value">${candidate.location}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Email</div>
                <div class="detail-value">${candidate.email}</div>
            </div>
        </div>
        
        <div class="skills-match">
            <div class="detail-label">Skills</div>
            <div class="skills-list">
                ${candidate.skills.map(skill => {
                    const isMatched = jobSkills.some(jobSkill => 
                        skill.toLowerCase().includes(jobSkill.toLowerCase()) || 
                        jobSkill.toLowerCase().includes(skill.toLowerCase())
                    );
                    return `<span class="skill-tag ${isMatched ? 'matched' : ''}">${skill}</span>`;
                }).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        backgroundColor: getNotificationColor(type),
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'warning': return 'exclamation-triangle';
        case 'error': return 'times-circle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#10b981';
        case 'warning': return '#f59e0b';
        case 'error': return '#ef4444';
        default: return '#3b82f6';
    }
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