import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar.js";
import { Trash, CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import { getBankAccounts, inputSalePayment } from "../api/index.js";

import {
  getAllSales,
  deleteSales
} from "../api/index.js";

const Sales = () => {
  const formatNumber = (number) => Number(number || 0).toLocaleString("id-ID");

  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [EndDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [totalPembelian, setTotalPembelian] = useState(0);
  const [totalTonase, setTotalTonase] = useState(0);

  const [importedData, setImportedData] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [activeRow, setActiveRow] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionModal, setTransactionModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(1);
  const [bank, setBank] = useState([]);
  const [nominal, setNominal] = useState();
  const [saleId, setSaleId] = useState();
  const [detailTransactionModal, setDetailTransactionModal] = useState(false);

  const fetchSales = async (start, end) => {
    try {
      const response = await getAllSales(start, end);
      const data = response.data.data.data;
      setImportedData(data);
      setFilteredReports(data);
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal mengambil data",
        confirmButtonColor: "#222C5F",
        customClass: {
          popup: "rounded-xl w-[350px] text-sm"
        }
      });
    }
  };

  // FIRST LOAD
  useEffect(() => {
    fetchSales(startDate, EndDate);

    const bankAccounts = async () => {
      try {
        const res = await getBankAccounts()
        setBank(res.data.data)
      } catch (error) {
        return error
      }
    }
    bankAccounts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = importedData.filter((row) =>
      row.customer
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilteredReports(filtered);

    // RECALCULATE TOTAL
    const totalQty = filtered.reduce(
      (acc, curr) => acc + Number(curr.quantity), 0
    );

    const totalPrice = filtered.reduce(
      (acc, curr) => acc + Number(curr.total_price), 0
    );

    setTotalTonase(totalQty);

    setTotalPembelian(totalPrice);

  }, [searchTerm, importedData]);

  const handleSearch = async () => {
    await fetchSales(startDate, EndDate);
  };

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

      await deleteSales(id);

      const updatedImportedData = importedData.filter(
        (item) => item.id !== id
      );

      const updatedFilteredReports =
        filteredReports.filter(
          (item) => item.id !== id
        );

      setImportedData(updatedImportedData);
      setFilteredReports(updatedFilteredReports);

      const totalQty = updatedFilteredReports.reduce(
        (acc, curr) =>
          acc + Number(curr.quantity),
        0
      );

      const totalPrice =
        updatedFilteredReports.reduce(
          (acc, curr) =>
            acc +
            Number(curr.total_price) ,
          0
        );

      setTotalTonase(totalQty);
      setTotalPembelian(totalPrice);
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil dihapus",
        confirmButtonColor: "#222C5F",
        customClass: {
          popup: "rounded-xl w-[350px] text-sm"
        }
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan",
        confirmButtonColor: "#222C5F",
        customClass: {
          popup: "rounded-xl w-[350px] text-sm"
        }
      });
    }
  };

  const handlePayment = async () => {
    try {
      if (nominal > (Number(filteredReports.find((r) => r.id === saleId)?.total_price || 0) - Number(filteredReports.find((r) => r.id === saleId)?.discount || 0))) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Nominal pembayaran melebihi total tagihan",
          confirmButtonColor: "#222C5F",
          customClass: {
            popup: "rounded-xl w-[350px] text-sm"
          }
        });
        return;
      }

      const status = (Number(filteredReports.find((r) => r.id === saleId)?.total_price || 0) - Number(filteredReports.find((r) => r.id === saleId)?.discount || 0) - nominal) === 0 ? "lunas" : "hutang";

      const noTrans = filteredReports.find(row => row.id === saleId)?.transaction_number

      await inputSalePayment(date, nominal, saleId, selectedBank, status, noTrans);
      
      setFilteredReports((prevReports) =>
        prevReports.map((report) =>
          report.id === saleId ? { ...report, status } : report
        )
      );

      filteredReports.find(row => row.id === saleId)?.detail_payment.push(                    {
        "date": date,
        "amount": Number(nominal),
        "bank_account": {
            "account_number": bank.find(row => row.id === selectedBank)?.account_number,
            "name": bank.find(row => row.id === selectedBank)?.name,
            "bank": bank.find(row => row.id === selectedBank)?.bank
        }
      })

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Pembayaran berhasil dilakukan",
        confirmButtonColor: "#222C5F",
        customClass: {
          popup: "rounded-xl w-[350px] text-sm"
        }
      });
      setTransactionModal(false);
      setNominal(0);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan",
        confirmButtonColor: "#222C5F",
        customClass: {
          popup: "rounded-xl w-[350px] text-sm"
        }
      });
    }
  };

  const totalDetailPayment = filteredReports.find((r) => r.id === saleId)?.detail_payment?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  return (
    <div>
      <NavBar />

      {/* input payment modal */}
      <div
        className={`${transactionModal ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-50`}
      >
        <div className="flex gap-10 rounded-lg bg-white p-6 shadow-lg">
          <div className={`${filteredReports.find(row => row.id === saleId)?.detail_payment.length < 1 ? "hidden" : ""}`}>
            <p className="text-lg font-semibold text-center">DETAIL PEMBAYARAN {filteredReports.find((r) => r.id === saleId)?.transaction_number}</p>
            <div>
              <table className="w-full mt-2">
                <colgroup>
                  <col className="w-[15%]" />
                  <col className="w-[30%]" />
                  <col className="w-[15%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th>TANGGAL</th>
                    <th>KAS</th>
                    <th>NOMINAL</th>
                  </tr>
                </thead>
                {
                  filteredReports.find((r) => r.id === saleId)?.detail_payment?.map((p) => (
                    <tr className="border-b text-center" key={p.id}>
                      <td>{p.date}</td>
                      <td>{p.bank_account?.name}</td>
                      <td>{p.amount}</td>
                    </tr>
                  ))
                }
                <tr className="border-b text-center font-semibold pt-3">
                  <td className="text-center">SISA</td>
                  <td><p className="text-center">{Number(filteredReports.find((r) => r.id === saleId)?.total_price || 0)-Number(filteredReports.find((r) => r.id === saleId)?.discount || 0)-totalDetailPayment}</p></td>
                </tr>
              </table>            
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-center">INPUT PEMBAYARAN</p>
            <div>
              <table className="w-full mt-2">
                <tr>
                  <td>TANGGAL BAYAR</td>
                  <td>:</td>
                  <td><input value={date} onChange={(e) => setDate(e.target.value)} className="border ml-2 mb-2 rounded-md w-full text-left py-1 px-3 border-[#000]" type="date" /></td>
                </tr>
                <tr>
                  <td>KAS DIPAKAI</td>
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
                  <td>NOMINAL</td>
                  <td>:</td>
                  <td>
                    <input 
                      type="number" 
                      value={nominal} 
                      onChange={(e) => setNominal(e.target.value)} 
                      className="border ml-2 my-2 rounded-md w-full text-left py-1 px-3 border-[#000]"
                    />
                  </td>
                </tr>
                <tr>
                  <td>SISA BELUM DIBAYAR</td>
                  <td>:</td>
                  <td><p className="border ml-2 mb-2 rounded-md w-full text-left py-1 px-3 border-[#000]">{Number(filteredReports.find((r) => r.id === saleId)?.total_price || 0)-Number(filteredReports.find((r) => r.id === saleId)?.discount || 0)-filteredReports.find((r) => r.id === saleId)?.detail_payment.reduce((total, element) => total + element.amount,0)-nominal}</p></td>
                </tr>
              </table>
              <div className="flex justify-center gap-5 mt-5">
                <button onClick={() => handlePayment()} className="bg-yellow-400 px-6 h-[40px] rounded-xl font-semibold">
                  EXECUTE
                </button>
                <button className="bg-gray-400 px-6 h-[40px] rounded-xl font-semibold" onClick={() => {setTransactionModal(false); setNominal(0)}}>
                  CANCEL
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* detail payment modal */}
      <div
        className={`${detailTransactionModal ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-50`}
      >
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <p className="text-lg font-semibold text-center">DETAIL PEMBAYARAN {filteredReports.find((r) => r.id === saleId)?.transaction_number}</p>
          <div>
            <table className="w-full mt-2">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[30%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr>
                  <th>TANGGAL</th>
                  <th>KAS</th>
                  <th>NOMINAL</th>
                </tr>
              </thead>
              {
                filteredReports.find((r) => r.id === saleId)?.detail_payment?.map((p) => (
                  <tr className="border-b text-center" key={p.id}>
                    <td>{p.date}</td>
                    <td>{p.bank_account?.name}</td>
                    <td>{p.amount}</td>
                  </tr>
                ))
              }
              <tr className="border-b text-center font-semibold pt-3">
                <td className="text-center">SISA</td>
                <td><p className="text-center">{Number(filteredReports.find((r) => r.id === saleId)?.total_price || 0)-Number(filteredReports.find((r) => r.id === saleId)?.discount || 0)-totalDetailPayment}</p></td>
              </tr>
            </table>
            <div className="flex justify-center gap-5 mt-5">
              <button className="bg-gray-400 px-6 h-[40px] rounded-xl font-semibold" onClick={() => {setDetailTransactionModal(false); setNominal(0)}}>
                TUTUP
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* filter data */}
      <div className="flex gap-5 px-10 py-5">
        <div className="flex gap-5">
          <input
            placeholder="Cari nama supplier"
            className="border rounded-full px-5 border-[#5a5a5a]"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <div className="flex gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="date-white border px-5 py-1 rounded-full bg-[#222C5F] text-white font-semibold"
            />
            <p>-</p>
            <input
              type="date"
              value={EndDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="date-white border px-5 py-1 rounded-full bg-[#222C5F] text-white font-semibold"
            />

          </div>

          <button
            className="bg-[#FFC91B] font-semibold rounded-full px-5"
            onClick={handleSearch}
          >
            CARI
          </button>
        </div>
      </div>

      {/* show data */}
      <div className="h-[55vh] px-10 overflow-y-auto rounded-xl">
        <table className="w-full table-fixed border-separate border-spacing-x-2 border-spacing-y-2">
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-[30%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
          </colgroup>

          <thead>
            <tr>
              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                ID Transaksi
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Tanggal
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Customer
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Quantity
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Total
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Discount
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Grand Total
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Terbayar
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Sisa
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Driver
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Payment
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                Hapus
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((row, idx) => (

              <tr
                key={row.id}
                className={`
                ${
                  row.status === "lunas" ? "bg-blue-100 hover:bg-blue-200" : ""
                } hover:bg-gray-100 cursor-pointer`}
                onClick={() => setActiveRow(idx)}
              >

                <td className="text-center py-2">
                  {row.transaction_number}
                </td>

                <td className="text-center py-2">
                  {row.date.slice(8,10)}
                  {row.date.slice(4,7)}
                  -
                  {row.date.slice(0,4)}
                </td>

                <td className="py-2 px-2 truncate">
                  {row.customer}
                </td>

                <td className="text-center py-2">
                  {formatNumber(row.quantity)}
                </td>

                <td className="text-center py-2">
                  {formatNumber(row.total_price)}
                </td>

                <td className="text-center py-2">
                  {formatNumber(row.discount)}
                </td>

                <td className="text-center py-2 font-semibold">
                  {formatNumber(row.total_price - row.discount)}
                </td>

                <td className="text-center py-2 font-semibold">
                  {formatNumber(row.detail_payment.reduce(
                    (total, element) => total + element.amount,
                    0
                  ))}
                </td>

                <td className="text-center py-2 font-semibold">
                  {formatNumber(row.total_price - row.discount - row.detail_payment.reduce((total, element) => total + element.amount,0))}
                </td>

                <td className="text-center py-2 font-semibold">
                  {row.driver.name}
                </td>

                <td className="py-2">
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSaleId(row.id);
                        if (row.status === "lunas") {
                          setDetailTransactionModal(true);
                        } else {
                          setTransactionModal(true);
                        }
                      }}
                    >
                      <CreditCard
                        size={16}
                        className="text-red-400 hover:scale-110"
                      />
                    </button>
                  </div>
                </td>

                <td className="py-2">
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(row.id);
                      }}
                    >
                      <Trash
                        size={16}
                        className="text-red-400 hover:scale-110"
                      />
                    </button>
                  </div>
                </td>
              </tr>

            ))}

          </tbody>
        </table>
      </div>
      <div className="h-[20vh] px-10 overflow-y-auto bg-white rounded-xl">
        <table className="w-full shadow-xl border-separate border-spacing-y-2 border-spacing-x-2">
          <thead className="">
            <tr className="">
              <th className="sticky w-[10%] top-0 z-20 bg-[#4E4E4E] text-white rounded-md p-2 text-sm text-center">
                Nama Barang
              </th>
              <th className="sticky w-[10%] top-0 z-20 bg-[#4E4E4E] text-white rounded-md p-2 text-sm text-center">
                Harga
              </th>
              <th className="sticky top-0 w-[15%] z-20 bg-[#4E4E4E] text-white rounded-md p-2 text-sm text-center">
                Quantity
              </th>
              <th className="sticky w-[20%] top-0 z-20 bg-[#4E4E4E] text-white rounded-md p-2 text-sm text-center">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {
              filteredReports.length > 0 ? (
                filteredReports[activeRow]?.item?.map((row, id) => (                  
                  <tr className="text-center">
                    <td className="w-[30%]">{row.product_name}</td>
                    <td>{formatNumber(row.price)}</td>
                    <td>{row.quantity}</td>
                    <td>{formatNumber(row.price * row.quantity)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-10 text-gray-400"
                  >
                    Data tidak ditemukan
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div className="flex gap-5 px-10">
        <div className="flex gap-2">
          <p>Total :</p>
          <p className="bg-[#E2EAE3] px-5 rounded-md">
            Rp. {formatNumber(totalPembelian)}
          </p>

        </div>
        <div className="flex gap-2">
          <p>Total Tonase :</p>
          <p className="bg-[#E2EAE3] px-5 rounded-md">
            {formatNumber(totalTonase)} KG
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sales;