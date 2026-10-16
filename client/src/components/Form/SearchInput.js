import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    // keyword goes in the url so results survive a refresh and can be shared
    navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <form className="d-flex search-form" role="search" onSubmit={handleSubmit}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search products"
        aria-label="Search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button className="btn btn-outline-primary" type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchInput;
