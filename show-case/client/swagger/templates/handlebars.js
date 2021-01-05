module.exports = function(handlebars) {
  // Adding a custom handlebars helper: loud
  handlebars.registerHelper("json", function(context) {
    return JSON.stringify(context);
  });
};
