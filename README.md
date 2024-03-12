# Moviecritic

This project comprises frontend and backend components demonstrating concurrent execution.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) and npm
- [MongoDB](https://www.mongodb.com/) database

### Installation

1.  Clone the repository:

    `git clone https://github.com/anmolsonkar/Moviecritic.git`

2.  Install dependencies at the root level: `npm install`

3.  Install dependencies in both frontend and backend:

    `cd frontend`

    `npm install`

    ` cd ../backend`

    `npm install`

4.  Configure environment variables:

    Create a `.env` file in the backend folder with the following:

    `MONGODB_URI="your mongoDB URI"`

### Usage

To concurrently run frontend and backend:

`npm run start`

This command utilizes the `concurrently` package to execute:

`cd frontend && npm run dev` and `cd backend && npm run dev`

## Author

Anmol Sonkar

## License

This project is licensed under the MIT License.
