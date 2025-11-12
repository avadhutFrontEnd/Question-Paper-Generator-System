/**
 * Generates a paper code in the format #_<SUBJECT>-<TOPIC>-<PAPER_ID>_
 * 
 * @param {String} subjectCode - Short uppercase code for the Subject
 * @param {String} topicCode - Short uppercase code for the Topic
 * @param {Number} paperId - 3-digit unique number
 * @returns {String} The formatted paper code
 */
const generatePaperCode = (subjectCode, topicCode, paperId) => {
    // Ensure paperId is a 3-digit number with leading zeros if needed
    const formattedPaperId = String(paperId).padStart(3, '0');
    
    // Return the formatted paper code
    return `#_${subjectCode}-${topicCode}-${formattedPaperId}_`;
  };
  
  module.exports = generatePaperCode;