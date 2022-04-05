const CryptoKitty = artifacts.require('CryptoKitty');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('CryptoKitty Contract', accounts => {
  const [admin] = accounts;
  let kittyOne, kittyTwo, kittyThree, cryptoKitties;
  
  beforeEach(async () => {
    cryptoKitties = await CryptoKitty.new('Crypto Kitty', 'CKT', 'https://imgur.com/');
    await Promise.all([0, 1, 2].map(() => cryptoKitties.mint({ from: admin })));
    const kitties = await Promise.all([0, 1, 2].map(kittyId => cryptoKitties.getKitty(kittyId)));    
    kittyOne = kitties[0];
    kittyTwo = kitties[1];
    kittyThree = kitties[2];
  });

  it('should deploy correctly', async () => {
    assert((await cryptoKitties.name()) === 'Crypto Kitty');
    assert((await cryptoKitties.symbol()) === 'CKT');
    assert((await cryptoKitties.balanceOf(admin)).toNumber() === 3);
  });

});
