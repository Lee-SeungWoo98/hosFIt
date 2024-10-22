import React, { useState } from "react";
import { Search } from "lucide-react";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // 검색어를 App.js로 전달
    
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="환자 이름 검색"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <button className="search-button">Search</button>
    </div>
  );
}

export default SearchBar;
