import { useState, useEffect} from 'react';
import { ethers } from 'ethers';
import Wallet from './artifacts/contracts/Wallet.sol/Wallet.json';
import './App.css';

let WalletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // wallet address

// all fonctions written in reactJs for execute the smart contract
function App() {

  const [balance, setBalance] = useState(0);// combien l'utttilasateur a dans son wallet
  const [amountSend, setAmountSend] = useState();// combien l'utilisateur veut envoyer
  const [amountWithdraw, setAmountWithdraw] = useState();// combien l'utilisateur veut retirer
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    getBalance();// get the balance of the wallet
  }, [])

  // function for get the balance of the wallet
  async function getBalance() {
    // check if the user has metamask
    if(typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});// get the account of the user
      const provider = new ethers.providers.Web3Provider(window.ethereum);// get the provider
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider);// get instance of the contract
      try {
        let overrides = {
          from: accounts[0]// get the account of the user
        }
        const data = await contract.getBalance(overrides);// get the balance of the wallet
        setBalance(String(data));// set the balance of the wallet
      }
      catch(err) {
        setError("une erreur s'est produite");
      }
    }
  }

  // function for send ethers to the wallet
  async function transfert() {
    if(!amountSend){
      return;
    } 
    setError("");
    setSuccess("");
    if(typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});// get the account of the user
      const provider = new ethers.providers.Web3Provider(window.ethereum);// get the provider
      const signer = provider.getSigner();// get the signer
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.utils.parseEther(amountSend)
        }
        const transaction = await signer.sendTransaction(tx);
        await transaction.wait();
        setAmountSend('');
        getBalance();
        setSuccess("Transfert effectué avec succès");
      } 
      catch(err) {
        setError("une erreur s'est produite");
      }
    }
  }

  // function for withdraw ethers from the wallet
  async function withdraw(){
    if(!amountWithdraw){
      return;
    } 
    setError('');
    setSuccess('');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer);
    
    try {
      const transaction = await contract.withdrawMoney(accounts[0], ethers.utils.parseEther(amountWithdraw));
      await transaction.wait();
      setAmountWithdraw('');
      getBalance();
      setSuccess("Retrait effectué avec succès");
    } 
    catch(err) {
      setError("Montant inssuffisant pour effectuer le transfert");
    }
  }

  function changeAmountSend(e) {
    setAmountSend(e.target.value);
  }

  function changeAmountWithdraw(e) {
    setAmountWithdraw(e.target.value);
  }

  // this is the html code for the wallet
  return (
    <div className="App"> 
      <div className="container">
        <div className="logo">
        <i class="fa-brands fa-ethereum"></i>
        </div>
        {error && <p className="error">{error}</p>}
        <h2>{ balance / 10**18}<span classname="eth">eth</span> </h2>
        {success && <p className="success">{success}</p>}
        
        <div className="wallet__flex">
          <div className="walletG">
            <h3>Envoyer de l'Ether</h3>
            <input type="text" placeholder="Montant en Ethers" onChange={changeAmountSend}/>
              <button onClick={transfert}>Envoyer</button>
          </div>
          <div className='walletD'>
            <h3>Retirer de L'Ethers</h3>
            <input type='text' placeholder='Montant en Ethers' onChange={changeAmountWithdraw}/>
            <button onClick={withdraw}>Retirer</button>

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
//{error && <p className="error">{error}</p>}
//<h2>{balance / 10*18}<span classname="eth">eth</span> </h2>