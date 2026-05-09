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
        }
      };
      return res.json(mockData[language] || mockData.English);
    }

    // Use Gemini 1.5 Flash for fast analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageBuffer = fs.readFileSync(req.file.path);
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
    3. "category": One of: "Roads", "Water", "Electricity", "Waste", "Safety", "Others".
    4. "aiPriorityScore": A number from 0-100 based on severity and risk.
    5. "impactSummary": A brief summary of how this affects citizens (max 30 words).
    6. "department": The specific government department that should handle this (e.g., PWD, BESCOM, BWSSB).
    
    The text MUST be in ${language}.
    Response MUST be valid JSON only.`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    let text = response.text();
    
    // Clean JSON response
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const analysis = JSON.parse(text);

    res.json(analysis);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    // Return a fallback if AI fails
    res.status(500).json({ 
      message: "AI Analysis failed", 
      error: error.message,
      fallback: {
        title: "New Civic Issue",
        description: "Please provide details manually.",
        category: "Others"
      }
    });
  }
};
