// Video 145 Data Sanitization
const sanitizeHtml = require('sanitize-html');

// recursive function to sanitize deeply nested objects against XSS attacks
const deepSanitize = function (val) {
  if (typeof val === 'string') {
    return sanitizeHtml(val, {
      allowedTags: [
        'b',
        'i',
        'em',
        'strong',
        'ul',
        'ol',
        'li',
        'p',
        'br',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
      ],
      allowedAttributes: {
        a: ['href', 'target'],
        img: ['src', 'alt', 'width', 'height'],
      },
      allowedSchemes: ['http', 'https'],
    });
  }
  if (Array.isArray(val)) {
    return val.map((item) => deepSanitize(item));
  }
  if (typeof val === 'object' && val !== null) {
    Object.keys(val).forEach((key) => {
      val[key] = deepSanitize(val[key]);
    });
  }
};

module.exports = deepSanitize;
