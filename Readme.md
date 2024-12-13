# Blockchain project

bla bla bla

## Requirements

- nodejs / npm
- .env {
    PORT=???
    JWT_SECRET=???
}

RUN : 
npm run start

## Use ?

Soon a swagger will be here but for now : 

POST /api/auth/create-wallet -> Create a new wallet for you, you need to save the seed somewhere its like a password + take your jwt

POST /api/auth/login 
BODYYYYYY {
    "seed": "...."
}


POST /api/rwa/create
NEED JWT
BODYYYYYY 
{
    "name": "Beach House Miami",
    "description": "Luxury beachfront property",
    "valuation": 1000000,
    "location": "Miami Beach",
    "size": "2500 sqft",
    "seed": "...."
}


GET /api/rwa/my-assets
NEED JWT

