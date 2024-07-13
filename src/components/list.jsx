import React from "react";
import { BsTrash } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import axios from "axios";
import { baseUrl } from "../utils/constant";
// const BASE_URI = process.env.BASE_URI

const list = ({ id, name, amount, comment, setUpdateUi, updateMode }) => {

    const removeInformation = async () => {
        axios.delete(`${baseUrl}/delete/${id}`).then((res) => {
            alert("Deleted Successfully!")
            console.log(res)
            setUpdateUi((prevState) => !prevState)
        })
    }
    
        return (
            <tr key={id}>
                <td className="text-center border p-4 text-gray-700">{name}</td>
                <td className="text-center border p-4 text-gray-700">{amount}</td>
                <td className="text-center border p-4 text-gray-700">{comment}</td>
                <td className="text-center border p-4 text-gray-700 flex justify-center items-center space-x-2">
                    <BiEditAlt
                    className="text-blue-500 cursor-pointer hover:text-blue-600 transition duration-300"
                    size={24}
                    onClick={() => updateMode(id, name, amount, comment)}
                    />
                    <BsTrash
                    className="text-red-500 cursor-pointer hover:text-red-600 transition duration-300"
                    size={24}
                    onClick={removeInformation}
                    />
                </td>
            </tr>
        )
}

export default list