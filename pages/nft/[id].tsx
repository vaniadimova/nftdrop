import React from 'react'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

function DropPage()  {
    // Auth
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();
   // ---
   console.log(address); 
  return (
  <div className='flex flex-col h-screen lg:grid lg:grid-cols-10'>
   {/*Left  */}   
<div className='lg:col-span-4 bg-gradient-to-br from-cyan-300 to-orange-400'>
<div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
<div className='p-2 rounded-xl bg-gradient-to-br from-yellow-300 to-purple-600'>
<img 
className='object-cover rounded-xl w-44 lg:h-96 lg:w-72'
src='https://media.istockphoto.com/vectors/ferocious-gorilla-head-vector-id1049853208?k=20&m=1049853208&s=612x612&w=0&h=QdLfpEBf6msMwVzoTpsKoczGyKFIO-9B-k427tTy5TE=' 
alt=''/>      
    </div>
    <div className='p-5 space-y-2 text-center'>
    <h1 className='text-4xl font-bold text-white'>
        VANIAD STUDIO
    </h1>
    <h2 className='text-xl text-gray-300'>Collection of Appes and NFTs</h2>
</div>
</div>
</div>

 {/*Right  */}  
    <div className='flex flex-col flex-1 p-12 lg:col-span-6'>
         {/* Header  */}  
         <header className='flex items-center justify-between'>
             <h1 className='text-xl cursor-pointer w-52 font-extralight sm:w-80'>
               <span className='font-extrabold underline decoration-orange-500/50'>
                   VanidD</span>{' '}
                  NFT Market Place
                 </h1>
    <button 
    onClick={() => (address ? disconnect() : connectWithMetamask())}
    className='px-4 py-2 text-xs font-bold text-white bg-orange-400 rounded-full lg:px-5 lg:py-3 lg:text-base'>
        {address ? 'Sign Out' : 'Sign In'}
    </button>
         </header>
         
         <hr className='my-2 border' />
{address && (
    <p className='text-sm text-center text-blue-400'>You are logged in with wallet {address.substring(0,  5)}
    ...{address.substring(address.length - 5)}
    </p>
)}
          {/* Content */}  
<div className='flex flex-col items-center flex-1 mt-10 space-y-6 text-center lg:space-y-0 lg:justify-center' >
    <img 
    className='object-cover pb-10 w-80 lg:h-180 '
    src='https://dm0qx8t0i9gc9.cloudfront.net/watermarks/image/rDtN98Qoishumwih/monkey-vectors_f1u5DNd__SB_PM.jpg' alt=''/>
    <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>VANIAD Coding Camp</h1>
    
    <p className='pt-2 text-xl text-orange-500'>13 / 21 NFT's claimed</p>
</div>
           {/* Mint Button  */}  
           <button className='h-16 font-bold text-white bg-orange-400 rounded-full'>
               Mint NFT (0.01 ETH)
           </button>
    </div>   
</div>
  )
}

export default DropPage