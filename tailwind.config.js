module.exports = {
  content: ["./*.html", "**/*.ejs", "./*.js"],
  theme: {
    colors: {
      primary: '#df9334',
      bg: '#cddc39',
      white: '#FFFFFF',
      red: '#b9233e',
      green: '#304b3b',
      brown: '#8c4d41',
      black: '#000000'
    },
    fontFamily: {
      raleway: ["raleway", "sans-serif"],
      ralewayB: ["ralewayB", "sans-serif"],
    },
    gridTemplateColumns: {
      'fluid': 'repeat(auto-fit, minmax(20rem, 1fr))',
    },
  },
  plugins: [],
};
