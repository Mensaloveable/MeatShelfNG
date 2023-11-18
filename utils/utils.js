module.exports.toTitleCase = (str) => {
    str = str.trim();
    return str.replace(/\w\S*/g, function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    });
  }
  
  