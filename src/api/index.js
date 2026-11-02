import axios from "axios"
const ENDPOINT = process.env.REACT_APP_TAXIFY_API_URL

export const addSales = async (data) => {
  try {
    const res = await axios.post(`${ENDPOINT}/sales`, {
      data
    })
    return res
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getAllSales = async (startDate, endDate) => {
  try {
    const res = await axios.get(`${ENDPOINT}/sales`,
      {
        params : {
          startDate,
          endDate
        }
      }
    )
    return res
  } catch (error) {
    console.log(error)
    return error
  }
}

export const deleteSales = async (id) => {
  try {
    const res = await axios.delete(`${ENDPOINT}/sales/${id}`)
    return res
  } catch (error) {
    return error
  }
}

export const inputSales = async (data) => {
  try {
    const res = await axios.post(`${ENDPOINT}/sales/input`, {
      data
    })
    return res
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getCustomers = async (data) => {
  try {
    const res = await axios.get(`${ENDPOINT}/data/customers`)
    return res
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getProducts = async (data) => {
  try {
    const res = await axios.get(`${ENDPOINT}/data/products`)
    return res
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getCosts = async (startDate, endDate, bank_id) => {
  try {
    const res = await axios.get(`${ENDPOINT}/costs`,
      {
        params : {
          startDate,
          endDate,
          bank_id
        }
      })
    return res
  } catch (error) {
    return error
  }
}

export const deleteCosts = async (id) => {
  try {
    const res = await axios.delete(`${ENDPOINT}/costs/${id}`)
    return res
  } catch (error) {
    return error
  }
}

export const getCostTypes = async () => {
  try {
    const res = await axios.get(`${ENDPOINT}/data/cost_types`)
    return res
  } catch (error) {
    return error
  }
}

export const putCosts = async (data) => {
  try {
    const res = await axios.put(`${ENDPOINT}/costs`, {
      data
    })
    return res
  } catch (error) {
    return error
  }
}

export const getBankAccounts = async () => {
  try {
    const res = await axios.get(`${ENDPOINT}/data/bank_accounts`)
    return res
  } catch (error) {
    return error
  }
}

export const getLatestCostId = async (date) => {
  try {
    const resp = await axios.get(`${ENDPOINT}/costs/latest_id/${date}`
    )
    return resp
  } catch (error) {
    return error
  }
}

export const inputCost = async (noTrans, date, selectedBankAccount, selectedCostType, description, nominal) => {
  try {
    const res = await axios.post(`${ENDPOINT}/costs/input`, {
      date,
      noTrans,
      bankAccount: selectedBankAccount,
      costType: selectedCostType,
      description,
      nominal
    })
    return res
  } catch (error) {
    return error
  }
}

export const inputCashIn = async (noTrans, date, selectedBankAccount, selectedCostType, description, nominal) => {
  try {
    const res = await axios.post(`${ENDPOINT}/costs/input_cash_in`, {
      date,
      noTrans,
      bankAccount: selectedBankAccount,
      costType: selectedCostType,
      description,
      nominal
    })
    return res
  } catch (error) {
    return error
  }
}

export const getDrivers = async () => {
  try {
    const res = await axios.get(`${ENDPOINT}/data/drivers`)
    return res
  } catch (error) {
    return error
  }
}

export const inputSalePayment = async (date, nominal, saleId, selectedBank, status, noTrans) => {
  try {
    const res = await axios.post(`${ENDPOINT}/sales/payment`, {
      date,
      amount: nominal,
      sales_id: saleId,
      bank_account_id: selectedBank,
      status,
      transaction_number: noTrans
    })
    return res
  } catch (error) {
    return error
  }
}

export const addStock = async (date, product_id, product_transaction_id, amount) => {
  try {
    const res = await axios.post(`${ENDPOINT}/stock`, {
      date,
      product_id,
      product_transaction_id,
      amount
    })
    return res
  } catch (error) {
    return error
  }
}

export const getStock = async (startDate, endDate) => {
  try {
    const res = await axios.get(`${ENDPOINT}/stock`,
    {
      params : {
        startDate,
        endDate
      }
    })
    return res
  } catch (error) {
    return error
  }
}

export const deleteStock = async (id) => {
  try {
    const res = axios.delete(`${ENDPOINT}/stock/${id}`)
    return res
  } catch (error) {
    return error
  }
}

export const addPengisian = async (date, driver_id, muat_10kg, muat_5kg) => {
  try {
    const res = await axios.post(`${ENDPOINT}/deliveries`, {
      date,
      driver_id,
      muat_10kg,
      muat_5kg
    })
    return res
  } catch (error) {
    return error
  }
}

export const getPengisian = async (date) => {
  try {
    const res = await axios.get(`${ENDPOINT}/deliveries`,
      {
        params: {
          date
        }
      }
    )
    return res
  } catch (error) {
    return error
  }
}

export const deletePengisian = async (id) => {
  try {
    const res = axios.delete(`${ENDPOINT}/deliveries/${id}`)
    return res
  } catch (error) {
    return error
  }
}

export const updatePengisian = async (id, terjual_10kg, terjual_5kg, retur_10kg, retur_5kg) => {
  try {
    const res = await axios.put(`${ENDPOINT}/deliveries/${id}`, {
      terjual_10kg, terjual_5kg, retur_10kg, retur_5kg
    })
    return res
  } catch (error) {
    return error
  }
}