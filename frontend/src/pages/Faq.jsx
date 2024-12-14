import React from 'react'

const faqItems = [
    {
      question: "How do I create a wallet?",
      answer: "Click on 'Register' in the navigation bar. Then click on the button create wallet, and the system will generate one for you. The process can take some time 5-10s. \n 🎴 Also Make sure to save your seed phrase securely ! 🎴"
    },
    {
      question: "What is a seed phrase?",
      answer: "A seed phrase is like your wallet's master password. Never share it with anyone and store it securely. You'll need it to access your wallet and perform transactions."
    },
    {
      question: "How do I create an RWA?",
      answer: "After beign registered or logging in, go to 'Create RWA'. Fill in your asset details (name, description, location, size, valuation), enter your seed phrase, and click 'Create NFT'."
    },
    {
      question: "How can I sell my RWA? 💵",
      answer: "Go to 'My Assets', find your NFT, click 'Create Sell Offer', enter the price in XRP and your seed phrase to list it for sale. This will create offer that other user can see a buy if they want it."
    },
    {
      question: "How do I buy an RWA?",
      answer: "Use the 'Search token' feature to find RWAs. When you find one you want, click 'Buy Now', enter your seed phrase to confirm the purchase."
    },
    {
      question: "What happens if a transaction fails?",
      answer: "Most transaction failures are due to insufficient funds or incorrect seed phrases. Double-check your balance and seed phrase, then try again."
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
