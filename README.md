# AI-Based Resume Ranking System

A beautiful, modern web application for intelligent recruitment and resume ranking using AI technology.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Drag & Drop Upload**: Easy PDF resume upload with drag and drop functionality
- **Job Description Form**: Comprehensive job posting and requirements input
- **AI-Powered Ranking**: Intelligent resume analysis and candidate scoring
- **Skills Matching**: Visual skill matching between job requirements and candidates
- **Real-time Feedback**: Interactive notifications and loading states
- **Mobile Responsive**: Works perfectly on all device sizes

## 📁 Project Structure

```
/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js          # JavaScript functionality
└── README.md          # Project documentation
```

## 🎯 How to Use

### 1. Setup
- Simply open `index.html` in any modern web browser
- No installation or server setup required!

### 2. Job Description
1. **Job Title**: Enter the position title (e.g., "Senior Software Engineer")
2. **Job Description**: Paste the complete job description including:
   - Role responsibilities
   - Required qualifications
   - Experience requirements
   - Company information
3. **Key Skills**: Add comma-separated skills (e.g., "JavaScript, React, Node.js, Python")

### 3. Upload Resumes
- **Drag & Drop**: Drag PDF files directly onto the upload area
- **Browse Files**: Click "browse files" to select PDFs from your computer
- **Multiple Files**: Upload multiple resumes at once
- **File Management**: Remove individual files if needed

### 4. Start Analysis
- Click the "Start Ranking" button to begin AI analysis
- Wait for the analysis to complete (simulation takes ~3 seconds)
- View ranked results with detailed candidate information

### 5. Review Results
- **Ranking**: Candidates are automatically sorted by match score
- **Score Badges**: Color-coded scores (Green: 80%+, Yellow: 70-80%, Red: <70%)
- **Candidate Details**: View experience, education, location, and contact info
- **Skills Matching**: See which skills match job requirements (highlighted in green)

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#4ade80)
- **Warning**: Amber (#fbbf24)
- **Danger**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear heading and text size relationships
- **Readability**: Optimal contrast and spacing

### Interactions
- **Hover Effects**: Smooth transitions on cards and buttons
- **Loading States**: Professional spinner with contextual messaging
- **Notifications**: Toast-style notifications for user feedback
- **Animations**: Subtle micro-interactions throughout

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Start analysis (when ready)
- **Ctrl/Cmd + Backspace**: Clear all data

## 🔧 Technical Features

### File Handling
- PDF validation and filtering
- Duplicate file detection
- File size formatting
- Drag and drop with visual feedback

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Cross-browser compatibility

### Performance
- Optimized CSS with custom properties
- Efficient DOM manipulation
- Smooth animations with CSS transforms
- Lightweight dependencies (only Font Awesome icons)

## 🎭 Mock Data Generation

The current version generates realistic mock data for demonstration:
- **Scores**: Random scores between 70-100%
- **Experience**: 1-8 years of experience
- **Education**: Bachelor's, Master's, or PhD
- **Skills**: Mix of job-relevant and general technical skills
- **Locations**: Major tech cities and remote options

## 🚀 Future Enhancements

This frontend is ready for backend integration:
- PDF text extraction and parsing
- Real AI/ML model integration for ranking
- Database storage for job posts and candidates
- User authentication and role management
- Advanced filtering and search capabilities
- Export functionality for results
- Email integration for candidate outreach

## 🛠️ Customization

### Colors
Modify CSS custom properties in `:root` to change the color scheme:
```css
:root {
    --primary-color: #667eea;
    --success-color: #4ade80;
    /* ... etc */
}
```

### Styling
- All styles are contained in `styles.css`
- Uses CSS Grid and Flexbox for layouts
- BEM-like naming convention for CSS classes

### Functionality
- Core logic is in `script.js`
- Modular functions for easy customization
- Well-commented code for easy understanding

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available under the MIT License.

---

**Ready to revolutionize your recruitment process? Simply open `index.html` and start ranking!** 🎯 