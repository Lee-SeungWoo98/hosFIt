import React from 'react';
import './App.css';
import Header from './Components/Header';
import List from './Components/list'; // List 컴포넌트 import
import './Components/list.css';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="content-wrapper">
          <div className="content">
            <List /> {/* List 컴포넌트 추가 */}
          </div>
          <br/>
          <div className="content">
           일단 만들어둔 컨텐츠 영역
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;