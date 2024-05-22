// prettier-ignore
const transliteration = {
  'а': 'a', 'аь': 'ä', 'б': 'b', 'в': 'v', 'г': 'g', 'гӏ': 'ġ', 'ц': 'c', 'цӏ': 'ċ', 'д': 'd',
  'е': 'e', 'ё': 'ö', 'ж': 'ƶ', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'кх': 'q', 'къ': 'q̇',
  'кӏ': 'k̇', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'оь': 'ö', 'п': 'p', 'пӏ': 'ṗ', 'р': 'r',
  'с': 's', 'т': 't', 'тӏ': 'ṫ', 'у': 'u', 'уь': 'ü', 'ф': 'f', 'х': 'x', 'хь': 'ẋ', 'хӏ': 'h',
  'ч': 'ç', 'чӏ': 'ç̇', 'ш': 'ş', 'щ': 'ş', 'ъ': 'ə', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'ӏ': 'j', 'Ӏ': 'J', 'ккх': 'qq', 'ккъ': 'q̇q̇', 'юь': 'yü', 'яь': 'yä'
};

function applyTransliteration(w) {
  const word = w.toLowerCase();
  let result = '';
  let i = 0;
  while (i < word.length) {
    let match = null;
    for (let key of [
      word.substring(i, i + 3),
      word.substring(i, i + 2),
      word.substring(i, i + 1),
    ]) {
      if (transliteration.hasOwnProperty(key)) {
        if (
          key === 'ъ' &&
          i + 1 < word.length &&
          'еёюя'.includes(word[i + 1])
        ) {
          if (i > 0 && word[i - 1] === 'к') {
            match = 'q̇';
          } else {
            match = ''; // 'ъ' is null before these characters unless after 'к'
          }
        } else if (key === 'е') {
          if (i === 0) {
            match = 'ye'; // 'е' at the start of the word
          } else if (i > 0) {
            if (
              word[i - 1] === 'ъ' &&
              (i < 2 || word.substring(i - 2, i) !== 'къ')
            ) {
              match = 'ye'; // 'е' following 'ъ' that does not follow 'къ'
            } else {
              match = transliteration[key]; // Regular transliteration for 'е'
            }
          } else {
            match = transliteration[key];
          }
        } else if (key === 'н' && i === word.length - 1) {
          match = 'ŋ'; // 'н' at the end of the word
        } else {
          match = transliteration[key];
        }
        if (match !== null) {
          result += match;
          i += key.length;
          break;
        }
      }
    }
    if (match === null) {
      result += word[i]; // Add the character as is if no match was found
      i++; // Move to next character
    }
  }
  return result;
}

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function updateQueryParameter(name, value) {
  const url = new URL(window.location.href);
  url.searchParams.set(name, value);
  window.history.replaceState(null, null, url);
}

function handleTransliteration() {
  const input = document.getElementById('transliteration-input').value;
  const words = input.split(' '); // Split input into words
  const transliteratedWords = words.map(word => applyTransliteration(word)); // Transliterate each word
  const output = transliteratedWords.join(' '); // Join transliterated words into a single string
  document.getElementById('transliteration-output').textContent = output;
  updateQueryParameter('text', input);
}

document.getElementById('transliterate-button').addEventListener('click', handleTransliteration);

// Update query parameter on input change
document.getElementById('transliteration-input').addEventListener('input', (event) => {
  updateQueryParameter('text', event.target.value);
});

// On page load, check for the query parameter and set the input value if present
document.addEventListener('DOMContentLoaded', () => {
  const inputText = getQueryParameter('text');
  if (inputText) {
    document.getElementById('transliteration-input').value = decodeURIComponent(inputText);
    handleTransliteration(); // Transliterate the pre-filled input
  }
});