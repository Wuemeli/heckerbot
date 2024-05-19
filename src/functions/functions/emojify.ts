import emojiData from '../../data/emoji-data.json';

export function emojify(input: string): string {
  const words = input.split(' ');
  let result = '';

  for (const word of words) {
    const emojis = emojiData[word.toLowerCase()];
    let chosenEmoji = '';

    if (emojis && typeof emojis === 'object') {
      for (const emojiKey of Object.keys(emojis)) {
        if ([...emojiKey].length === 1) {
          chosenEmoji = emojiKey;
          break;
        }
      }
    }

    result += (chosenEmoji || word) + ' ';
  }

  return result.trim();
}