const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  fgBlack: "\x1b[30m",
  fgRed: "\x1b[31m",
  fgGreen: "\x1b[32m",
  fgYellow: "\x1b[33m",
  fgBlue: "\x1b[34m",
  fgMagenta: "\x1b[35m",
  fgCyan: "\x1b[36m",
  fgWhite: "\x1b[37m",
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};
const history = [];

const log = (text, color, bgColor) => {
  const textColor = colors[color] || "";
  const backgroundColor = colors[bgColor] || "";
  const texts = `${backgroundColor}${textColor}${text}${colors.reset}`;
  history.push(texts);
  console.log(texts);
};

function calculateLevenshteinDistance(s1, s2) {
  // Function to calculate Levenshtein distance between two strings
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = [];

  // Initialize the matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Calculate Levenshtein distance
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[len1][len2];
}

function partseJsonc(jsonc) {
  // Remove single line comments
  let json = jsonc.replace(/\/\/.*$/gm, "");
  // Remove multi-line comments
  json = json.replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(json);
}

module.exports = {
  log,
  partseJsonc,
  history,
  calculateLevenshteinDistance,
};
