import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/Navbar.js";
import { Trash, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import { addPengisian, getDrivers, getPengisian, deletePengisian, updatePengisian } from "../api/index.js";
import { useReactToPrint } from "react-to-print";

const Do = () => {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "DO Pengisian",
  });

  const [createModal, setCreateModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [driver, setDriver] = useState(1)
  const [amount10kg, setAmount10kg] = useState([])
  const [amount5kg, setAmount5kg] = useState([])
  const [dataPengisian, setDataPengisian] = useState([])
  const [activeRow, setActiveRow] = useState()
  const [terjual_10kg, set_terjual_10kg] = useState()
  const [terjual_5kg, set_terjual_5kg] = useState()
  const [retur_10kg, set_retur_10kg] = useState()
  const [retur_5kg, set_retur_5kg] = useState()
  const [printData, setPrintData] = useState(null);
  const [recap, setRecap] = useState([])

  const clearState = () => {
    set_terjual_10kg("")
    set_terjual_5kg("")
    set_retur_10kg("")
    set_retur_5kg("")
    setAmount10kg("")
    setAmount5kg("")
  }
  
  const handleCreate = async () => {
    try {
      const res = await addPengisian(date, Number(driver), amount10kg, amount5kg)
      setDataPengisian((prev) => [
        ...prev, {
          date, 
          delivery_number: res.data.delivery_number, 
          driver_id: Number(driver), 
          muat_10kg: amount10kg, 
          muat_5kg: amount5kg
        }
      ])
      setCreateModal(false)

      setPrintData({
        date,
        delivery_number: res.data.delivery_number, 
        driver: drivers.find((row) => row.id === Number(driver))?.name,
        muat_10kg: amount10kg, 
        muat_5kg: amount5kg
      })

      clearState()

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data berhasil ditambah",
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

      await deletePengisian(id);

      const updatedData = dataPengisian.filter(
        (item) => item.id !== id
      );

      setDataPengisian(updatedData);

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

  const handleUpdate = async (id) => {
    try {
      await updatePengisian(id, terjual_10kg, terjual_5kg, retur_10kg, retur_5kg)

      setDataPengisian((prev) =>
        prev.map((row) =>
          row.id === id
            ? {
                ...row,
                jual_10kg: terjual_10kg, 
                jual_5kg: terjual_5kg, 
                retur10kg: retur_10kg, 
                retur5kg: retur_5kg
              }
            : row
        )
      );

      setEditModal(false);
      clearState();

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
  }
  // FIRST LOAD
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await getDrivers()
        setDrivers(res.data.data)
      } catch (error) {
        return error
      }
    }
    fetchDrivers()

    const fetchDataPengisian = async () => {
      try {
        const res = await getPengisian(date)
        setDataPengisian(res.data.data)
        setRecap(res.data.recap)
      } catch (error) {
        return error
      }
    }
    fetchDataPengisian()
  }, [date]);

  useEffect(() => {
    if (!printData) return;

    handlePrint();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printData]);

  return (
    <div>
      {/* PRINT MODAL */}
      <div ref={printRef} className="print-area m-auto text-center">
        {printData && (
          <div className="do-receipt m-auto text-center">
            <h2>ICE FLOW</h2>
            <p className="subtitle">DO PENGISIAN</p>

            <div className="divider"></div>

            <div className="info-row">
              <span>No. DO</span>
              <strong>{printData.delivery_number}</strong>
            </div>

            <div className="info-row">
              <span>Tanggal</span>
              <strong>{printData.date}</strong>
            </div>

            <div className="info-row">
              <span>Sopir</span>
              <strong>{printData.driver}</strong>
            </div>

            <div className="divider"></div>

            <h4>RINCIAN MUATAN</h4>

            <div className="product-row">
              <span>Es 10 Kg</span>
              <strong>{printData.muat_10kg} bag</strong>
            </div>

            <div className="product-row">
              <span>Es 5 Kg</span>
              <strong>{printData.muat_5kg} bag</strong>
            </div>

            <div className="divider"></div>

            <p className="signature-title">PENGECEKAN MUATAN</p>

            <div className="signature">
              <div>
                <span>Petugas</span>
                <div className="signature-space"></div>
                <span>(____________)</span>
              </div>

              <div>
                <span>Sopir</span>
                <div className="signature-space"></div>
                <span>({printData.driver})</span>
              </div>
            </div>

            <p className="footer">Terima kasih</p>
          </div>
        )}
      </div>

      {/* CREATE DO MODAL */}
      <div className={`${createModal ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-50`}>
        <div className="text-center rounded-2xl bg-white p-10 shadow-lg">
          <p className="text-lg font-semibold mb-4">BUAT DO BARU</p>
          <table>
            <tr>
              <td className="text-left">Tanggal</td>
              <td><p className="ml-3">:</p></td>
              <td>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-md text-left py-1 px-3 border-[#000] w-full ml-3" />
              </td>
            </tr>
            <tr>
              <td className="text-left">Nama Sopir</td>
              <td><p className="ml-3">:</p></td>
              <td>
                <select onChange={(e) => setDriver(e.target.value)} className="border my-2 rounded-md text-left py-1 px-3 border-[#000] w-full ml-3">
                  {
                    drivers.map((row, id) => (
                      <option value={row.id} key={row.id}>{row.name}</option>
                    ))
                  }
                </select>
              </td>
            </tr>
            <tr>
              <td className="text-left">Muat 10 Kg</td>
              <td><p className="ml-3">:</p></td>
              <td>
                <input type="number" value={amount10kg} onChange={(e) => setAmount10kg(e.target.value)} className="border my-2 rounded-md text-left py-1 px-3 border-[#000] w-full ml-3" />
              </td>
            </tr>
            <tr>
              <td className="text-left">Muat 5 Kg</td>
              <td><p className="ml-3">:</p></td>
              <td>
                <input type="number" value={amount5kg} onChange={(e) => setAmount5kg(e.target.value)} className="border rounded-md text-left py-1 px-3 border-[#000] w-full ml-3" />
              </td>
            </tr>
          </table>
          <div>
            <button onClick={() => handleCreate()} className="bg-[#222C5F] text-white px-3 h-[40px] mr-5 rounded-xl font-semibold mt-5">SIMPAN</button>
            <button onClick={() => {setCreateModal(false); clearState()}} className="bg-[#FFC91B] text-[#303030] px-3 h-[40px] rounded-xl font-semibold mt-2">CANCEL</button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <div className={`${editModal ? "flex" : "hidden"} fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-50`}>
        <div className="text-center rounded-2xl bg-white p-10 shadow-lg">
          <h2 className="text-lg font-semibold">Informasi Pengisian</h2>
          <div className="">
            <div className="flex gap-5">
              <div className="text-left flex gap-3">
                <p className="w-[200px] rounded-md text-left border-[#4d4d4d]">{drivers.find((row) => row.id === (Number(dataPengisian.find((row) => row.id === activeRow)?.driver_id)))?.name}</p>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="text-left flex gap-3">
                <p>NO TRANSAKSI : </p>
                <p className="w-[200px] rounded-md text-left border-[#4d4d4d]">{dataPengisian.find((row) => row.id === activeRow)?.delivery_number}</p>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold">Rincian Muatan</h2>
          <div className="mr-5">
            <table className="text-center w-full border border-separate border-spacing-x-4 border-spacing-y-1">
              <tr>
                <td>Kemasan</td>
                <td>Jumlah Muatan (Bag)</td>
                <td>Jumlah Terjual (Bag)</td>
                <td>Jumlah Retur (Bag)</td>
              </tr>
              <tr>
                <td>
                  <p>10 Kg</p>
                </td>
                <td>
                  <p className="my-2 rounded-md py-1 px-3 border-[#000]">{dataPengisian.find((row) => row.id === activeRow)?.muat_10kg}</p>
                </td>
                <td>
                  <input value={terjual_10kg} onChange={(e) => set_terjual_10kg(e.target.value)} className="border my-2 rounded-md text-center py-1 px-3 border-[#000]"></input>
                </td>
                <td>
                  <input value={retur_10kg} onChange={(e) => set_retur_10kg(e.target.value)} className="border my-2 rounded-md text-center py-1 px-3 border-[#000]"></input>
                </td>
              </tr>
              <tr>
                <td>
                  <p>5 Kg</p>
                </td>
                <td>
                  <p className="my-2 rounded-md py-1 px-3 border-[#000]">{dataPengisian.find((row) => row.id === activeRow)?.muat_5kg}</p>
                </td>
                <td>
                  <input value={terjual_5kg} onChange={(e) => set_terjual_5kg(e.target.value)} className="border my-2 rounded-md text-center py-1 px-3 border-[#000]"></input>
                </td>
                <td>
                  <input value={retur_5kg} onChange={(e) => set_retur_5kg(e.target.value)} className="border my-2 rounded-md text-center py-1 px-3 border-[#000]"></input>
                </td>
              </tr>
            </table>
            <div>
              <button onClick={() => handleUpdate(activeRow)} className="bg-[#222C5F] text-white px-3 h-[40px] rounded-xl font-semibold mt-8 mr-5 w-[150px]">Simpan</button>
              <button onClick={() => {setEditModal(false); clearState()}} className="bg-[#FFC91B] text-[#5b5b5b] px-3 h-[40px] rounded-xl font-semibold mt-8 mr-5 w-[150px]">Batal</button>
            </div>
          </div>
        </div>
      </div>

      <NavBar />
      <div className="mt-5 flex justify-between px-10 text-[#818181]">
        <div className="w-[50%]">
          <h1 className="text-xl font-bold">DO Pengisian</h1>
          <p>Catat jumlah muatan yang dibawa sopir setiap hari. Data ini hanya untuk pencatatan dan tidak mempengaruhi stok.</p>
        </div>
        <div className="flex gap-5 h-[45px] w-[30%]">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border ml-2 mb-2 rounded-md w-full text-left py-1 px-3 border-[#000]"></input>
          <button onClick={() => setCreateModal(true)} className="bg-[#222C5F] text-white px-3 h-[40px] rounded-xl font-semibold w-full">+ BUAT DO BARU</button>
        </div>
      </div>

      <div className="px-10 mt-5 text-[#818181] flex">
        <div className="w-[70vw]">
          {/* Riwayat DO Pengisian */}
          <div className="">
            <h2 className="text-lg font-semibold mb-3">Riwayat DO Pengisian</h2>
            <div className="mr-5 overflow-y-auto rounded-xl h-[65vh]">
              <table className="w-full table-fixed border-separate">
                <colgroup>
                  <col className="w-[5%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[5%]" />
                  <col className="w-[5%]" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="sticky top-0 z-20 bg-[#222C5F] text-white py-2" rowSpan={2}>No</th>
                    <th className="sticky top-0 z-20 bg-[#222C5F] text-white py-2" rowSpan={2}>Tanggal</th>
                    <th className="sticky top-0 z-20 bg-[#222C5F] text-white py-2" rowSpan={2}>No Transaksi</th>
                    <th className="sticky top-0 z-20 bg-[#222C5F] text-white py-2" rowSpan={2}>Sopir</th>

                    <th className="sticky top-0 z-20 bg-[#222C5F] text-white py-2" colSpan={2}>Muatan (Bag)</th>
                    <th className="sticky top-0 z-20 bg-[#222C5F] text-white py-2" colSpan={2}>Terjual (Bag)</th>
                    <th className="sticky top-0 z-20 bg-[#222C5F] text-white py-2" colSpan={2}>Retur (Bag)</th>
                    <th className="sticky top-0 z-20 bg-[#222C5F] text-white py-2" colSpan={2}>Aksi</th>
                  </tr>
                  <tr>
                    <th className="sticky top-10 z-20 bg-[#222C5F] text-white py-2">10 Kg</th>
                    <th className="sticky top-10 z-20 bg-[#222C5F] text-white py-2">5 Kg</th>

                    <th className="sticky top-10 z-20 bg-[#222C5F] text-white py-2">10 Kg</th>
                    <th className="sticky top-10 z-20 bg-[#222C5F] text-white py-2">5 Kg</th>

                    <th className="sticky top-10 z-20 bg-[#222C5F] text-white py-2">10 Kg</th>
                    <th className="sticky top-10 z-20 bg-[#222C5F] text-white py-2">5 Kg</th>

                    <th className="sticky top-10 z-20 bg-[#222C5F] text-white py-2">Edit</th>
                    <th className="sticky top-10 z-20 bg-[#222C5F] text-white py-2">Del</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    dataPengisian.map((row, id) => (
                      <tr className={`
                      ${
                        id % 2 === 0
                        ? "bg-[#e6f2fb]"
                        : "bg-white"
                      } text-center hover:bg-gray-200 cursor-pointer`}>
                        <td>{id + 1}</td>
                        <td>{row.date}</td>
                        <td>{row.delivery_number}</td>
                        <td>{drivers.find((data)=> data.id === row.driver_id)?.name}</td>
                        <td>{row.muat_10kg || '-'}</td>
                        <td>{row.muat_5kg || '-'}</td>
                        <td>{row.jual_10kg || '-'}</td>
                        <td>{row.jual_5kg || '-'}</td>
                        <td>{row.retur10kg || '-'}</td>
                        <td>{row.retur5kg || '-'}</td>
                        <td><Pencil onClick={() => {setEditModal(true); setActiveRow(row.id)}} className="w-[25px] h-[25px] m-auto"></Pencil></td>
                        <td><Trash onClick={() => handleDelete(row.id)} className="w-[25px] h-[25px] m-auto"></Trash></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Sopir Kinerja Recap */}
        <div className="h-[70vh] shadow-lg w-[30vw] px-5">
          <h1 className="text-lg font-semibold mb-3">Rekap Penjualan</h1>
          <table className="w-full">
            <thead>
              <tr>
                <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">No</th>
                <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">Nama Sopir</th>
                <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">Terjual (kg)</th>
                <th className="sticky top-0 z-20 bg-[#ECF6FE] rounded-lg py-2">Retur (kg)</th>
              </tr>
            </thead>
            <tbody>
              {
                recap?.map((row,id) => (
                  <tr key={id} className="text-center">
                    <td>{id + 1}</td>
                    <td>{row.driver_name}</td>
                    <td>{row.total_terjual}</td>
                    <td>{row.total_retur_rusak}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Do;