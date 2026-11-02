import React from "react"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorPenjualan, setAnchorPenjualan] = React.useState(null);
  const [anchorBiaya, setAnchorBiaya] = React.useState(null);
  const [anchorStok, setAnchorStok] = React.useState(null);
  const [anchorDo, setAnchorDo] = React.useState(null);
  const openPenjualan = Boolean(anchorPenjualan);
  const openBiaya = Boolean(anchorBiaya);
  const openStok = Boolean(anchorStok)
  const openDo = Boolean(anchorDo)
  const handleOpenPenjualan = (event) => {
    setAnchorPenjualan(event.currentTarget);
  };
  const handleOpenBiaya = (event) => {
    setAnchorBiaya(event.currentTarget);
  };
  const handleOpenStok = (event) => {
    setAnchorStok(event.currentTarget)
  }
  const handleOpenDo = (event) => {
    setAnchorDo(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorPenjualan(null);
    setAnchorBiaya(null);
    setAnchorStok(null);
    setAnchorDo(null)
  };
  return (
    <div>
      <div className="flex justify-between pt-5 px-10">
        <div className="flex">
          <img src="/assets/taxify-icon.png" alt="" className="w-[160px] h-[35px]" />
          <div className="flex justify-between gap-10 pl-10 text-[#666] m-auto">
            <button
              id="basic-button"
              aria-controls={openDo ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openDo ? 'true' : undefined}
              onClick={handleOpenDo}
              className={`cursor-pointer ${
                ["/", "/pengisian"].includes(location.pathname)
                  ? "underline text-[#222C5F] font-bold"
                  : ""
              }`}
            >DO PENGISIAN</button>
            <Menu
              id="basic-menu"
              anchorEl={anchorDo}
              open={openDo}   
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              <MenuItem onClick={() => navigate("/pengisian")}>Input Pengisian</MenuItem>
            </Menu>

            <button
              id="basic-button"
              aria-controls={openPenjualan ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openPenjualan ? 'true' : undefined}
              onClick={handleOpenPenjualan}
              className={`cursor-pointer ${
                ["/penjualan/input", "/penjualan/import", "/penjualan"].includes(location.pathname)
                  ? "underline text-[#222C5F] font-bold"
                  : ""
              }`}
            >PENJUALAN</button>
            <Menu
              id="basic-menu"
              anchorEl={anchorPenjualan}
              open={openPenjualan}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }}
            >
              <MenuItem onClick={() => navigate("/penjualan/input")}>Input Penjualan</MenuItem>
              <MenuItem onClick={() => navigate("/penjualan")}>Laporan Penjualan</MenuItem>
            </Menu>

            <button
              id="basic-button"
              aria-controls={openBiaya ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openBiaya ? 'true' : undefined}
              onClick={handleOpenBiaya}
              className={`cursor-pointer ${
                ["/biaya/input", "/biaya", "/biaya/laporan"].includes(location.pathname)
                  ? "underline text-[#222C5F] font-bold"
                  : ""
              }`}
            >BIAYA</button>
            <Menu
              id="basic-menu"
              anchorEl={anchorBiaya}
              open={openBiaya}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }
            }
            >
              <MenuItem onClick={() => navigate("/biaya/input")}>Input Biaya</MenuItem>
              <MenuItem onClick={() => navigate("/biaya")}>Biaya</MenuItem>
            </Menu>

            <button
              id="basic-button"
              aria-controls={openStok ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openStok ? 'true' : undefined}
              onClick={handleOpenStok}
              className={`cursor-pointer ${
                ["/stok"].includes(location.pathname)
                  ? "underline text-[#222C5F] font-bold"
                  : ""
              }`}
            >STOCK</button>
            <Menu
              id="basic-menu"
              anchorEl={anchorStok}
              open={openStok}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button',
                },
              }
            }
            >
              <MenuItem onClick={() => navigate("/stok")}>Hasil Produksi</MenuItem>
            </Menu>
          </div>
        </div>
        <button className="rounded-xl bg-[#FFC91B] py-2 px-5 font-bold">LOGOUT</button>
      </div>
    </div>
  )
}

export default NavBar