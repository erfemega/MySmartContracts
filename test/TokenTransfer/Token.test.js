const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const hardhatToken = await Token.deploy();
    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});

describe("Transactions", function() {
  let owner;
  let address1;
  let address2;
  let hardhatToken;
  let Token;
  
  beforeEach(async function() {
    [owner, address1, address2] = await ethers.getSigners();
    Token = await ethers.getContractFactory('Token');
    hardhatToken = await Token.deploy();

  });

  it("Should transfer tokens between account", async function() {
    await hardhatToken.transfer(address1.address, 50);
    expect(await hardhatToken.balanceOf(address1.address)).to.equal(50);

    await hardhatToken.connect(address1).transfer(address2.address, 50);
    expect(await hardhatToken.balanceOf(address2.address)).to.equal(50);
  });

  it('Should revert the transaction when the sender does not have enough tokens', async function() {
    const initialBalanceOfOwner = await hardhatToken.balanceOf(owner.address);

    await expect(hardhatToken.connect(address1).transfer(owner.address, 10))
      .to.be.revertedWith('Not enough tokens');
    expect(await hardhatToken.balanceOf(owner.address)).to.be.equal(initialBalanceOfOwner);
  });

  it('Should update balnces after transfers', async function() {
    const initialBalanceOfOwner = await hardhatToken.balanceOf(owner.address);
    let address1Balance = 0;
    let address2Balance = 0;

    await hardhatToken.transfer(address1.address, 100);
    address1Balance = await hardhatToken.balanceOf(address1.address);
    
    expect(address1Balance).to.be.equal(100);
    expect(await hardhatToken.balanceOf(owner.address)).to.be.equal(initialBalanceOfOwner - 100);

    await hardhatToken.connect(address1).transfer(address2.address, 50);
    address1Balance = await hardhatToken.balanceOf(address1.address);
    address2Balance = await hardhatToken.balanceOf(address2.address);
    expect(address2Balance).to.be.equal(50);
    expect(address1Balance).to.be.equal(50);
  });
});