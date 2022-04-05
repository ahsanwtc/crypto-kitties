const { expectRevert } = require('@openzeppelin/test-helpers');
const CryptoKitty = artifacts.require('CryptoKitty');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('CryptoKitty Contract', accounts => {
  const [admin, user] = accounts;
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

  it('should NOT mint when non admin calls', async () => {
    await expectRevert(
      cryptoKitties.mint({ from: user }),
      'only admin'
    );
  });

  it('should breed a new kitty', async () => {
    await cryptoKitties.breed(kittyOne.id, kittyTwo.id, { from: admin });
    const kitty = await cryptoKitties.getKitty(3);
    assert((await cryptoKitties.balanceOf(admin)).toNumber() === 4);
    assert(kitty.generation === '2');
  });

  it('should NOT breed a kitty if owner does not own two kitties', async () => {
    await cryptoKitties.transferFrom(admin, user, kittyOne.id, { from: admin });
    await expectRevert(
      cryptoKitties.breed(kittyOne.id, kittyTwo.id, { from: admin }),
      'sender must be the owner of 2 kitties'
    );
  });

  it('should NOT breed a kitty if kitty does not exist', async () => {
    await expectRevert(
      cryptoKitties.breed(4, kittyOne.id, { from: admin }),
      'kitty one does not exist'
    );

    await expectRevert(
      cryptoKitties.breed(kittyOne.id, 4, { from: admin }),
      'kitty two does not exist'
    );
  });

});
