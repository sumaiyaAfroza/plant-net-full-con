import axios from "axios"

export const userId = async (user) =>{
    const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/users`,user)
    console.log(data);
}