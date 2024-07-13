import React from "react";
import { BsTrash } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import axios from "axios";
import { baseUrl } from "../utils/constant";

const list = ({ id, name, amount, comment, setUpdateUi, updateMode }) => {

    const removeInformation = () => {
        axios.delete(`${baseUrl}/delete/${id}`).then((res) => {
            console.log(res)
            setUpdateUi((prevState) => !prevState)
        })
    }
    
        return (
            <li>
                name: {name}<br></br>
                amount: {amount}<br></br>
                comment: {comment}<br></br>
                <div className="\icon_holder">
                        <BiEditAlt className="icon" onClick={() => updateMode(id, name, amount, comment)}/>
                        <BsTrash className="icon" onClick={removeInformation}/>
                </div>
            </li>
        )
}

export default list