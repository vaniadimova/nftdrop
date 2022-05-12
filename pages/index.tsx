import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typing'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  console.log(collections)
 
  return (
    <div className="2xl:px-0∫ mx-auto flex max-w-7xl flex-col py-20 px-10">
      <Head>
        <title>NFT Drop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <h1 className='mb-10 text-4xl cursor-pointer w-52 font-extralight'>
        <span className='font-extrabold underline decoration-orange-600/50'>
                   VanidD
        </span>{' '}
                  NFT Market Place
            </h1> {''}
            <main className="p-10 shadow-xl bg-slate-100 shadow-orange-400/20">
              <div className="grid space-x-3 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" >
              {collections.map((collection) => (
                 <Link key={collection._id} href={`/nft/${collection.slug.current}`}>
                 <div className="flex flex-col items-center transition-all duration-200 cursor-pointer hover:scale-105">
                   <img
                     className="object-cover h-96 w-60 rounded-2xl"
                     src={urlFor(collection.mainImage).url()}
                     alt=""
                   />
                   <div className="py-5">
                     <h2 className="text-3xl">{collection.title}</h2>
                     <p className="mt-2 text-sm text-gray-500">
                       {collection.description}
                     </p>
                   </div>
                 </div>
               </Link>
             ))}
          </div>
       </main>
  </div>
    )
  }

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type == "collection"]{
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
  const collections = await sanityClient.fetch(query)

  console.log(collections)
  return {
    props: {
      collections,
    },
  } 

}
