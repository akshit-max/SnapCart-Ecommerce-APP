const CategoryForm = ({ handleSubmit, value, setValue, buttonText = "Add" }) => {
  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <input
        type="text"
        className="form-control"
        placeholder="Category name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-brand px-4">
        {buttonText}
      </button>
    </form>
  );
};

export default CategoryForm;
