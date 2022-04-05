const CryptoKitty = artifacts.require('CryptoKitty');

module.exports = function(_deployer) {
  _deployer.deploy(CryptoKitty, 'Crypto Kitty', 'CKT', 'https://imgur.com/');
};
