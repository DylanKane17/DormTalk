import fs from "fs";
import path from "path";

let badWordsList = null;

/**
 * Load bad words list from file
 * Cached after first load for performance
 */
function loadBadWords() {
  if (badWordsList) {
    return badWordsList;
  }

  try {
    const filePath = path.join(process.cwd(), "src", "assets", "bad_words.txt");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    badWordsList = fileContent
      .split("\n")
      .map((word) => word.trim().toLowerCase())
      .filter((word) => word.length > 0);
    return badWordsList;
  } catch (error) {
    console.error("Error loading bad words list:", error);
    return [];
  }
}

/**
 * Check if text contains any bad words
 * @param {string} text - The text to check
 * @returns {Object} - { isClean: boolean, foundWords: string[] }
 */
export function checkForBadWords(text) {
  if (!text || typeof text !== "string") {
    return { isClean: true, foundWords: [] };
  }

  const badWords = loadBadWords();
  const foundWords = [];
  const lowerText = text.toLowerCase();

  // Check for each bad word
  for (const badWord of badWords) {
    // Use word boundary regex to match ONLY whole words
    // This prevents false positives like "hell" matching in "hello"
    const regex = new RegExp(`\\b${badWord}\\b`, "i");
    if (regex.test(lowerText)) {
      foundWords.push(badWord);
    }
  }

  return {
    isClean: foundWords.length === 0,
    foundWords: foundWords,
  };
}

/**
 * Validate content for moderation
 * @param {string} content - The content to validate
 * @param {string} fieldName - Name of the field being validated (for error messages)
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export function validateContent(content, fieldName = "Content") {
  if (!content || !content.trim()) {
    return { valid: false, error: `${fieldName} is required.` };
  }

  const moderationCheck = checkForBadWords(content);

  if (!moderationCheck.isClean) {
    return {
      valid: false,
      error: `${fieldName} contains inappropriate language. Please remove offensive words and try again.`,
    };
  }

  return { valid: true, error: null };
}
