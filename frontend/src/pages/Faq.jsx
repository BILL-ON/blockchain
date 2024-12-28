import React from 'react'


const faqItems = [
  {
    question: "What is XRPL?",
    answer: "XRPL (XRP Ledger) is a decentralized blockchain platform that enables fast, cost-efficient transactions. It's optimized for handling digital payments and tokenized assets."
  },
  {
    question: "How do I create a GemWallet?",
    answer: "1. Install the GemWallet browser extension from the Chrome Web Store\n2. Click the extension icon and follow setup instructions\n3. Securely store your seed phrase\n4. Connect your wallet to our platform using the Login button"
  },
  {
    question: "What is a seed phrase and why is it important?",
    answer: "A seed phrase is a unique sequence of words that acts as the master key to your wallet. Never share it with anyone and store it securely offline. You'll need it to recover your wallet if you lose access. Without your seed phrase, you cannot recover your assets."
  },
  {
    question: "What are the fees for transactions?",
    answer: "XRPL transactions typically cost 0.00001 XRP (~12 drops). This includes:\n- NFT minting: 0.00001 XRP\n- Creating buy/sell offers: 0.00001 XRP\n- Accepting/canceling offers: 0.00001 XRP\n- NFT transfers: 0.00001 XRP"
  },
  {
    question: "How do I create an RWA (Real World Asset)?",
    answer: "1. Connect your GemWallet\n2. Click 'Create RWA'\n3. Fill in asset details (name, description, location, size, valuation)\n4. Confirm the transaction in GemWallet\n5. Wait for blockchain confirmation"
  },
  {
    question: "How do sell offers work? 💵",
    answer: "1. Find your asset in 'My Assets'\n2. Click 'Create Sell Offer'\n3. Set your price in XRP\n4. Confirm in GemWallet\n5. Your offer will be visible to all buyers\n6. Buyers can accept your offer, transferring XRP to your wallet"
  },
  {
    question: "How do buy offers work? 🛒",
    answer: "1. Browse assets in the Marketplace\n2. Click 'Make Buy Offer' on desired asset\n3. Enter your offer amount in XRP\n4. Confirm in GemWallet\n5. The owner can accept or decline your offer"
  },
  {
    question: "What happens if my transaction fails?",
    answer: "Common causes include:\n- Insufficient XRP balance\n- GemWallet disconnection\n- Network congestion\nDouble-check your balance and GemWallet connection, then try again. If problems persist, check the XRPL explorer for transaction status."
  },
  {
    question: "How do I cancel an offer?",
    answer: "1. Go to 'My Sell Offers' or find the offer in the marketplace\n2. Click 'Cancel Offer'\n3. Confirm in GemWallet\n4. A small network fee will apply"
  },
  {
    question: "Is my XRP balance updated automatically?",
    answer: "Yes, your XRP balance updates automatically after each transaction. You can also manually refresh the page."
  },
  {
    question: "Having technical issues?",
    answer: "Try these steps:\n1. Refresh your browser\n2. Check GemWallet connection\n3. Verify XRP balance\n4. Clear browser cache\n\nContact support@xrpleasy.com for additional help"
  }
];


export default function Faq() {
    return (
        <div style={{
          maxWidth: '800px',
          margin: '2rem auto',
          padding: '0 1rem'
        }}>
          <h1 style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}>Frequently Asked Questions</h1>
    
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {faqItems.map((item, index) => (
              <div 
                key={index}
                style={{
                  backgroundColor: '#fff',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{
                  marginBottom: '0.5rem',
                  fontSize: '1.2rem'
                }}>{item.question}</h3>
                <p style={{
                  color: '#666',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line'
                }}>{item.answer}</p>
              </div>
            ))}
          </div>
    
          <div style={{
            marginTop: '3rem',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Still have questions?</h3>
            <p>Contact us at support@xrpleasy.com</p>
          </div>
        </div>
      );    
}
