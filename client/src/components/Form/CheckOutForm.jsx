import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import {HashLoader} from 'react-spinners'
import './common.css';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const CheckOutForm = ({totalPrice,closeModal,orderData,refetch}) => {
console.log(orderData);

    const stripe = useStripe()
    const elements = useElements()
    const [cardError, setCardError] = useState(null)
    const [processing, setProcessing] = useState(false);
    const axiosSecure = useAxiosSecure()
    const [clientSecret, setClientSecret] = useState('')
    const {user} = useAuth()


    useEffect(()=>{
        const paymentIntent = async()=>{
            const {data} = await axiosSecure.post('/create-payment-intent',{
                quantity: orderData?.quantity,
                plantId: orderData?.plantId
            })
            console.log(data);
            setClientSecret(data?.clientSecret)
        }
        paymentIntent()
    },[axiosSecure,orderData])


    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();
        setProcessing(true)
    
        if (!stripe || !elements) {
          // Stripe.js has not loaded yet. Make sure to disable
          // form submission until Stripe.js has loaded.
          return;
        }
    
        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);
    
        if (card == null) {
          return;
        }
    
        // Use your card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
          type: 'card',
          card,
        });
    
        if (error) {
          console.log('[error]', error);
          setCardError(error.message)
          setProcessing(false)
        } else {
          console.log('[PaymentMethod]', paymentMethod);
          setCardError(null)
        }

        const result = await stripe.confirmCardPayment(clientSecret,{
           payment_method:{
            card,
            billing_details:{
                name: user?.disPlayName,
                email: user?.email
            }
           }
        })
        console.log(result);

        if(result?.error ){
            setCardError(result?.error?.message)
            return
        }

        if(result?.paymentIntent?.status === 'succeeded'){
           orderData.transactionId = result?.paymentIntent?.id

        //   console.log(orderData.transactionId);

        try {
          const {data} =  await axiosSecure.post('/orders',orderData)
        //   console.log(data);
        if(data?.insertedId){
            toast.success('order placed successfully')
        }
        const {data: result} = await axiosSecure.patch(`/quantity-update/${orderData?.plantId}`,{
            quantityToUpdate: orderData?.quantity,
            status: 'decrease'
        })
        console.log(result);
        refetch()
            
        } catch (error) {
            console.log(error);
            
        }finally{
            setProcessing(false)
            setCardError(null)
            closeModal()
        }
        }
      };


    return (
        <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      {
        cardError && <p className='text-red-600'>{cardError}</p>
      }

      <div className='flex justify-between'>
      <button className=' my-2 bg-indigo-900 text-white  p-2' type="submit" disabled={!stripe || processing}>
        {
            processing ? ( <HashLoader size={18} className='my-2' />) : `pay $${totalPrice}`
        }
      </button>
      <button onClick={closeModal} className=' my-2 bg-indigo-900 text-white p-2' type="submit" >
        cancel
      </button>
      </div>
    </form>
    );
};

export default CheckOutForm;