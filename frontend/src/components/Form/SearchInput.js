import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchInput = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <form className="search-input-wrap" role="search" onSubmit={handleSubmit}>
      <FiSearch className="search-icon" />
      <input
        className="form-control"
        type="search"
        placeholder="Search electronics, sneakers, apparel..."
        aria-label="Search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
    </form>
  );
};

export default SearchInput;
