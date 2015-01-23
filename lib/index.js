

function genGuid (len) {

  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var ret = '', idx = 0;

  while (idx < len) {
    ret += chars[parseInt(Math.random() * 62)];
  }

  return ret;
}

module.exports = {
  genGuid: genGuid
};