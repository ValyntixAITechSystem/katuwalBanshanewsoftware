// Language middleware for multi-language support
export const languageMiddleware = (req, res, next) => {
  const lang = req.headers['accept-language'] || process.env.LANGUAGE_DEFAULT || 'en';
  
  // Simple language detection
  req.lang = lang.startsWith('ne') ? 'ne' : 'en';
  
  // Language translations for common messages
  req.translations = {
    en: {
      success: 'Success',
      error: 'Error',
      notFound: 'Resource not found',
      validationFailed: 'Validation failed',
      serverError: 'Internal server error',
    },
    ne: {
      success: 'सफलता',
      error: 'त्रुटि',
      notFound: 'स्रोत फेला परेन',
      validationFailed: 'मान्यता असफल भयो',
      serverError: 'आन्तरिक सर्भर त्रुटि',
    },
  };
  
  // Helper function to translate
  req.t = (key) => {
    return req.translations[req.lang][key] || req.translations.en[key] || key;
  };
  
  next();
};