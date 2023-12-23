export async function random_sentence() {
  const wordArray = [
    'apple', 'banana', 'cherry', 'dog', 'elephant', 'flower', 'guitar', 'happy', 'island', 'jazz',
    'kangaroo', 'lemon', 'mountain', 'notebook', 'ocean', 'piano', 'quasar', 'rabbit', 'sunset', 'tiger',
    'umbrella', 'victory', 'waterfall', 'xylophone', 'yellow', 'zeppelin', 'acoustic', 'butterfly', 'captain', 'delicious',
    'elephant', 'fantastic', 'giraffe', 'happiness', 'illusion', 'jubilant', 'kaleidoscope', 'lighthouse', 'magnificent', 'nostalgia',
    'orchestra', 'paradise', 'quixotic', 'rhapsody', 'serendipity', 'tranquility', 'ultimate', 'velvet', 'whisper', 'xenial',
    'yesterday', 'zephyr', 'alchemy', 'bewilder', 'cathedral', 'dandelion', 'ethereal', 'fandango', 'gossamer', 'harmony',
    'incandescent', 'juxtapose', 'kaleidoscope', 'labyrinth', 'melancholy', 'nirvana', 'oblivion', 'paradox', 'quasar', 'reverie',
    'serendipity', 'talisman', 'umbrella', 'vivid', 'whimsical', 'xanadu', 'yearning', 'zenith', 'aplomb', 'blissful',
    'cacophony', 'dexterity', 'effervescent', 'felicity', 'gallivant', 'halcyon', 'impeccable', 'jubilant', 'kismet', 'luminescent',
    'mellifluous', 'nurturing', 'opulent', 'quintessential', 'resplendent', 'serene', 'taciturn', 'ubiquitous', 'vestige', 'whimsical',
    'xenial', 'yearning', 'zephyr', 'abracadabra', 'brouhaha', 'collywobbles', 'discombobulate', 'ersatz', 'fiddledeedee', 'gobbledygook',
    'hullabaloo', 'impetuous', 'jiggery-pokery', 'kerfuffle', 'lackadaisical', 'malarkey', 'namby-pamby', 'onomatopoeia', 'persnickety', 'quibble',
    'riffraff', 'skedaddle', 'tintinnabulation', 'ululation', 'vamoose', 'whippersnapper', 'xylophone', 'yokel', 'zephyr', 'abecedarian',
    'bailiwick', 'canoodle', 'doozy', 'ersatz', 'fandango', 'gazebo', 'hullabaloo', 'impetuous', 'jiggery-pokery', 'kerfuffle',
    'lackadaisical', 'malarkey', 'namby-pamby', 'onomatopoeia', 'persnickety', 'quibble', 'riffraff', 'skedaddle', 'tintinnabulation', 'ululation',
    'vamoose', 'whippersnapper', 'xylophone', 'yokel', 'zephyr', 'abecedarian', 'bailiwick', 'canoodle', 'doozy', 'ersatz',
    'fandango', 'gazebo', 'hullabaloo', 'impetuous', 'jiggery-pokery', 'kerfuffle', 'lackadaisical', 'malarkey', 'namby-pamby', 'onomatopoeia',
    'persnickety', 'quibble', 'riffraff', 'skedaddle', 'tintinnabulation', 'ululation', 'vamoose', 'whippersnapper', 'xylophone', 'yokel',
    'zephyr', 'abecedarian', 'bailiwick', 'canoodle', 'doozy', 'ersatz', 'fandango', 'gazebo', 'hullabaloo', 'impetuous',
    'jiggery-pokery', 'kerfuffle', 'lackadaisical', 'malarkey', 'namby-pamby', 'onomatopoeia', 'persnickety', 'quibble', 'riffraff', 'skedaddle',
  ];

  const sentenceLength = Math.floor(Math.random() * (12 - 6 + 1)) + 6;
  let randomSentence = '';

  for (let i = 0; i < sentenceLength; i++) {
    const randomWord = wordArray[Math.floor(Math.random() * wordArray.length)];
    randomSentence += randomWord + ' ';
  }

  return randomSentence.trim();
}