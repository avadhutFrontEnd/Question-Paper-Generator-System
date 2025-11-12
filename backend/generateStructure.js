const fs = require('fs');
const path = require('path');

const structure = {
  'config': ['db.js'],
  'controllers': ['subjectController.js', 'topicController.js', 'questionPaperController.js'],
  'models': ['Subject.js', 'Topic.js', 'QuestionPaper.js'],
  'routes': ['subjectRoutes.js', 'topicRoutes.js', 'questionPaperRoutes.js'],
  'utils': ['generatePaperCode.js'],
  '.': ['.env', '.gitignore', 'server.js'], // Root files
};

for (const [dir, files] of Object.entries(structure)) {
  const dirPath = path.join(process.cwd(), dir);

  if (dir !== '.' && !fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
      console.log(`Created file: ${filePath}`);
    }
  });
}
