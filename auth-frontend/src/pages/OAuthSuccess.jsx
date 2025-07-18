import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      localStorage.setItem('accessToken', token);
      navigate('/home');
    }
  }, []);

  return <h2>Logging you in via Google...</h2>;
};

export default OAuthSuccess;