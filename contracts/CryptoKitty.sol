// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./ERC721.sol";

contract CryptoKitty is ERC721 {
  struct Kitty {
    uint id;
    uint generation;
    uint geneA;
    uint geneB;
  }
  mapping(uint => Kitty) private kitties;
  address public admin;
  uint public nextKittyId;

  constructor(string memory _name, string memory _symbol, string memory _tokenURIBase) ERC721(_name, _symbol, _tokenURIBase) {
    admin = msg.sender;
  }

  function mint() external onlyAdmin {
    _spawnKitty(1, _random(10), _random(10));
  }

  function breed(uint kitty1Id, uint kitty2Id) external {
    require(kitty1Id < nextKittyId, "kitty one does not exist");
    require(kitty2Id < nextKittyId, "kitty two does not exist");
    require(ownerOf(kitty1Id) == msg.sender && ownerOf(kitty2Id) == msg.sender, "sender must be the owner of 2 kitties");
    
    Kitty storage kitty1 = kitties[kitty1Id];
    Kitty storage kitty2 = kitties[kitty2Id];
    uint maxGen = kitty1.generation > kitty2.generation ? kitty1.generation : kitty2.generation;
    uint geneA = _random(5) > 1 ? kitty1.geneA : kitty2.geneA;
    uint geneB = _random(5) > 1 ? kitty1.geneB : kitty2.geneB;
    _spawnKitty(maxGen + 1, geneA, geneB);
  }

  function _spawnKitty(uint _generation, uint _geneA, uint _geneB) internal {
    kitties[nextKittyId] = Kitty(nextKittyId, _generation, _geneA, _geneB);
    _mint(msg.sender, nextKittyId);
    nextKittyId++;
  }

  function getKitty(uint _kittyId) external view returns(Kitty memory) {
    return kitties[_kittyId];
  }

  function _random(uint max) internal view returns(uint) {
    return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % max;
  }

  modifier onlyAdmin() {
    require(msg.sender == admin, "only admin");
    _;
  }
}