const Home = () => {
  const token = localStorage.getItem('accessToken');
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome</h1>
      <p>Access Token: {token ? token : 'None'}</p>
      <a href="/">Back to Auth Page</a>
    </div>
  );
};

export default Home;