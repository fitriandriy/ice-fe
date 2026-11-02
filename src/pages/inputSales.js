import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/Navbar";
import SearchModal from "../components/SearchModal";
import Swal from "sweetalert2";
import { Trash } from "lucide-react";
import { inputSales, getCustomers, getProducts, getDrivers, getBankAccounts } from "../api";

const InputSales = () => {
  const [customerModal, setCustomerModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [driverModal, setDriverModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const [customers, setCustomers] = useState([]); 
  const [listProduct, setListProduct] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [status, setStatus] = useState("hutang");
  const [discount, setDiscount] = useState(0);
  const [drivers, setDrivers] = useState(1);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [bank, setBank] = useState([]);
  const [selectedBank, setSelectedBank] = useState(1);
  const [tempo, setTempo] = useState(1);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [draftItem, setDraftItem] = useState({

    product: null,

    quantity: "",

    price: ""

  });
  const [items, setItems] = useState([]);
  const customerBtnRef = useRef();
  const productRef = useRef();
  const driverRef = useRef();
  const qtyRef = useRef();
  const priceRef = useRef();

  useEffect(() => {
    customerBtnRef.current?.focus();

    const fetchCustomers = async () => {
      try {
        const res = await getCustomers();
        setCustomers(res.data.data);
      } catch (err) {
        console.log(err);
        return err
      }
    };
    fetchCustomers();

    const fetchListProduct = async () => {
      try {
        const res = await getProducts()
        setListProduct(res.data.data)
      } catch (error) {
        return error
      }
    }
    fetchListProduct()

    const fetchDrivers = async () =>{
      try {
      const res = await getDrivers()
      setDrivers(res.data.data)
      } catch (error) {
        return error
      }
    }
    fetchDrivers()

    const bankAccounts = async () => {
      try {
        const res = await getBankAccounts()
        setBank(res.data.data)
      } catch (error) {
        return error
      }
    }
    bankAccounts()
  }, []);

  const formatNumber = (number) => Number(number || 0).toLocaleString("id-ID");

  const handleSelectCustomer = (row) => {
    setSelectedCustomer(row);
    setCustomerModal(false);
    setTimeout(() => {
      driverRef.current?.focus();
    }, 100);
  };

  const handleSelectProduct = (row) => {
    setDraftItem(prev => ({
      ...prev,
      product: row,
      price: row.price
    }));
    setProductModal(false);
    setTimeout(() => {
      qtyRef.current?.focus();
    }, 100);
  };

  const handleSelectDriver = (row) => {
    setSelectedDriver(row);
    setDriverModal(false);
    setTimeout(() => {
      productRef.current?.focus();
    }, 100);
  };

  const handleAddItem = () => {
    if (!draftItem.product) return;
    if (!draftItem.quantity) return;
    if (!draftItem.price) return;
    const newItem = {
      product_id: draftItem.product.id,
      product_name: draftItem.product.name,
      quantity: Number(draftItem.quantity),
      price: Number(draftItem.price),
      total:
        Number(draftItem.quantity) *
        Number(draftItem.price)
    };
    setItems(prev => [...prev, newItem]);
    // reset input
    setDraftItem({
      product: null,
      quantity: "",
      price: ""
    });
    // balik ke barang
    setTimeout(() => {
      productRef.current?.focus();
    }, 100);
  };

  const handleDelete = (index) => {
    setItems(prev =>
      prev.filter((_, i) => i !== index)
    );
  };

  const totalQty = items.reduce(
    (acc, item) =>
      acc + Number(item.quantity),
    0
  );

  const grandTotal = items.reduce(
    (acc, item) =>
      acc + Number(item.total),
    0
  );

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      Swal.fire({
        icon: "warning",
        text: "Pilih customer terlebih dahulu"
      });
      return;
    }
    if (items.length === 0) {
      Swal.fire({
        icon: "warning",
        text: "Belum ada item"
      });
      return;
    }
    const payload = {
      date,
      customer_id: selectedCustomer.id,
      driver_id: selectedDriver?.id || null,
      bank_account_id: selectedBank || null,
      status: status,
      discount: Number(discount),
      tempo: Number(tempo),
      total: grandTotal - Number(discount),
      items
    };
    try {
      const res = await inputSales(payload);
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: res.data.message,
        confirmButtonColor: "#222C5F",
        timer: 700,
        showConfirmButton: false
      });

      setItems([]);
      setDraftItem({
        product: null,
        quantity: "",
        price: ""
      });

      setSelectedCustomer(null);
      customerBtnRef.current?.focus();

      setTransactionModal(false);
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        text: "Gagal menyimpan"
      });
    }
  };

  return (
    <div>
      <NavBar />
      <SearchModal
        open={customerModal}
        title="Cari Customer"
        data={customers}
        columns={[
          {
            header: "Kode",
            accessor: "id"
          },
          {
            header: "Nama Customer",
            accessor: "name"
          }
        ]}
        onClose={() => setCustomerModal(false)}
        onSelect={handleSelectCustomer}
      />

      <SearchModal
        open={productModal}
        title="Cari Barang"
        data={listProduct}
        columns={[
          {
            header: "Kode",
            accessor: "id"
          },
          {
            header: "Barang",
            accessor: "name"
          }
        ]}
        onClose={() => setProductModal(false)}
        onSelect={handleSelectProduct}
      />

      <SearchModal
        open={driverModal}
        title="Cari Driver"
        data={drivers}
        columns={[
          {
            header: "Kode",
            accessor: "id"
          },
          {
            header: "Nama Driver",
            accessor: "name"
          }
        ]}
        onClose={() => setDriverModal(false)}
        onSelect={handleSelectDriver} 
      />

      <div
        className={`${
          transactionModal ? "flex" : "hidden"
        } fixed inset-0 z-50 items-center justify-center bg-black/50`}
      >
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <p className="text-center">CARA PEMBAYARAN</p>
          <div className="flex gap-3 px-10 mt-5">
            <table className="w-full">
              <tr>
                <td>
                  <p>Cara bayar (H/T)</p>
                </td>
                <td>:</td>
                <td className="flex items-center gap-2">
                  <select className="border rounded-md px-3 py-1 ml-2 border-[#000]" name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="lunas">Tunai</option>
                    <option value="hutang">Hutang</option>
                  </select>
                  <input
                    className="border rounded-md w-12 text-center py-1 border-[#000]"
                    type="number"
                    value={tempo}
                    onChange={(e) => setTempo(e.target.value)}
                  />
                  <p>hari</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Kas terpakai</p>
                </td>
                <td>:</td>
                <td>
                  <select
                    className="border rounded-md px-3 py-1 ml-2 border-[#000] w-full"
                    name="bankId"
                    id="bankId"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    {bank.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Diskon</p>
                </td>
                <td>:</td>
                <td>
                  <input
                    className="border rounded-md px-3 py-1 ml-2 border-[#000] w-full"
                    type="number"
                    value={formatNumber(discount)}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <p>Total</p>
                </td>
                <td>
                  <p>:</p>
                </td>
                <td>
                  <p className="border rounded-md px-3 py-1 ml-2 border-[#000] w-full">{formatNumber(grandTotal - discount)}</p>
                </td>
              </tr>
            </table>
          </div>
          <div className="flex justify-center gap-5 mt-5">
            <button className="bg-yellow-400 px-6 h-[40px] rounded-xl font-semibold" onClick={handleSubmit}>
              EXECUTE
            </button>
            <button className="bg-gray-400 px-6 h-[40px] rounded-xl font-semibold" onClick={() => setTransactionModal(false)}>
              CANCEL
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between px-10 mt-5">
        <div className="flex gap-3">
          <input
            type="date"
            className="border rounded-md px-3"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
          />
          <input
            readOnly
            value={selectedCustomer?.name || ""}
            placeholder="Pilih Customer"
            className="border rounded-md px-3 w-72 cursor-pointer"
            onClick={()=>setCustomerModal(true)}
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                setCustomerModal(true);
              }
            }}
          />
          <input
            ref={driverRef}
            readOnly
            value={selectedDriver?.name || ""}
            placeholder="Pilih Driver"
            className="border rounded-md px-3 w-72 cursor-pointer"
            onClick={()=>setDriverModal(true)}
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                setDriverModal(true);
              }
            }}
          />

          <button
            ref={customerBtnRef}
            className="bg-[#222C5F] text-white px-6 rounded-xl"
            onClick={()=>setCustomerModal(true)}
          >
            Cari
          </button>
        </div>

        <button
          className="bg-yellow-400 px-6 h-[40px] rounded-xl font-semibold"
          onClick={() => setTransactionModal(true)}
        >
          SIMPAN
        </button>
      </div>
      <div className="px-10 mt-5">
        <table className="w-full">
          <thead>
            <tr>
              <th>Barang</th>
              <th>Qty</th>
              <th>Harga</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  ref={productRef}
                  readOnly
                  value={draftItem.product?.name || ""}
                  placeholder="Pilih Barang"
                  className="border w-full p-2"
                  onClick={()=>setProductModal(true)}
                  onKeyDown={(e)=>{
                    if(e.key==="Enter"){
                      setProductModal(true);
                    }
                  }}
                />
              </td>
              <td>
                <input
                  ref={qtyRef}
                  value={draftItem.quantity}
                  className="border w-full p-2"
                  onChange={(e)=>{
                    setDraftItem(prev=>({
                      ...prev,
                      quantity:e.target.value
                    }));
                  }}
                  onKeyDown={(e)=>{
                    if(e.key==="Enter"){
                      priceRef.current.focus();
                    }
                  }}
                />
              </td>
              <td>
                <input
                  ref={priceRef}
                  value={draftItem.price}
                  className="border w-full p-2"
                  onChange={(e)=>{
                    setDraftItem(prev=>({
                      ...prev,
                      price:e.target.value
                    }));
                  }}
                  onKeyDown={(e)=>{
                    if(e.key==="Enter"){
                      handleAddItem();
                    }
                  }}
                />
              </td>
              <td className="text-center">
                {formatNumber(
                  Number(draftItem.quantity||0)*
                  Number(draftItem.price||0)
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mx-10 mt-5 min-h-[60vh] bg-[#fff] shadow-xl">
        <table className="w-full border-separate border-spacing-y-2 border-spacing-x-2">
          <thead>
            <tr>
              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-md p-2 text-sm text-center">Barang</th>
              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-md p-2 text-sm text-center">Qty</th>
              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-md p-2 text-sm text-center">Harga</th>
              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-md p-2 text-sm text-center">Total</th>
              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-md p-2 text-sm text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {
              items.length>0?
              items.map((item,index)=>(
                <tr key={index}>
                  <td className="text-center">{item.product_name}</td>
                  <td className="text-center">
                    {formatNumber(item.quantity)}
                  </td>
                  <td className="text-center">
                    {formatNumber(item.price)}
                  </td>
                  <td className="text-center">
                    {formatNumber(item.total)}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={()=>handleDelete(index)}
                    >
                      <Trash
                        className="text-red-500"
                        size={18}
                      />
                    </button>
                  </td>
                </tr>
              ))
              :
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10"
                >
                  Belum ada barang.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-10 px-10 mt-5 mb-5">
        <div>
          <b>Total Qty</b>
          <div>
            {formatNumber(totalQty)}
          </div>
        </div>
        <div>
          <b>Grand Total</b>
          <div>
            Rp {formatNumber(grandTotal)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputSales