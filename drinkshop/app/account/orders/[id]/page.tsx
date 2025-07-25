import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
const OrderDetailPage = () => {
  return (
    <div>
      <BreadcrumbComponent
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Danh sách đơn hàng", href: "/account/orders" },
          { label: "Chi tiết đơn hàng" },
        ]}
      />
      <h1>Chi tiết đơn hàng</h1>
      {/* Thông tin chi tiết đơn hàng sẽ được hiển thị ở đây */}
    </div>
  );
};

export default OrderDetailPage;
