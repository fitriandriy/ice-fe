import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar";
import Swal from "sweetalert2";
import { NumericFormat } from "react-number-format";
import {getCostTypes, getBankAccounts, getLatestCostId, inputCost, inputCashIn} from "../api/index"

const InputCost = () => {
  const [currentAction, setCurrentAction] = useState(1)
  const [costTypes, setCostTypes] = useState()
  const [selectedCostType, setSelectedCostType] = useState(1)
  const [bankAccounts, setBankAccounts] = useState([])
  const [selectedBankAccount, setSelectedBankAccount] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [latestId, setLatesId] = useState([]) 
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [noTrans, setNoTrans] = useState()
  const [description, setDescription] = useState("")
  const [nominal, setNominal] = useState()

  const handleSubmit = async () => {
    try {
      const res = await inputCost(noTrans, date, selectedBankAccount, selectedCostType, description, Number(nominal))

      const latest_id = await getLatestCostId(date)
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);

      const prefix = `K${day}${month}${year}`;
      const lastNumber = Number(latest_id.data.data[0].transaction_number.split("-")[1]);
      const nextNumber = String(lastNumber + 1).padStart(3, "0");
      setNoTrans(`${prefix}-${nextNumber}`);
      setDescription("")
      setNominal("")

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

  const handleSubmitCashIn = async () => {
    try {
      const res = await inputCashIn(noTrans, date, selectedBankAccount, selectedCostType, description, Number(nominal))

      const latest_id = await getLatestCostId(date)
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);

      const prefix = `K${day}${month}${year}`;
      const lastNumber = Number(latest_id.data.data[0].transaction_number.split("-")[1]);
      const nextNumber = String(lastNumber + 1).padStart(3, "0");
      setNoTrans(`${prefix}-${nextNumber}`);
      setDescription("")
      setNominal("")

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
        const res = await getCostTypes();
        setCostTypes(res.data.data);

        const bank_account = await getBankAccounts()
        setBankAccounts(bank_account.data.data)

        const latest_id = await getLatestCostId(date)

        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = String(d.getFullYear()).slice(-2);

        const prefix = `K${day}${month}${year}`;

        latest_id.data.data.length < 1 ? 
          setNoTrans(`${prefix}-001`)
        : 
          setLatesId(latest_id.data.data[0].transaction_number)
          const lastNumber = Number(latest_id.data.data[0].transaction_number.split("-")[1]);
          const nextNumber = String(lastNumber + 1).padStart(3, "0");
          setNoTrans(`${prefix}-${nextNumber}`);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {        
        const latest_id = await getLatestCostId(date)
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = String(d.getFullYear()).slice(-2);

        const prefix = `K${day}${month}${year}`;

        latest_id.data.data.length < 1 ? 
          setNoTrans(`${prefix}-001`)
        : 
          setLatesId(latest_id.data.data[0].transaction_number)
          const lastNumber = Number(latest_id.data.data[0].transaction_number.split("-")[1]);
          const nextNumber = String(lastNumber + 1).padStart(3, "0");
          setNoTrans(`${prefix}-${nextNumber}`);
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [date])

  return (
    <div>
      <NavBar />
      <div className="mx-auto w-[40%] flex justify-between my-5">
        <button onClick={() => setCurrentAction(1)} className={`${
          currentAction === 1
            ? "w-[50%] bg-[#222C5F]"
            : "w-[50%] bg-gray-400"
        } text-white px-6 py-2 font-semibold rounded-xl`}>INPUT BIAYA</button>
        <button onClick={() => setCurrentAction(2)} className={`${
          currentAction === 2
            ? "w-[50%] bg-[#222C5F]"
            : "w-[50%] bg-gray-400"
        } text-white px-6 py-2 font-semibold rounded-xl`}>INPUT KAS MASUK</button>
      </div>

      {
        currentAction === 1 ? 
          <div className="w-[40%] h-[70vh] text-center mx-auto shadow-lg rounded-lg p-5">
            <h className="font-bold">INPUT BIAYA</h>
            <form className="m-auto pt-5">
              <table className="w-full text-left">
                <tr>
                  <td>No Transaksi</td>
                  <td>:</td>
                  <td>
                    <input className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full" value={noTrans}></input>
                  </td>
                </tr>
                <tr>
                  <td>Tanggal</td>
                  <td>:</td>
                  <td>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full"></input>
                  </td>
                </tr>
                <tr>
                  <td>Jenis Kas</td>
                  <td>:</td>
                  <td>
                    <select 
                      onChange={(e) => setSelectedBankAccount(e.target.value)} 
                      value={selectedBankAccount} 
                      className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full"
                    >
                      {bankAccounts?.map((row, id) => (
                        <option value={row.id} key={row.id}>{row.account_number === "" ? row.bank : row.account_number}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Jenis Biaya</td>
                  <td>:</td>
                  <td>
                    <select 
                      className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full"
                      onChange={(e) => setSelectedCostType(e.target.value)}
                      value={selectedCostType}
                    >
                      {costTypes?.map((row, id) => (
                        <option value={row.id}>{row.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Keterangan</td>
                  <td>:</td>
                  <td>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full"></textarea>
                  </td>
                </tr>
                <tr>
                  <td>Nominal</td>
                  <td>:</td>
                  <td>
                    <NumericFormat
                      thousandSeparator="."
                      decimalSeparator=","
                      value={nominal}
                      onValueChange={(values) => {
                        setNominal(values.value);
                      }}
                      className="mb-2 border border-black rounded-lg p-2 w-full"
                      placeholder="0"
                    />
                  </td>
                </tr>
              </table>
            </form>
            <button type="button" onClick={() => handleSubmit()} className="bg-[#222C5F] text-white px-6 py-2 font-semibold rounded-xl mt-2">EXCECUTE</button>
          </div>
        :
          <div className="w-[40%] h-[70vh] text-center mx-auto shadow-lg rounded-lg p-5">
            <h className="font-bold">INPUT KAS MASUK</h>
            <form className="m-auto pt-5">
              <table className="w-full text-left">
                <tr>
                  <td>No Transaksi</td>
                  <td>:</td>
                  <td>
                    <input className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full" value={noTrans}></input>
                  </td>
                </tr>
                <tr>
                  <td>Tanggal</td>
                  <td>:</td>
                  <td>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full"></input>
                  </td>
                </tr>
                <tr>
                  <td>Jenis Kas</td>
                  <td>:</td>
                  <td>
                    <select 
                      onChange={(e) => setSelectedBankAccount(e.target.value)} 
                      value={selectedBankAccount} 
                      className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full"
                    >
                      {bankAccounts?.map((row, id) => (
                        <option value={row.id} key={row.id}>{row.account_number === "" ? row.bank : row.account_number}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Jenis Biaya</td>
                  <td>:</td>
                  <td>
                    <select 
                      className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full"
                      onChange={(e) => setSelectedCostType(e.target.value)}
                      value={selectedCostType}
                    >
                      {costTypes?.map((row, id) => (
                        <option value={row.id}>{row.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Keterangan</td>
                  <td>:</td>
                  <td>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mb-2 border-[1px] border-[#000] rounded-lg p-2 w-full"></textarea>
                  </td>
                </tr>
                <tr>
                  <td>Nominal</td>
                  <td>:</td>
                  <td>
                    <NumericFormat
                      thousandSeparator="."
                      decimalSeparator=","
                      value={nominal}
                      onValueChange={(values) => {
                        setNominal(values.value);
                      }}
                      className="mb-2 border border-black rounded-lg p-2 w-full"
                      placeholder="0"
                    />
                  </td>
                </tr>
              </table>
            </form>
            <button type="button" onClick={() => handleSubmitCashIn()} className="bg-[#222C5F] text-white px-6 py-2 font-semibold rounded-xl mt-2">EXCECUTE</button>
          </div>
      }
    </div>
  );
}

export default InputCost