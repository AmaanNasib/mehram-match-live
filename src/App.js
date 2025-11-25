import './App.css';
import AllRoutes from './AllRoutes';
import "../src/global.css"
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



function App() {
  return (
    <div className="App">
            <ToastContainer position="top-right" autoClose={2500} />

      <AllRoutes/>
    </div>
  );
}

export default App;
