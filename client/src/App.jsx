import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
function App() {
  const [addOrEditBool, setaddOrEditBool] = useState(false)
  const [expenses, setExpenses] = useState([])
  const [addOrEdit, setaddOrEdit] = useState('add')
  const [expense, setexpense] = useState({
    amount:0,
    desc:'',
    category:''
  })
  const [id, setid] = useState(0)
  useEffect(() => {
    fetchExpenses()
  }, [addOrEditBool])

  async function fetchExpenses(){
    try{
      let temp=await axios.get('http://localhost:8800/expenses')
      setExpenses(temp.data)
    }
    catch(err){
      console.log(err)
    }
    setaddOrEditBool(!addOrEditBool)
  }

  async function handleSubmit(e){
    e.preventDefault()
    if(addOrEdit==='add'){
      try{
        await axios.post('http://localhost:8800/addExpense',expense)
      }
      catch(err){
        console.log(err)
      }
    }
    else if(addOrEdit==='edit'){
      try{
        await axios.put('http://localhost:8800/editExpense/'+id,expense)
      }
      catch(err){
        console.log(err)
      }
    }
    setaddOrEditBool(!addOrEditBool)
    setexpense({
      amount:0,
      desc:'',
      category:''
    })
    setaddOrEdit('add')
  }

  const handleChange=(e)=>{
    setexpense((prev)=>({...prev, [e.target.name]:e.target.value }))
  }
  
  const handleEdit=async(id)=>{
    setid(id)
    setaddOrEdit('edit')
    try{
      let temp=await axios.get('http://localhost:8800/getExpense/'+id)
      console.log(temp)
      setexpense({
        amount:temp.data.amount,
        desc:temp.data.desc,
        category:temp.data.category
      })
    }
    catch(err){
      console.log(err)
    }
  }

  const handleDelete=async(id)=>{
    try{
      await axios.delete("http://localhost:8800/deleteExpense/" + id);
      setaddOrEditBool(!addOrEditBool)
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <div>

    <form onSubmit={(e)=>handleSubmit(e)}>
      <input value={expense.amount} onChange={handleChange} type='number' name='amount' placeholder='Amount' />
      <input value={expense.desc} onChange={handleChange} type='text' name='desc' placeholder='Description' />
      <select value={expense.category} onChange={handleChange} name='category'>
        <option>Fuel</option>
        <option>Electricity</option>
        <option>Food</option>
        <option>Drinks</option>
        <option>Hotel</option>
      </select>
      <button type='submit'>Submit</button>
    </form>

      {expenses.map((each)=>{
        return (
          <div key={each.id}>
            {each.amount} - {each.desc} - {each.category}
            <button onClick={()=>handleEdit(each.id)}>Edit</button>
            <button onClick={()=>handleDelete(each.id)}>Delete</button>
          </div>
        )
      })}
    </div>
  )
}

export default App
