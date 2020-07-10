/// Escape certain special characters for an SQL string

module.exports = (string) => {
   return string.replace(/['",`\\;]/g, "\\$&");
};
