module.exports = function(handlebars) {
  handlebars.registerHelper("json", function(context) {
    return JSON.stringify(context);
  });

  handlebars.registerHelper("lowerFirstLetter", function(context) {
    return context.charAt(0).toLowerCase() + context.slice(1);
  });

  handlebars.registerHelper("upperFirstLetter", function(context) {
    return context.charAt(0).toUpperCase() + context.slice(1);
  });

  handlebars.registerHelper("contains", function(needle, haystack, options) {
    needle = handlebars.escapeExpression(needle);
    haystack = handlebars.escapeExpression(haystack);
    return haystack.indexOf(needle) > -1 ? options.fn(this) : options.inverse(this);
  });

  handlebars.registerHelper("isRef", function(needle, options) {
    return needle.$ref ? options.fn(this) : options.inverse(this);
  });
};
