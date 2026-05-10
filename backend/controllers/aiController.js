const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { language = "English" } = req.body;

    // MOCK MODE: If no API key is provided, return a realistic mock for demo purposes
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      console.log("Using Mock AI Mode (No API Key detected)");
      const mockData = {
        English: { 
          title: "Critical Road Damage", 
          description: "Multiple deep potholes detected near a busy intersection. Potential for vehicle damage and accidents is high.", 
          category: "Roads",
          aiPriorityScore: 88,
          impactSummary: "Affects approximately 500+ daily commuters. High risk during monsoon.",
          department: "Public Works Department (PWD)"
        },
        Kannada: { 
          title: "ರಸ್ತೆ ಹಾನಿ", 
          description: "ಬಿಬಿಎಂಪಿ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ರಸ್ತೆ ಗುಂಡಿಗಳು ಹೆಚ್ಚಾಗಿವೆ.", 
          category: "Roads",
          aiPriorityScore: 85,
          impactSummary: "ದಿನನಿತ್ಯದ ಪ್ರಯಾಣಿಕರಿಗೆ ತೊಂದರೆಯಾಗುತ್ತಿದೆ.",
          department: "ಲೋಕೋಪಯೋಗಿ ಇಲಾಖೆ"
        },
        Hindi: { 
          title: "सड़क की गंभीर क्षति", 
          description: "सड़क पर गहरे गड्ढे हैं।", 
          category: "Roads",
          aiPriorityScore: 85,
          impactSummary: "यातायात में बाधा उत्पन्न हो रही है।",
          department: "लोक निर्माण विभाग"
        },
        Tamil: { 
          title: "கடுமையான சாலை சேதம்", 
          description: "பரபரப்பான சந்திப்புக்கு அருகில் பல ஆழமான பள்ளங்கள் கண்டறியப்பட்டன.", 
          category: "Roads",
          aiPriorityScore: 85,
          impactSummary: "தினசரி பயணிகளை பாதிக்கிறது.",
          department: "பொதுப்பணித்துறை"
        },
        Telugu: { 
          title: "తీవ్రమైన రహదారి నష్టం", 
          description: "రద్దీగా ఉండే కూడలికి సమీపంలో లోతైన గుంతలు ఉన్నాయి.", 
          category: "Roads",
          aiPriorityScore: 85,
          impactSummary: "రోజువారీ ప్రయాణికులకు ఇబ్బంది.",
          department: "ప్రజాపనుల శాఖ"
        }
      };
      
      const responseData = mockData[language] || mockData.English;
      return res.json({ ...responseData, isMock: true });
    }

    // Use Gemini 2.5 Flash for fast analysis
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Get image buffer safely
    let imageBuffer;
    if (req.file.buffer) {
      imageBuffer = req.file.buffer;
    } else if (req.file.path) {
      imageBuffer = fs.readFileSync(req.file.path);
    } else {
      throw new Error("No image data found in upload.");
    }

    const imageData = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `Analyze this image of a civic/municipal problem. 
    Return a JSON object with:
    1. "title": A concise title (max 10 words).
    2. "description": A detailed description (max 50 words).
    3. "category": EXACTLY one of: "Roads", "Water", "Electricity", "Waste", "Sanitation", "Safety", "Other". (CRITICAL: THIS FIELD MUST BE ENGLISH ONLY).
    4. "aiPriorityScore": A number from 0-100 based on severity and risk.
    5. "impactSummary": A brief summary of how this affects citizens (max 30 words).
    6. "department": The specific government department that should handle this (e.g., PWD, BESCOM, BWSSB).
    
    The title, description, and impactSummary MUST be in ${language}.
    Response MUST be valid JSON only.`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    let text = response.text();
    console.log("RAW AI RESPONSE:", text);
    
    // Safely extract JSON even if AI adds conversational text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON format.");
    }
    
    const analysis = JSON.parse(jsonMatch[0]);

    // MAP TRANSLATED CATEGORIES BACK TO ENGLISH ENUMS
    const categoryMap = {
      // Kannada
      'ರಸ್ತೆಗಳು': 'Roads', 'ರಸ್ತೆ': 'Roads',
      'ನೀರು': 'Water', 'ಜಲ': 'Water',
      'ವಿದ್ಯುತ್': 'Electricity', 'ಕರೆಂಟ್': 'Electricity',
      'ತ್ಯಾಜ್ಯ': 'Waste', 'ಕಸ': 'Waste',
      'ನೈರ್ಮಲ್ಯ': 'Sanitation', 'ಶೌಚಾಲಯ': 'Sanitation',
      'ಸುರಕ್ಷತೆ': 'Safety', 'ರಕ್ಷಣೆ': 'Safety',
      'ಇತರೆ': 'Other', 'ಇತರ': 'Other',
      // Hindi
      'सड़क': 'Roads', 'मार्ग': 'Roads',
      'पानी': 'Water', 'जल': 'Water',
      'बिजली': 'Electricity', 'विद्युत': 'Electricity',
      'कचरा': 'Waste', 'अपशिष्ट': 'Waste',
      'स्वच्छता': 'Sanitation', 'सफाई': 'Sanitation',
      'सुरक्षा': 'Safety', 'बचाव': 'Safety',
      'अन्य': 'Other'
    };

    if (analysis.category && categoryMap[analysis.category]) {
      analysis.category = categoryMap[analysis.category];
    }

    res.json(analysis);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Send the actual error message to the frontend so the user can see it
    res.status(500).json({ 
      message: "AI Analysis failed", 
      error: error.message || "Unknown server error",
      fallback: {
        title: "New Civic Issue",
        description: "Please provide details manually.",
        category: "Others"
      }
    });
  }
};
