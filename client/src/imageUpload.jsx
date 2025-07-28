import axios from 'axios'
import React from 'react'

const imageUpload = async (image) => {
   const imageFormData = new FormData()
     imageFormData.append('image',image)
     const {data} = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMG_UPLOAD_KEY}`,imageFormData)
 //  console.log(data)
     return  data?.data?.display_url
}
export default imageUpload
