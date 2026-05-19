import AdminProductTable from "./card.product";


const AdminProductPage = () => {


  const handleEdit = (id) => {
    alert("Edit sản phẩm: " + id);
  };

 

  const handleAddDiscount = (id) => {
    alert("Thêm mã giảm giá cho sản phẩm: " + id);
  };

  return (
    <div className="p-6">
      <AdminProductTable
        onEdit={handleEdit}
        onAddDiscount={handleAddDiscount}
      />
    </div>
  );
};

export default AdminProductPage;
