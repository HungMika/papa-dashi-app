export function OrderBar() {
  const orderItems = [
    { name: 'Trà sữa', quantity: 2, price: 30000 },
    { name: 'Bánh ngọt', quantity: 1, price: 25000 },
  ];

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="text-lg font-bold mb-4">Đơn hàng hiện tại</div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {orderItems.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>{item.price * item.quantity}₫</span>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between font-semibold">
          <span>Tổng:</span>
          <span>{total}₫</span>
        </div>
        <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Thanh toán</button>
      </div>
    </div>
  );
}
