import './App.css';
import React from 'react';

import ClaimForm from './utils/change';

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
