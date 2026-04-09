const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../utilities/index.js');
let content = fs.readFileSync(filePath, 'utf8');

const middleware = `
/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
`;

if (content.includes('module.exports = Util')) {
    content = content.replace('module.exports = Util', middleware + '\nmodule.exports = Util');
    fs.writeFileSync(filePath, content);
    console.log('Successfully updated utilities/index.js');
} else {
    console.error('Could not find module.exports = Util');
    process.exit(1);
}
