const apiKey = process.env.AI_API_KEY;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(apiKey);

const updatedGenres = [
  "Pop",
  "Rock",
  "Jazz",
  "Hip Hop",
  "Country",
  "Romantic",
  "Classical",
  "Electronic",
  "R&B",
  "Folk",
  "Blues",
  "Reggae",
  "Metal",
  "Indie",
  "Alternative",
  "Punk",
  "Soul",
  "Dance",
  "Ambient",
  "Gospel",
  "Funk",
  "Disco",
  "Techno",
  "Trance",
  "Ska",
  "House",
  "Trap",
  "Dubstep",
  "Chillout",
  "Experimental",
  "World",
  "Latin",
  "Opera",
  "Chamber",
  "Acoustic",
  "New Age",
  "Grime",
  "Drum and Bass",
  "Psychedelic",
  "Space",
  "Post-Rock",
  "Progressive",
  "Hardcore",
  "Breakbeat",
  "IDM (Intelligent Dance Music)",
  "Glitch",
  "Noise",
  "Darkwave",
  "Vaporwave",
];

async function moodDetector(moods) {
  // console.log(process.env.AI_API_KEY);

  if (!moods || !Array.isArray(moods) || moods.length === 0) {
    throw new Error("Invalid or empty moods array");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const generatedContent = [];

  for (const mood of moods) {
    let length = Math.max(Math.ceil(mood.length / 10), 10);

    const prompt = `Please provide up to 10 most relevant genres for my mood: ${mood}.
Available genres: ${updatedGenres.join(
      ", "
    )}. The different genres should be seperated by white-spaces ONLY`;

    const result = await model.generateContent(prompt, { length: length });
    const response = await result.response;
    const text = await response.text();

    const genres = text.split(/[\s\n]+/).filter((genre) => genre.trim() !== "");
    generatedContent.push(genres);
  }

  return generatedContent;
}

async function response(prompt) {
  if (!prompt) {
    throw new Error("Please provide a prompt");
  }
  if (prompt.length < 0) {
    throw new Error("The prompt is too small");
  } else if (prompt.length > 300) {
    throw new Error("The prompt is too big");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
}

module.exports = {
  moodDetector,
  response,
};
