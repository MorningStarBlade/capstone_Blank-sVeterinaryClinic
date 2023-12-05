
function searchContent() {
  var input = document.getElementById('searchBar');
  var filter = input.value.toUpperCase();
  var bodyContent = document.getElementById('body');
  var textElements = bodyContent.querySelectorAll('h1, h2, h3, h4, p, li');

  textElements.forEach(function(element) {
    if (element.textContent.toUpperCase().indexOf(filter) > -1) {
      element.style.display = '';
    } else {
      element.style.display = 'none';
    }
  });
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var debouncedSearch = debounce(function() {
  searchContent();
}, 250);

document.getElementById('searchBar').addEventListener('input', debouncedSearch);

function clearSearch() {
  document.getElementById('searchBar').value = '';
  var textElements = document.querySelectorAll('h1, h2, h3, h4, p, li');
  textElements.forEach(function(element) {
    element.style.display = ''; 
    element.style.background = 'none'; 
  });
}


function searchContent() {
  var input = document.getElementById('searchBar');
  var filter = input.value.toUpperCase();
  var sections = document.querySelectorAll('section');

  sections.forEach(function(section) {
    var textElements = section.querySelectorAll('h1, h2, h3, h4, p, li');
    var textFound = false;

    textElements.forEach(function(element) {
      var textValue = element.textContent || element.innerText;
      if (textValue.toUpperCase().indexOf(filter) > -1) {
        textFound = true;
        element.style.background = 'yellow'; // Highlight matching text
      } else {
        element.style.background = 'none'; // Remove highlight
      }
    });

    section.style.display = textFound ? '' : 'none';
  });
}

