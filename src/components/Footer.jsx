import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-800 to-purple-950 text-white py-8 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-xl">JobPortal</span>
          <p className="text-sm text-gray-300">Connecting talent with opportunity</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/jobs" className="hover:underline">Jobs</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
        <div className="mt-4 md:mt-0 text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer;