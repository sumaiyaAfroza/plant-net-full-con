import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import {Elements} from '@stripe/react-stripe-js'
import CheckOutForm from '../Form/CheckOutForm';
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)



const PurchaseModal = ({ closeModal, isOpen ,plant,refetch}) => {
  // console.log(plant);
  // Total Price Calculation
  
 const {user} = useAuth()
 const { name, category, quantity, price, _id, seller, image } =  plant || {}
 
//  console.log(plant);

 const [selectedQuantity, setSelectedQuantity] =  useState(1)
 const [totalPrice, setTotalPrice] = useState(price)
 const [orderData, setOrderData] = useState({
  customer: {
    name: user?.displayName,
    email: user?.email,
    image: user?.photoURL
  },
  seller,
  plantId: _id,
  quantity: 1,
  price: price,
  plantName: name,
  plantCategory: category,
  plantImage: image 
 }) 

 useEffect(() => {
  if (plant && user) {
    setOrderData({
      customer: {
        name: user.displayName,
        email: user.email,
        image: user.photoURL
      },
      seller: plant.seller,
      plantId: plant._id,
      quantity: 1,
      price: plant.price,
      plantName: plant.name,
      plantCategory: plant.category,
      plantImage: plant.image
    })
  }
}, [plant, user])

 console.log(orderData);

 const handleQuantity = value =>{
  // console.log(typeof value);
  const totalQuantity = parseInt(value)
  if(totalQuantity > quantity){
    return toast.error('you cannot purchase')
  }
  const calculation = totalQuantity * price
  setSelectedQuantity(totalQuantity)
  setTotalPrice(calculation)

  setOrderData(prev => ({
    ...prev,
    price: calculation, quantity: totalQuantity
  }))


  setOrderData(prev => ({
    ...prev,
    price: calculation,
    quantity: totalQuantity
  }))
  //  console.log(orderData);
 }


// ==========================

//  const handleOrder = ()=>{
//   console.log(orderData);
//    }
  
  return (
    <Dialog
      open={isOpen}
      as='div'
      className='relative z-10 focus:outline-none '
      onClose={closeModal}
    >
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogPanel
            transition
            className='w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl'
          >
            <DialogTitle
              as='h3'
              className='text-lg font-medium text-center leading-6 text-gray-900'
            >
              Review Info Before Purchase
            </DialogTitle>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Plant: {name}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Category: {category}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Customer: {user?.displayName}</p>
            </div>

            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Price: {price}</p>
            </div>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Available Quantity: {quantity}</p>
            </div>

            <hr className='mt-6' />
            <p>OrderInfo:</p>
            <input
            value={selectedQuantity} 
            onChange={(e) => handleQuantity(e.target.value)} 
            className=' border px-4' 
            type="number" 
            min={1}/>
            <div>
            <p>selected Quantity: {selectedQuantity} </p>
          </div>
          <div>
            <p>total Price : {totalPrice} </p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckOutForm refetch={refetch} closeModal={closeModal} totalPrice={totalPrice} orderData={orderData}>

            </CheckOutForm>
          </Elements>
         


          </DialogPanel>
          
        </div>
        
      </div>
    </Dialog>
  )
}

export default PurchaseModal


