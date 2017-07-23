const axios = require('axios');

function getWords() {
  return axios
    .get(
      'http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    )
    .then(function(response) {
      return response.data;
    })
    .catch(function(reject) {
      console.error(reject);
    });
}

function getDefinitions(word) {
  return axios
    .get(
      'http://api.wordnik.com:80/v4/word.json/' +
        word +
        '/definitions?limit=200&includeRelated=true&sourceDictionaries=webster&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    )
    .then(function(response) {
      return response.data;
    })
    .catch(function(reject) {
      console.error(reject);
    });
}

function matchDefinitions() {
  return getWords()
    .then(resp =>
      resp.map((word, index) => {
        return getDefinitions(word.word).then(resp => {
          let defs = resp;
          return defs.map(def => {
            words['definition'] = def.text;
            // foo.push(word.word);
            return words;
          });
        });
      })
    )
    .catch(err => console.error(err));
}

module.exports.data = [
  { id: 1, title: '', definition: '', image: 'https://unsplash.it/450/300/?random' },
  { id: 2, title: '', definition: '', image: 'https://unsplash.it/600/400/?random' },
  { id: 3, title: '', definition: '', image: 'https://unsplash.it/300/200/?random' },
  { id: 4, title: '', definition: '', image: 'https://unsplash.it/900/600/?random' }
];

module.exports.getWords = getWords;
