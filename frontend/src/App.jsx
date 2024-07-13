import React, { useEffect, useState } from 'react';
import List from './components/list';
import axios from "axios";
import { baseUrl } from './utils/constant';

function App() {

  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [comment, setComment] = useState("")
  const [informations, setInformations] = useState([])
  const [updateUi, setUpdateUi] = useState(false)
  const [updateId, setUpdateId] = useState(null)

  useEffect(() => {
    axios.get(`${baseUrl}/get`).then((res) => {
      console.log(res.data);
      setInformations(res.data)
    })
  }, [updateUi]);

  const addInformation = () => {
    axios.post(`${baseUrl}/save`, { name: name, amount: parseFloat(amount), comment: comment }).then((res) => {
      console.log(res.data);
      setName("")
      setAmount("")
      setComment("")
      // console.log((prevState) => !prevState);
      setUpdateUi((prevState) => !prevState)
    })
  };

  const updateMode = (id, name, amount, comment) => {
    setName(name)
    setAmount(amount)
    setComment(comment)
    setUpdateId(id)
  }

  const updateInformation = () => {
    axios.put(`${baseUrl}/update/${updateId}`, { name: name, amount: 1, comment: comment })
    .then((res) => {
      console.log(res.data);
     setUpdateUi((prevState) => !prevState)
     setUpdateId(null)
     setName("")
     setAmount("")
     setComment("")
    })
  }

  return (
    <main>
      <h1 className="title">Crud Email</h1>

      <div className="input_holder">
        <span>name: </span>
        <input type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)}/>
        <span>amount: </span>
        <input type="number" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)}/>
        <span>comment: </span>
        <input type="text" 
        value={comment} 
        onChange={(e) => setComment(e.target.value)}/>
        <button type="submit" onClick={updateId ? updateInformation : addInformation}>
          {updateId ? "Update Task" : "Add Information"}</button>
      </div>

    <ul>
      {informations.map(info => <List 
      key={info._id} 
      id={info._id} 
      name={info.name}
      amount={info.amount}
      comment={info.comment}
      setUpdateUi={setUpdateUi}
      updateMode={updateMode}/>
      )}
    </ul>
    </main>
  );
}

export default App;