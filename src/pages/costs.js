import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar.js";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";

import {
  getCosts,
  deleteCosts,
  getBankAccounts
} from "../api/index.js";

const Costs = () => {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [EndDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [totalSaldo, setTotalSaldo] = useState(0);

  const [importedData, setImportedData] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bank_accounts, setBankAccounts] = useState([])
  const [selectedBankAccount, setSelectedBankAccount] = useState(1)

  const formatNumber = (num) => {
    return Number(num || 0).toLocaleString("id-ID");
  };

  const fetchCosts = async (start, end, bank_id) => {
    try {
      const response = await getCosts(start, end, bank_id);
      const data = response.data.data.data;
      setImportedData(data);
      setFilteredReports(data);
      setTotalSaldo(response.data.data.saldo)
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

  const fetchCostTypes = async (start, end) => {
    try {
      const accounts = await getBankAccounts()
      setBankAccounts(accounts.data.data)
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
    fetchCosts(startDate, EndDate, selectedBankAccount);
    fetchCostTypes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = importedData.filter((row) => row.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredReports(filtered)
  }, [searchTerm, importedData])

  const handleSearch = async () => {
    await fetchCosts(startDate, EndDate, selectedBankAccount);
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

      await deleteCosts(id);

      const updatedImportedData = importedData.filter(
        (item) => item.id !== id
      );

      const updatedFilteredReports =
        filteredReports.filter(
          (item) => item.id !== id
        );

      setImportedData(updatedImportedData);
      setFilteredReports(updatedFilteredReports);

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

  return (
    <div>
      <NavBar />

      <div className="flex gap-5 px-10 py-5 justify-between">
        <div className="flex gap-5">
          <input
            placeholder="Cari"
            className="border rounded-full px-5 border-[#5a5a5a]"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <div className="flex gap-3">
            <p>Jenis Kas :</p>
            <select 
              className="border border-[#383838] px-3 py-1 rounded-full font-semibold"
              onChange={(e) => setSelectedBankAccount(e.target.value)
              }
            >
              {
                bank_accounts.map((row) => (
                  <option value={row.id}>{row.account_number === "" ? row.bank : row.account_number}</option>
                ))
              }
            </select>
          </div>

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

      <div className="h-[70vh] mx-10 overflow-y-auto rounded-xl">
        <table className="w-full table-fixed border-separate                                                                                                                                                                                                      border-spacing-x-2 border-spacing-y-2">
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[15%]" />
            <col className="w-[30%]" />
            <col className="w-[12%]" />
            <col className="w-[13%]" />
            <col className="w-[5%]" />
          </colgroup>

          <thead>
            <tr>
              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                TANGGAL
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                ID TRANSAKSI
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                KETERANGAN
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                DEBIT
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                KREDIT
              </th>

              <th className="sticky top-0 z-20 bg-[#222C5F] text-white rounded-lg py-2">
                AKSI
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((row, idx) => (

              <tr
                key={row.id}
                className={`${
                  idx % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                } hover:bg-gray-100 cursor-pointer`}
                onClick={() => {}}
              >
                <td className="text-center py-2">
                  {row.date.slice(8,10)}
                  {row.date.slice(4,7)}
                  -
                  {row.date.slice(0,4)}
                </td>

                <td className="text-center py-2">
                  {row.transaction_id}
                </td>

                <td className="text-center py-2">
                  {row.description}
                </td>

                <td className="text-center py-2 font-semibold">
                  {formatNumber(row.debit)}
                </td>

                <td className="text-center py-2 font-semibold">
                  {formatNumber(row.credit)}
                </td>
                
                <td className="flex gap-3 justify-center items-center h-8">
                  <button onClick={() => handleDelete(row.id)}>
                    <Trash size={16} className="text-red-400 hover:scale-110 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      <div className="flex gap-5 px-10 my-5">
        <div className="flex gap-2">
          <p>Total Saldo :</p>
          <p className="bg-[#E2EAE3] px-5 rounded-md">
            Rp. {formatNumber(totalSaldo)}
          </p>

        </div>
      </div>
    </div>
  );
};

export default Costs;