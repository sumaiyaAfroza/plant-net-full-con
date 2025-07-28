import { useState } from "react";
import AddPlantForm from "../../../components/Form/AddPlantForm";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import imageUpload from "../../../imageUpload";
import toast from "react-hot-toast";

const AddPlant = () => {
  const { user } = useAuth();

  const [uploadedImage, setUploadedImage] = useState(null);
  
  const [imageUploadError,setImageUploadError ] = useState(null)

   const [isUploading, setIsUploading] = useState(false)

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true)
    const form = e.target;
    const name = form?.name?.value;
    const category = form?.category?.value;
    const description = form?.description?.value;
    const price = form?.price?.value;
    const quantity = form?.quantity?.value;

    // const image = form?.image?.files[0];  
    // const imageUrl = await imageUpload(image);  /**item er image ta show korar jonno alada akta component imbb image er api key dia fetch kora hoise . direct link na dia */

     try {
      const plantData = {
        name,
        category,
        description,
        price:parent(price),
        quantity: parseInt(quantity),
        // image: imageUrl,
        image: uploadedImage,
        seller: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        },
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/add-plant`,
        plantData
      )
      toast.success('Plant Data Added Successfully, Yeee!')
      form.reset()
      console.log(data)
    } catch (err) {
      console.log(err)
    } finally {
      setIsUploading(false)
    }
  };


   const handleImage= async(e)=>{
    e.preventDefault()
     const image = e.target.files[0];
     console.log(image)

     try {
       const imageUrl = await imageUpload(image)
      console.log(imageUrl)
      setUploadedImage(imageUrl)
      
     } catch (error) {
      setImageUploadError('image uploade faild',error)
     } 
   }

  return (
    <div>
      {/* Form */}
      <AddPlantForm handleFormSubmit={handleFormSubmit} isUploading={isUploading}
      uploadedImage={uploadedImage} handleImage={handleImage} imageUploadError={imageUploadError}
      />
    </div>
  );
};

export default AddPlant;
