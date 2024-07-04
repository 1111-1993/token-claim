import './App.css';
import React from 'react';
// import ClaimForm from './components/ClaimForm';
// import ClaimForm from './utils/change';
// import ClaimForm from './utils/parity';
import ClaimForm from './utils/main_change';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <h1>Token Claim Application</h1>
      </header>
            <main>
                <ClaimForm />
            </main>
    </div>
  );
} 

export default App;
