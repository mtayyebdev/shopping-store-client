import React, { useState } from 'react'
import { Card, SimpleCard, EarningRevenueChart, CategorySaleChart, WebsiteVisitorsChart } from '../components/index'
import { LuFile, LuCalendarDays, LuDollarSign, LuUsers, LuEllipsisVertical, LuStar } from 'react-icons/lu';
import { useSelector } from 'react-redux';

function Dashboard() {
  const { currency } = useSelector((state) => state.userSlice);
  const [earningRevenueDropDown, setEarningRevenueDropDown] = useState(false);
  const [topProductsDropDown, setTopProductsDropDown] = useState(false);
  const [categorySaleDropDown, setCategorySaleDropDown] = useState(false);
  const [recentOrdersDropDown, setRecentOrdersDropDown] = useState(false);

  const [totalDataSummary, setTotalDataSummary] = useState([
    {
      id: 1,
      data: [65, 75, 70, 85, 78, 80, 82],
      total: '34,566',
      Icon: LuCalendarDays,
      percentage: 1.45,
      title: "Total Sales",
      color: "rgb(45,200,102)"
    },
    {
      id: 2,
      data: [10, 75, 23, 56, 89, 100, 72],
      total: '82,566',
      Icon: LuDollarSign,
      currency: currency.symbol,
      percentage: -3.89,
      title: "Total Income",
      color: "rgb(219,68,68)"
    },
    {
      id: 3,
      data: [89, 56, 12, 45, 100, 34, 82],
      total: '12,566',
      Icon: LuFile,
      percentage: 76.03,
      title: "Orders Paid",
      color: "rgb(45,200,102)"
    },
    {
      id: 4,
      data: [55, 34, 56, 78, 89, 95, 23],
      total: '120,78',
      Icon: LuUsers,
      percentage: -45.0,
      title: "Total Visitor",
      color: "rgb(219,68,68)"
    },
  ]);
  const [earningsRevenueData, setEarningsRevenueData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: "Earnings",
        data: [65, 75, 70, 120, 78, 80, 82, 130, 78, 80, 82, 85],
        backgroundColor: 'rgba(45,200,102,1)',
        borderColor: 'rgba(45,200,102,1)',
        borderWidth: 2,
        maxBarThickness: 50,
        borderRadius: 10
      },
      {
        label: "Orders",
        data: [10, 75, 230, 56, 89, 100, 72, 85, 78, 80, 302, 85],
        backgroundColor: 'rgb(219,68,68)',
        borderColor: 'rgb(219,68,68)',
        borderWidth: 2,
        maxBarThickness: 50,
        borderRadius: 10
      },
    ]
  });
  const [categorySaleData, setCategorySaleData] = useState({
    labels: ['Men Fashion', 'Women Fashion', 'Kids Fashion', 'Accessories'],
    datasets: [
      {
        data: [120, 190, 80, 677],
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ]
  });
  const [topProductsData, settopProductsData] = useState([
    {
      id: 1,
      name: "Smart watch 2026, electronic battry.",
      review: 4.5,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
    {
      id: 2,
      name: "Smart watch 2026, electronic battry.",
      review: 4.2,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
    {
      id: 3,
      name: "Smart watch 2026, electronic battry.",
      review: 3.6,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
    {
      id: 4,
      name: "Smart watch 2026, electronic battry.",
      review: 4.2,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
    {
      id: 5,
      name: "Smart watch 2026, electronic battry.",
      review: 4.5,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
    {
      id: 6,
      name: "Smart watch 2026, electronic battry.",
      review: 4.5,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
    {
      id: 7,
      name: "Smart watch 2026, electronic battry.",
      review: 4.5,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
    {
      id: 8,
      name: "Smart watch 2026, electronic battry.",
      review: 4.5,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
    {
      id: 9,
      name: "Smart watch 2026, electronic battry.",
      review: 4.5,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
    {
      id: 10,
      name: "Smart watch 2026, electronic battry.",
      review: 4.5,
      sold: 150,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      profit: 788
    },
  ])
  const [recentOrdersData, setRecentOrdersData] = useState([
    {
      id: 1,
      orderId: "#ORD-7854",
      productName: "Smart watch 2026, electronic battry.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1170&auto=format&fit=crop",
      customerName: "John Doe",
      quantity: 2,
      price: 1576,
      status: "Completed"
    },
    {
      id: 2,
      orderId: "#ORD-2341",
      productName: "Wireless Bluetooth Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1170&auto=format&fit=crop",
      customerName: "Jane Smith",
      quantity: 1,
      price: 299,
      status: "Pending"
    },
    {
      id: 3,
      orderId: "#ORD-9012",
      productName: "Ergonomic Office Chair",
      image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=1170&auto=format&fit=crop",
      customerName: "Robert Brown",
      quantity: 1,
      price: 450,
      status: "Cancelled"
    },
    {
      id: 4,
      orderId: "#ORD-5567",
      productName: "Mechanical Gaming Keyboard",
      image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1170&auto=format&fit=crop",
      customerName: "Emily Davis",
      quantity: 3,
      price: 360,
      status: "Completed"
    },
    {
      id: 5,
      orderId: "#ORD-1122",
      productName: "4K Ultra HD Monitor",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1170&auto=format&fit=crop",
      customerName: "Michael Wilson",
      quantity: 1,
      price: 899,
      status: "Processing"
    }
  ]);


  return (
    <>
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="cards col-span-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5">
            {
              totalDataSummary.map((data) => (
                <Card key={data.id} ChartData={data.data} Icon={data.Icon} percentage={data.percentage} title={data.title} total={data.total} currency={data.currency} color={data.color} />
              ))
            }
          </div>
          <div className="col-span-1 xl:col-span-2 bg-white p-5 rounded-2xl shadow-lg relative">
            <div className="flex items-center justify-between">
              <h3 className='text-xl font-semibold'>Earnings revenue</h3>
              <LuEllipsisVertical className='cursor-pointer' size={20} onClick={() => setEarningRevenueDropDown(!earningRevenueDropDown)} />
            </div>
            {earningRevenueDropDown && <div className="dropdown z-10 absolute top-14 right-0 bg-white p-2 rounded-2xl shadow-lg w-40">
              <ul className="dropdown-content">
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">Today</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">Yesterday</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Week</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Month</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Year</li>
              </ul>
            </div>}

            <div className="flex items-center flex-wrap justify-between gap-7 mt-6">
              <SimpleCard title="Revenue" total="34,566" percentage={1.45} currency={currency.symbol} isActive={true} />
              <SimpleCard title="Orders" total="34,566" percentage={1.45} currency={currency.symbol} isActive={false} />
            </div>
            <div className="chart mt-6 relative w-full h-full">
              <EarningRevenueChart data={earningsRevenueData} />
            </div>
          </div>
        </div>
      </section>
      <section className='mt-5'>
        <div className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 sm:col-span-3 md:col-span-2 rounded-2xl shadow-lg relative">
            <div className="flex items-center justify-between">
              <h3 className='text-xl font-semibold'>Top Products</h3>
              <LuEllipsisVertical className='cursor-pointer' size={20} onClick={() => setTopProductsDropDown(!topProductsDropDown)} />
            </div>
            {topProductsDropDown && <div className="dropdown z-10 absolute top-14 right-0 bg-white p-2 rounded-2xl shadow-lg w-40">
              <ul className="dropdown-content">
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">Today</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">Yesterday</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Week</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Month</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Year</li>
              </ul>
            </div>}
            <div className='overflow-x-auto block overflow-hidden'>
              <table className='mt-6 w-full min-w-[500px]'>
                <thead>
                  <tr>
                    <th className='text-left px-2'>Product</th>
                    <th className='text-left px-2'>Review</th>
                    <th className='text-left px-2'>Sold</th>
                    <th className='text-left px-2'>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {topProductsData.slice(0, 7).map((product) => (
                    <tr key={product.id}>
                      <td className='py-2 px-2'>
                        <div className="flex items-center gap-2">
                          <img src={product.image} alt="product" className='w-10 h-10' />
                          <p>{product.name}</p>
                        </div>
                      </td>
                      <td className='py-2 px-2'>
                        <div className="flex items-center gap-2">
                          <LuStar size={20} fill='yellow' color='yellow' />
                          <p>{product.review}</p>
                        </div>
                      </td>
                      <td className='py-2 px-2'>
                        <p>{product.sold}</p>
                      </td>
                      <td className='py-2 px-2'>
                        <p>{currency.symbol}{product.profit}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white p-5 sm:col-span-2 md:col-span-1 rounded-2xl shadow-lg relative">
            <div className="flex items-center justify-between">
              <h3 className='text-xl font-semibold'>Sale by Category</h3>
              <LuEllipsisVertical className='cursor-pointer' size={20} onClick={() => setCategorySaleDropDown(!categorySaleDropDown)} />
            </div>
            {categorySaleDropDown && <div className="dropdown z-10 absolute top-14 right-0 bg-white p-2 rounded-2xl shadow-lg w-40">
              <ul className="dropdown-content">
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">Today</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">Yesterday</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Week</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Month</li>
                <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Year</li>
              </ul>
            </div>}
            <div className="mt-5">
              <SimpleCard title="Total Mar 20, 2023" total="34,566" percentage={45.33} currency={currency.symbol} isActive={true} />
            </div>

            <div className="chart mt-6 w-full min-h-[400px]">
              <CategorySaleChart data={categorySaleData} />
            </div>
          </div>
        </div>
      </section>
      <section className='mt-5'>
        <div className="bg-white p-5 rounded-2xl shadow-sm relative">
          <div className="flex items-center justify-between">
            <h3 className='text-xl font-semibold'>Recent Orders</h3>
            <LuEllipsisVertical className='cursor-pointer' size={20} onClick={() => setRecentOrdersDropDown(!recentOrdersDropDown)} />
          </div>
          {recentOrdersDropDown && <div className="dropdown z-10 absolute top-14 right-0 bg-white p-2 rounded-2xl shadow-lg w-40">
            <ul className="dropdown-content">
              <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">Today</li>
              <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">Yesterday</li>
              <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Week</li>
              <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Month</li>
              <li className="py-2 px-2 hover:bg-gray-100 cursor-pointer">This Year</li>
            </ul>
          </div>}

          <div className="overflow-x-auto mt-6 block overflow-hidden">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr>
                  <th className="text-left px-2">Order ID</th>
                  <th className="text-left px-2">Product</th>
                  <th className="text-left px-2">Customer</th>
                  <th className="text-left px-2">Quantity</th>
                  <th className="text-left px-2">Price</th>
                  <th className="text-left px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersData.map((order) => (
                  <tr key={order.id}>
                    <td className="py-2 px-2">
                      <p>{order.orderId}</p>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <img src={order.image} alt="product" className="w-10 h-10" />
                        <p>{order.productName}</p>
                      </div>
                    </td>
                    <td className='px-2'>
                      <p>{order.customerName}</p>
                    </td>
                    <td className='px-2'>
                      <p>{order.quantity}</p>
                    </td>
                    <td className='px-2'>
                      <p>{currency.symbol}{order.price}</p>
                    </td>
                    <td className='px-2'>
                      <p>{order.status}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="mt-5">
        <WebsiteVisitorsChart />
      </section>

    </>
  )
}

export default Dashboard