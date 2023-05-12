const autocomplete = document.querySelector('.autocomplete');
const input = autocomplete.querySelector('.autocomplete-input');
const resultsContainer = autocomplete.querySelector('.autocomplete-results');
const resultsList = autocomplete.querySelectorAll('.autocomplete-result');

input.addEventListener('input', () => {
  resultsContainer.classList.add('active');
  resultsList.forEach(result => {
    const name = result.querySelector('.autocomplete-result-name').textContent.toLowerCase();
    const brand = result.querySelector('.autocomplete-result-brand').textContent.toLowerCase();
    const inputText = input.value.toLowerCase();
    if (name.includes(inputText) || brand.includes(inputText)) {
      result.classList.remove('hidden');
    } else {
      result.classList.add('hidden');
    }
  });
});

input.addEventListener('focus', () => {
  resultsContainer.classList.add('active');
});

input.addEventListener('blur', () => {
  resultsContainer.classList.remove('active');
});

resultsList.forEach(result => {
  result.addEventListener('click', () => {
    input.value = result.querySelector('.autocomplete-result-name').textContent;
    resultsContainer.classList.remove('active');
  });
});