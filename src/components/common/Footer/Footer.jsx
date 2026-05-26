import { Link } from 'react-router-dom'
import {
  BiLogoFacebook,
  BiLogoTwitter,
  BiLogoInstagram,
  BiLogoLinkedin,
} from 'react-icons/bi'

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-12 rounded-xl bg-gradient-to-r from-rose-50 to-blue-50 p-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-950">
              Get Exclusive Offers
            </h3>
            <p className="max-w-lg text-slate-600">
              Subscribe to our newsletter and get 10% off on your first purchase
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-600 focus:bg-white"
              />
              <button className="rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-3 font-bold text-white transition hover:shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand */}
          <div>
            <div className="flex items-center text-2xl font-black tracking-tight">
              <span className="text-[#ff3f6c]">M</span>
              <span className="text-[#ff905a]">Y</span>
              <span className="text-[#f2c210]">N</span>
              <span className="text-[#03a685]">T</span>
              <span className="text-[#03a9f4]">R</span>
              <span className="text-[#ff3f6c]">A</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Your ultimate fashion destination. Shop trending styles at unbeatable prices.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wide text-slate-950">
              Shop
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link to="/men" className="text-slate-600 transition hover:text-rose-600">
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/women"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/kids"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Kids
                </Link>
              </li>
              <li>
                <Link
                  to="/beauty"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Beauty
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wide text-slate-950">
              Support
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Returns & Exchange
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Track Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wide text-slate-950">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-600 transition hover:text-rose-600"
                >
                  Sustainability
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wide text-slate-950">
              Follow Us
            </h4>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-950 transition hover:bg-rose-600 hover:text-white"
              >
                <BiLogoFacebook className="text-lg" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-950 transition hover:bg-rose-600 hover:text-white"
              >
                <BiLogoTwitter className="text-lg" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-950 transition hover:bg-rose-600 hover:text-white"
              >
                <BiLogoInstagram className="text-lg" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-950 transition hover:bg-rose-600 hover:text-white"
              >
                <BiLogoLinkedin className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 border-t border-slate-200 pt-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-950">
                We Accept All Payment Methods
              </p>
              <div className="mt-3 flex gap-3">
                {['Visa', 'Mastercard', 'UPI', 'PayPal'].map((method) => (
                  <span
                    key={method}
                    className="rounded bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <p className="text-center text-sm text-slate-600">
              © 2024 Myntra Clone. All rights reserved. |{' '}
              <a href="#" className="hover:text-rose-600">
                Privacy Policy
              </a>{' '}
              |{' '}
              <a href="#" className="hover:text-rose-600">
                Terms & Conditions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
