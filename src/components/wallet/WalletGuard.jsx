import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * WalletGuard - Redirects to login if no auth token in localStorage
 */
const WalletGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('wallet_auth_token');
    if (!authToken) {
      navigate('/wallet/login');
    }
  }, [navigate]);

  const authToken = localStorage.getItem('wallet_auth_token');
  if (!authToken) {
    return null; // Or a loading spinner
  }

  return children;
};

export default WalletGuard;
