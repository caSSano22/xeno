/* ==========================================================================
   XENO - STABLECOIN CARD SCHEME INTERACTIVE LOGIC & WEB3 PROVIDER
   Network: Robinhood Chain EVM (Chain ID: 0xa4b1 / 42161)
   ========================================================================== */

let userAddress = null;
let simulatedUsdgBalance = 2500.00;

// On DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initNfcSimulator();
  initTabSwitchers();
  initFaqAccordions();
  initCardTiltEffects();
  checkExistingEIP1193Connection();
});

// 1. Interactive NFC Tap-to-Pay Terminal Simulator
function initNfcSimulator() {
  const tapBtn = document.getElementById('simulateNfcTapBtn');
  const termStatusEl = document.getElementById('terminalStatusText');
  const termTxEl = document.getElementById('terminalTxHash');

  if (tapBtn && termStatusEl) {
    tapBtn.addEventListener('click', () => {
      termStatusEl.textContent = '⚡ NFC Contactless Tap Detected...';
      termStatusEl.style.color = '#FFD400';

      setTimeout(() => {
        termStatusEl.textContent = '🔒 Cryptographic Signature Verification...';
      }, 1200);

      setTimeout(() => {
        const txHash = '0x' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('');
        termStatusEl.textContent = '✅ Payment Approved & Settled on Robinhood EVM!';
        termStatusEl.style.color = '#22c55e';
        if (termTxEl) termTxEl.textContent = `Tx Hash: ${txHash.substring(0, 14)}...`;

        simulatedUsdgBalance -= 45.00;
        const balanceEl = document.getElementById('walletBalanceDisplay');
        if (balanceEl) balanceEl.textContent = `$${simulatedUsdgBalance.toFixed(2)} USDg`;

        showToast('NFC Payment Successful: $45.00 USDg settled on Robinhood EVM in 1.2s (Zero Gas)');
      }, 2400);
    });
  }
}

// 2. Tab Switchers
function initTabSwitchers() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const targetTab = e.target.dataset.tab;
      const walletContent = document.getElementById('walletsSolutionContent');
      const pspContent = document.getElementById('pspsSolutionContent');

      if (walletContent && pspContent) {
        if (targetTab === 'psps') {
          walletContent.style.display = 'none';
          pspContent.style.display = 'block';
        } else {
          walletContent.style.display = 'block';
          pspContent.style.display = 'none';
        }
      }
    });
  });
}

// 3. FAQ Accordions
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-accordion-header');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const parent = item.parentElement;
      parent.classList.toggle('open');
      const body = parent.querySelector('.faq-accordion-body');
      if (body) {
        if (parent.classList.contains('open')) {
          body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          body.style.maxHeight = '0px';
        }
      }
    });
  });
}

// 4. Real EIP-1193 Web3 Wallet Provider (Robinhood Chain EVM)
async function checkExistingEIP1193Connection() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        handleConnectedAccount(accounts[0]);
      }
    } catch (err) {
      console.warn('Error checking existing wallet connection:', err);
    }
  }
}

function openWalletModal() {
  const modal = document.getElementById('walletModal');
  if (modal) modal.classList.add('open');
}

function closeWalletModal() {
  const modal = document.getElementById('walletModal');
  if (modal) modal.classList.remove('open');
}

async function connectRealEIP1193Wallet() {
  closeWalletModal();

  if (typeof window.ethereum === 'undefined') {
    showToast('No Web3 wallet extension found. Install Robinhood Wallet or MetaMask!');
    window.open('https://robinhood.com/web3-wallet/', '_blank');
    return;
  }

  try {
    showToast('Connecting Robinhood EVM wallet...');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts && accounts.length > 0) {
      await handleConnectedAccount(accounts[0]);
    }
  } catch (err) {
    showToast(`Connection failed: ${err.message || 'User rejected'}`);
  }
}

async function handleConnectedAccount(account) {
  userAddress = account;
  const shortAddr = account.substring(0, 6) + '...' + account.substring(account.length - 4);

  const connectBtns = document.querySelectorAll('.connect-wallet-trigger');
  connectBtns.forEach(btn => {
    btn.textContent = `🟢 ${shortAddr}`;
    btn.style.background = 'rgba(34, 197, 94, 0.15)';
    btn.style.color = '#22c55e';
    btn.style.borderColor = '#22c55e';
  });

  showToast(`Robinhood EVM Wallet Connected (${shortAddr})`);
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast-xeno';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// 5. 3D Card Tilt & Mouse Spotlight Effect
function initCardTiltEffects() {
  const tiltCards = document.querySelectorAll('.nfc-simulator-wrap, .pos-terminal-card, .phone-wallet-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}
