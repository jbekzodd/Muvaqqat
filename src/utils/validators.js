const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  // O'zbekiston raqami: +998901234567 yoki 901234567
  const phoneRegex = /^(\+?998)?[0-9]{9}$/;
  return phoneRegex.test(phone);
};

const validateUsername = (username) => {
  // Username: 3-20 belgi, faqat harflar, raqamlar va _
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const validateRating = (rating) => {
  return typeof rating === 'number' && rating >= 0 && rating <= 3000;
};

module.exports = {
  validateEmail,
  validatePhoneNumber,
  validateUsername,
  validateRating
};
