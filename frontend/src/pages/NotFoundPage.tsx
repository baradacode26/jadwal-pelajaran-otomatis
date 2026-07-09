import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/notfound.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <p>Halaman tidak ditemukan</p>
        <Link to="/" className="btn-home">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
