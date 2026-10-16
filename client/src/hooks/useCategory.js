import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("/api/v1/category/get-category")
      .then(({ data }) => setCategories(data?.category || []))
      .catch((error) => console.log(error));
  }, []);

  return categories;
}
