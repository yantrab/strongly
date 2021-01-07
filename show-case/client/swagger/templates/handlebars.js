module.exports = function(handlebars) {
  // Adding a custom handlebars helper: loud
  handlebars.registerHelper("json", function(context) {
    return JSON.stringify(context);
  });

  handlebars.registerHelper("contains", function(needle, haystack, options) {
    needle = handlebars.escapeExpression(needle);
    haystack = handlebars.escapeExpression(haystack);
    return haystack.indexOf(needle) > -1 ? options.fn(this) : options.inverse(this);
  });
};
