import emojiData from '../../data/emoji-data.json';

export function emojify(input: string): string {
  const words = input.split(' ');
  let result = '';

  for (const word of words) {
    const emojis = emojiData[word.toLowerCase()];
    let chosenEmoji = ''; // Initialize with an empty string

    if (emojis && typeof emojis === 'object') {
      for (const emojiKey of Object.keys(emojis)) {
        if ([...emojiKey].length === 1) {
          chosenEmoji = emojiKey;
          break; // Found a single emoji, break the loop
        }
      }
    }

    // If no single emoji is found, use the original word
    result += (chosenEmoji || word) + ' ';
  }

  // Trim the trailing space and return the result
  return result.trim();
}