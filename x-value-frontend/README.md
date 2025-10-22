# Car Listing Web Application

This is a car listing web application built with React and Vite, styled using Tailwind CSS. The application allows users to browse through a list of cars, view details of each car, and filter the listings based on various criteria.

## Features

- **Car Listings**: View a list of available cars with details.
- **Car Details**: Click on a car to view more detailed information.
- **Filters**: Filter the car listings based on different criteria.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server for modern web projects.
- **Tailwind CSS**: A utility-first CSS framework for styling.

## Getting Started

To get a local copy up and running, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/vite-react-car-listing.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd vite-react-car-listing
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to `http://localhost:3000` to see the application in action.

## Folder Structure

```
vite-react-car-listing
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.cjs
├── tailwind.config.cjs
├── .gitignore
├── src
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── CarCard.jsx
│   │   ├── CarList.jsx
│   │   └── Filters.jsx
│   ├── pages
│   │   ├── Home.jsx
│   │   └── CarDetails.jsx
│   ├── hooks
│   │   └── useCars.js
│   ├── services
│   │   └── api.js
│   ├── utils
│   │   └── formatPrice.js
│   └── data
│       └── cars.js
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.