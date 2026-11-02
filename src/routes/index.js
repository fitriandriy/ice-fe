import React from 'react'
import { Routes, Route } from "react-router-dom"
import Sales from "../pages/sales.js"
import InputSales from '../pages/inputSales.js'
import Costs from "../pages/costs.js"
import InputCost from "../pages/inputCost.js"
import Stok from "../pages/stok.js"
import Pengisian from "../pages/do.js"

const Router = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route exact path="/" Component={Pengisian} />
        <Route exact path="/penjualan" Component={Sales} />
        <Route exact path="/penjualan/input" Component={InputSales} />
        <Route exact path="/biaya" Component={Costs} />
        <Route exact path="/biaya/input" Component={InputCost} />
        <Route exact path="/stok" Component={Stok} />
        <Route exact path="/pengisian" Component={Pengisian} />
      </Routes>
    </React.Fragment>
  )
}

export default Router