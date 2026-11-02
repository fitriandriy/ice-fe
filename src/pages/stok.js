import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import Swal from "sweetalert2";
import { Trash } from "lucide-react";
import {addStock, getStock, deleteStock} from "../api/index"

const Stok = () => {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [EndDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState([])
  const [stock, setStock] = useState([])

  const [productionDate, setProductionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedProductId, setSelectedProductId] = useState(1)
  const [amount, setAmount] = useState(0)

  const [returDate, setReturDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [returWeight, setReturWeight] = useState(1)
  const [returQty, setReturQty] = useState()

  const handleSubmitProduction = async (date, product_id, transaction_id, amount) => {
    try {
      const res = await addStock(date, product_id, transaction_id, amount)
      console.log("prev:", data);
      console.log("stock:", data?.stock);
      
      setData((prev) => [
        ...prev,
        {
          date,
          product_id,
          product_transaction_id: transaction_id,
          amount
        }
      ]);

      if (transaction_id === 1) {
        setStock((prev) =>
          prev.map((item) =>
            item.product_id === Number(product_id)
              ? {
                  ...item,
                  stock: [
                    {
                      stock: String(
                        Number(item.stock?.[0]?.stock ?? 0) +
                        Number(amount)
                      )
                    }
                  ]
                }
              : item
          )
        );
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: res.data.message,
        width: 420,
        confirmButtonColor: "#222C5F"
      });
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan data",
        width: 320,
        confirmButtonColor: "#222C5F"
      });
    }
  }

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Hapus data?",
        text: "Data yang dihapus tidak bisa dikembalikan",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#222C5F",
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
        customClass: {
          popup: "rounded-xl w-[350px] text-sm"
        }
      });
      if (!result.isConfirmed) return;

      const res = await deleteStock(id)

      const updateData = data.filter(
        (item) => item.id !== id
      )
      setData(updateData)

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: res.data.message,
        width: 420,
        confirmButtonColor: "#222C5F"
      });
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan data",
        width: 320,
        confirmButtonColor: "#222C5F"
      });
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStock(startDate, EndDate);

        setData(res.data.data.data);
        setStock(res.data.data.stock);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [startDate, EndDate]);

  return (
    <div>
      <NavBar />
      <div className="px-10 mt-5 text-[#505050]">
        <h1 className="text-2xl font-bold">Stok Es</h1>
        <p className="text-lg">Pantau ketersediaan stok dan catat hasil produksi terbaru.</p>
      </div>
      <div className="flex w-full ">
        {/* laporan stok dan rincian input */}
        <div className="w-[60%] px-10">
          <div className="flex gap-5 justify-between mt-5">
            {/* 5 kg */}
            <div className="flex gap-5 p-5 rounded-lg bg-[#ECF6FE] w-full">
              <div>
                <img src="./assets/5kg.png" alt="10kg" className="w-20"></img>
              </div>
              <div>
                <p className="text-xl font-bold">Es 5 kg</p>
                <p className="text-lg">Kemasan</p>
                <div className="flex my-1">
                  <p className="text-3xl font-bold">{(stock[1]?.stock[0].stock)}</p>
                  <p className="text-lg px-[3px]"></p>
                  <p className="text-lg">bag</p>
                </div>
                <p className="text-lg">{(stock[1]?.stock[0].stock) * 5} kg total</p>
              </div>
            </div>
            {/* 10 kg */}
            <div className="flex gap-5 p-5 rounded-lg bg-[#ECF6FE] w-full">
              <div>
                <img src="./assets/10kg.png" alt="10kg" className="w-20"></img>
              </div>
              <div>
                <p className="text-xl font-bold">Es 10 kg</p>
                <p className="text-lg">Kemasan</p>
                <div className="flex my-1">
                  <p className="text-3xl font-bold">{(stock[0]?.stock[0].stock)}</p>
                  <p className="text-lg px-[3px]"></p>
                  <p className="text-lg">bag</p>
                </div>
                <p className="text-lg">{(stock[0]?.stock[0].stock) * 10} kg total</p>
              </div>
            </div>
          </div>
          <div className="mt-5 text-[#505050]">
            <div className="flex justify-between">
              <div>
                <h1 className="text-xl font-bold">Riwayat Produksi</h1>
                <p className="text-lg mb-3">Catatan hasil produksi yang pernah diinput.</p>
              </div>
              <div className="flex gap-3 mr-5">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  className="h-[45px] date-white border px-5 py-1 rounded-full bg-[#222C5F] text-white font-semibold"
                />
                <p>-</p>
                <input
                  type="date"
                  value={EndDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                  className="h-[45px] date-white border px-5 py-1 rounded-full bg-[#222C5F] text-white font-semibold"
                />
              </div>
            </div>
            <div className="mr-5 overflow-y-auto rounded-xl h-[40vh]">
              <table className="w-full table-fixed border-separate">
                <thead>
                  <tr>
                    <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">No</th>
                    <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">Tanggal</th>
                    <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">Transaksi</th>
                    <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">Kemasan</th>
                    <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">Jumlah Bag</th>
                    <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, id) => (
                    <tr 
                      className={`
                      ${
                        id % 2 === 0
                        ? "bg-[#e6f2fb]"
                        : "bg-white"
                      } text-center hover:bg-gray-200 cursor-pointer`}
                    >
                      <td>{id+1}</td>
                      <td>{row.date}</td>
                      <td>{
                        row.product_transaction_id === 1 ? "Hasil Produksi"
                        : row.product_transaction_id === 2 ? "Retur Rusak"
                        : "undefined"
                      }</td>
                      <td>{
                        row.product_id === 1 ? "10 Kg" 
                        : row.product_id === 2 ? "5Kg"
                        : "-"
                      }</td>
                      <td>{row.amount}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(row.id)}
                        >
                          <Trash size={16} className="text-red-400 hover:scale-110 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* form input hasil produksi & retur */}
        <div className="w-[40%] px-10 py-5 shadow-lg text-[#505050]">
          {/* hasil produksi */}
          <div className="mx-auto text-center">
            <div className="flex gap-3 text-left">
              <div className="bg-[#0F57A7] flex items-center pl-[5px] pb-[5px] rounded-full text-3xl font-bold text-white w-[30px] h-[30px]">
                <p>+</p>
              </div>
              <div>
                <h1 className="text-xl font-bold">Input Hasil Produksi</h1>
                <p className="text-lg">Tambah stok dari hasil produksi.</p>
              </div>
            </div>

            <form className="mt-5">
              <table className="w-full">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[5%]" />
                  <col className="w-[65%]" />
                </colgroup>
                <tbody className="text-left">
                  <tr>
                    <td>
                      <label className="text-lg font-semibold">Tanggal Produksi</label>
                    </td>
                    <td>:</td>
                    <td>
                      <input type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} className="border-[1px] p-2 w-full rounded-lg border-[#848484]" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="text-lg font-semibold">Kemasan</label>
                    </td>
                    <td>:</td>
                    <td>
                      <select
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        value={selectedProductId}
                        className="my-2 border-[1px] border-[#000] rounded-lg p-2 w-full"
                      >
                        <option value={1} key={1}>10 Kg</option>
                        <option value={2} key={2}>5 Kg</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="text-lg font-semibold">Jumlah Bag</label>
                    </td>
                    <td>:</td>
                    <td>
                      <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="border-[1px] p-2 w-full rounded-lg border-[#848484]" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
            <button onClick={() => handleSubmitProduction(productionDate, selectedProductId, 1, amount)} className="bg-[#FFC91B] text-[#505050] px-6 py-2 font-bold rounded-xl mt-2">SIMPAN HASIL PRODUKSI</button>
          </div>
          {/* input retur */}
          <div className="mt-10 mb-5 mx-auto text-center">
            <div className="flex gap-3 mb-5">
              <div className="bg-[#0F57A7] flex items-center pl-[5px] pb-[5px] rounded-full text-3xl font-bold text-white w-[30px] h-[30px]">
                <p>+</p>
              </div>
              <div>
                <h1 className="text-xl font-bold text-left">Input Retur Rusak</h1>
                <p className="text-lg">Retur rusak akan mengurangi stok.</p>
              </div>
            </div>

            <form className="mt-5">
              <table className="w-full text-left">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[5%]" />
                  <col className="w-[65%]" />
                </colgroup>
                <tbody>
                  <tr>
                    <td>
                      <label className="text-lg font-semibold">Tanggal</label>
                    </td>
                    <td>:</td>
                    <td>
                      <input type="date" value={returDate} onChange={setReturDate} className="border-[1px] p-2 w-full rounded-lg border-[#848484]" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="text-lg font-semibold">Kemasan</label>
                    </td>
                    <td>:</td>
                    <td>
                      <select
                        className="my-2 border-[1px] border-[#000] rounded-lg p-2 w-full"
                        onChange={(e) => setReturWeight(e.target.value)}
                        value={returWeight}
                      >
                        <option value={1} key={1}>10 Kg</option>
                        <option value={2} key={2}>5 Kg</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label className="text-lg font-semibold">Jumlah Bag</label>
                    </td>
                    <td>:</td>
                    <td>
                      <input value={returQty} onChange={(e) => setReturQty(e.target.value)} type="number" className="border-[1px] p-2 w-full rounded-lg border-[#848484]" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
            <button onClick={() => handleSubmitProduction(returDate, returWeight, 2, returQty)} className="bg-[#FFC91B] text-[#505050] px-6 py-2 font-bold rounded-xl mt-2">SIMPAN</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stok