import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";

const Search = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;
    setLoading(true);
    axios
      .get(`/api/v1/product/search/${encodeURIComponent(keyword)}`)
      .then(({ data }) => setResults(data.products))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <Layout title="Search results">
      <div className="container mt-3">
        <h4 className="page-title">Results for "{keyword}"</h4>
        <p className="text-muted-soft">
          {loading ? "Searching..." : `${results.length} product(s) found`}
        </p>

        {loading ? (
          <Spinner />
        ) : (
          <div className="row g-4">
            {results.map((p) => (
              <div className="col-sm-6 col-lg-3" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
