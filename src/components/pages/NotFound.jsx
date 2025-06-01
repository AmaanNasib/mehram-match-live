import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        padding: '40px',
        borderRadius: '15px',
        backgroundColor: 'white',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '120px',
          fontWeight: '800',
          margin: '0',
          color: '#ff4757',
          background: 'linear-gradient(45deg, #FF8DCD, #ff6b81)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1'
        }}>404</h1>
        
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          margin: '20px 0 10px',
          color: '#2f3542'
        }}>Oops! Page Not Found</h2>
        
        <p style={{
          fontSize: '18px',
          color: '#57606f',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, let's get you back on track!
        </p>
        
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '50px',
              border: 'none',
              background: 'linear-gradient(45deg, #FF8DCD, #ff6b81)',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 107, 129, 0.3)',
              ':hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(255, 107, 129, 0.4)'
              }
            }}
          >
            Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '50px',
              border: '2px solid #ff4757',
              background: 'transparent',
              color: '#ff4757',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              ':hover': {
                background: 'linear-gradient(45deg, #FF8DCD, #ff6b81)',
                color: 'white',
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 20px rgba(255, 107, 129, 0.4)'
              }
            }}
          >
            Home Page
          </button>
        </div>
        
        <div style={{
          marginTop: '40px',
          color: '#a4b0be',
          fontSize: '14px'
        }}>
          <p>Still lost? Contact our <a href="/support" style={{
            color: '#ff4757',
            textDecoration: 'none',
            fontWeight: '600',
            ':hover': {
              textDecoration: 'underline'
            }
          }}>support team</a></p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;