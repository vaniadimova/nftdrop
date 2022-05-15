import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { GetServerSideProps } from 'next';
import { sanityClient, urlFor } from '../../sanity';

import { Collection } from '../../typing'
import Link from 'next/link';

import { BigNumber } from 'ethers'

interface Props {
    collection: Collection
  }
  
function DropPage({ collection }: Props)  {
  const [claimedSupply, setClaimedSupply] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [priceInEth, setPriceInEth] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  const nftDrop = useNFTDrop(collection.address)
  
    // Auth
    const connectWithMetamask = useMetamask();
    const address = useAddress();
    const disconnect = useDisconnect();
   // ---
   useEffect(() => {
    if (!nftDrop) return
    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
    }
    fetchPrice()
  }, [nftDrop])
  
   useEffect(() => {
    if (!nftDrop) return;
    
    const fetchNFTDropData = async () => {
      setLoading(true);
      const claimed = await nftDrop.getAllClaimed();
      const total = await nftDrop.totalSupply();
      
      setClaimedSupply(claimed.length);
      setTotalSupply(total)
      setLoading(false)
    }
    
    fetchNFTDropData();
   }, [nftDrop])

   const mintNFT = () => {
    if (!nftDrop || !address) return;
    
    const quantity = 1; // How many NFT's claimed
    
   setLoading(true)

const notification = toast.loading('Minting NFTs...', {
  style: {
    background: 'white',
    color: 'blue',
    fontWeight: 'bolder',
    fontSize: '17px',
    padding: '20px',
  },
})
  nftDrop
  .claimTo(address, quantity)
  .then(async (tx) => {
      const receipt = tx[0].receipt // transaction receiptn
      const claimedTokenId = tx[0].id
      const claimedNFT = await tx[0].data()
      
      toast('HOORAY... You successfully Minted NFT!', {
        duration: 8000,
        style: {
          background: 'white',
          color: 'blue',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '20px',
        },
      })
    })
    .catch((err) => {
      toast('Wooppss... Something  went wrong!', {
        duration: 8000,
        style: {
          background: 'white',
          color: 'red',
          fontWeight: 'bolder',
          fontSize: '17px',
          padding: '20px',
        },
      })
    })
    .finally(() => {
      setLoading(false)
      toast.dismiss(notification);
    })
}
  
 return (
<div className='flex flex-col h-screen lg:grid lg:grid-cols-10'>

<Toaster position='top-center' />

   {/*Left  */}   
<div className='lg:col-span-4 bg-gradient-to-br from-cyan-300 to-orange-400'>
<div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
<div className='p-2 rounded-xl bg-gradient-to-br from-yellow-300 to-purple-600'>
<img 
className='object-cover rounded-xl w-44 lg:h-96 lg:w-72'
src={urlFor(collection.previewImage).url()} alt=''/>      
    </div>
    <div className='p-5 space-y-2 text-center'>
    <h1 className='text-4xl font-bold text-white'>{collection.nftColletionName}</h1>
    <h2 className='text-xl text-gray-300'>
        {collection.description}
        </h2>
    </div>
 </div>
</div>

 {/*Right  */}  
    <div className='flex flex-col flex-1 p-12 lg:col-span-6'>
{/* Header  */}  
         <header className='flex items-center justify-between'>
             <Link href={'/'}>
             <h1 className='text-xl cursor-pointer w-52 font-extralight sm:w-80'>
               <span className='font-extrabold underline decoration-orange-500/50'>
                   VanidD/Home</span>{' '}
                  NFT Market Place
            </h1>
             </Link>
           
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
    className='object-cover pb-10 w-80 lg:h-40 '
    src={urlFor(collection.mainImage).url()} alt=''/>
    <h1 className='text-3xl font-bold lg:text-5xl lg:font-extrabold'>VANIAD Coding Camp</h1>
    {loading ? (
      <p className='pt-2 text-xl text-blue-400 animate-pulse'>Loading Suply...</p>
    ) : (
    <p className='pt-2 text-xl text-green-400'>{claimedSupply} / {totalSupply?.toString()} NFT's claimed
    </p>
    )}
    {loading && (
      <img 
      className='object-contain h-80 w-80'
      src='https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif' alt='loader' />
    )}
</div>

  {/* Mint Button  */}  
    <button 
    onClick={mintNFT}
    disabled={
      loading || claimedSupply === totalSupply?.toNumber() || !address
    } 
     className='h-16 font-bold text-white bg-orange-400 rounded-full disabled:bg-gray-300'>
     {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>Sign in to Mint</>
          ) : (
            <span> Mint NFT ({priceInEth})ETH</span>
          )}    
        </button>
    </div>   
</div>
  )
}

export default DropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const query = `*[_type == "collection" && slug.current ==$id][0]{
        _id,
        address,
        title,
        description,
        nftColletionName,
        mainImage {
        asset
      },
      previewImage{
        asset
      },
      slug{
        current
      },
      creator->{
        _id,
        name,
        address,
        slug{
        current
      }
      }
      }`
      
      const collection = await sanityClient.fetch(query, {
        id: params?.id,
      })
      if (!collection) {
        return { notFound: true }
      }   
      return {
        props: {
          collection,
        },
      }   
      
}