import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from "axios";
import List from './components/list';
import { baseUrl } from './utils/constant';
// const BASE_URI = process.env.BASE_URI

function App() {
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [informations, setInformations] = useState([]);
  const [updateUi, setUpdateUi] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getInformation();

    const updateInboxEmail = () => {
      axios.post(`${baseUrl}/`).then((res) => {
        console.log(res.data);
      });
    };

    const intervalId = setInterval(updateInboxEmail, 3000);
    return () => clearInterval(intervalId);
  }, [updateUi]);

  const getInformation = () => {
    axios.get(`${baseUrl}/get`).then((res) => {
      setInformations(res.data);
    });
  };

  const searchInformations = () => {
    
    if (searchTerm === "") {
      getInformation();
      return
    }

    axios.post(`${baseUrl}/search`, { name: searchTerm }).then((res) => {
      setInformations(res.data);
    });
  };

  const createMode = () => {
    setName("");
    setAmount("");
    setComment("");
    setIsModalOpen(true);
    setUpdateUi(false);
  };

  const addInformation = (name, amount, comment) => {

    if (name === "" || amount === "" || comment === "") {
      alert("All fields must be filled!")
      return;
    }

    axios.post(`${baseUrl}/create`, { name: name, amount: parseFloat(amount), comment:comment })
    .then((res) => {
      alert("Created Successfully!")
      setUpdateId("");
      setName("");
      setAmount("");
      setComment("");
      setUpdateUi(true);
      setIsModalOpen(false);
    });
  };

  const updateMode = (id, name, amount, comment) => {
    setName(name);
    setAmount(amount);
    setComment(comment);
    setUpdateId(id);
    setIsModalOpen(true);
    setUpdateUi(true);
  };

  const updateInformation = (id, name, amount, comment) => {
    axios.put(`${baseUrl}/update/${id}`, { name: name, amount: parseFloat(amount), comment: comment })
      .then((res) => {
        alert("Updated successfully!")
        setUpdateUi(prev => !prev);
        setUpdateId(null);
        setName("");
        setAmount("");
        setComment("");
        setIsModalOpen(false);
      });
  };

  return (
    <main>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-700">Email Management</h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-600">Quickly find the information you need!</h2>
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2 w-full">
            <input
              type="text"
              placeholder="Search by a name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 rounded flex-grow"
            />
            <button
              onClick={searchInformations}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Search
            </button>
            <button
              onClick={createMode}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
            >
              Create
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-lg shadow-lg border border-gray-300">
          <table className="min-w-full border-collapse bg-white">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="border p-4">Name</th>
                <th className="border p-4">Amount</th>
                <th className="border p-4">Comment</th>
                <th className="border p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {informations.map(info => (
                <List 
                  key={info._id} 
                  id={info._id} 
                  name={info.name}
                  amount={info.amount}
                  comment={info.comment}
                  setUpdateUi={setUpdateUi}
                  updateMode={updateMode}
                />
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel={updateUi ? "Edit Information" : "Add Information"}
          className="max-w-md w-full p-6 rounded-lg shadow-lg bg-white relative border border-gray-300"
          ariaHideApp={false}
          overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">{updateUi ? "Edit Information" : "Add Information"}</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="comment"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full mb-2 p-2 border border-gray-300 rounded"
            required
          />
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-300 w-1/3"
            >
              Cancel
            </button>
            <button
              onClick={() => { updateUi ? updateInformation(updateId, name, amount, comment) : addInformation(name, amount, comment) }}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 w-1/3"
            >
              {updateUi ? "Save" : "Create"}
            </button>
          </div>
        </Modal>
      </div>
    </main>
  );
}

export default App;