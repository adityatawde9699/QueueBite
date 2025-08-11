import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Header />
        <main className="app-content">
          <AppRoutes /> {/* Use the AppRoutes component here */}
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
