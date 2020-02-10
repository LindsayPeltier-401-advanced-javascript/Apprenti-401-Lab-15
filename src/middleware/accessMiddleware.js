
'use strict';

module.exports = capabilities => {
  return (request, response, next) => {
    try {
      if (request.user[0].userRoles.capabilities.includes(capabilities)) {
        console.log('Welcome');
        next();
      } else {
        next(`Access Denied`);
      }
    } catch (e) {
      next('Invalid Login');
    }
  };
};