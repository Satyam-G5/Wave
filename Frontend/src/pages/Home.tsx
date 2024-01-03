import React from 'react'
import Image from '../components/Image.avif'
import { Link } from 'react-router-dom'

const Home: React.FC = () => {
  return (
    <div className='h-screen w-screen bg-custom '>

      <div className='flex flex-row justify-around'>
        <div className='flex flex-col mt-44 w-[90vh]'>
          <h3 className='text-3xl text-slate-600 font-semibold mb-4 w-[80vh]'>Host your Web Meetings</h3>
          <h1 className='text-6xl text-black font-bold p-2'>Online Meeting Platform Just For U ...</h1>
          <h4 className='text-2xl text-slate-500 font-semibold mt-10 w-[80vh]'>Empower your device with face-to-face collaboration and connect with your family and friends enywhere and everywhere . Start waving and connect with people across the world  .</h4>
          <div className='flex flex-row p-2'>
          <Link className='' to="/contactList">
            <button className='flex flex-row mt-12 ml-6 h-12 w-40 text-black bg-green-600 hover:text-white hover:bg-black font-semibold border-2 rounded-full '>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className=" ml-2 mt-3 lucide lucide-phone-call"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /><path d="M14.05 2a9 9 0 0 1 8 7.94" /><path d="M14.05 6A5 5 0 0 1 18 10" /></svg>
              <span className='mt-2 ml-2 font-semibold'>Start Waving</span>
            </button>
          </Link>
          <Link className='' to="/about">
            <button className='flex flex-row mt-12 ml-6 h-12 w-88 text-black hover:text-white hover:bg-black font-semibold border-2 rounded-full border-black'>
              <span className='mt-2 ml-2 text-md font-semibold'>Know More About Wave </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="ml-2 mr-2 mt-2 lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </Link>
          </div>
        </div>
        <div className='mt-52'>
          <img className='shadow-lg rounded-md h-auto w-[60vh]' src={Image} alt="Some Image" />
        </div>
      </div>
    </div>
  )
}

export default Home
