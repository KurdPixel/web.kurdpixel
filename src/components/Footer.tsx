import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
<footer dir="rtl" className="p-4 bg-[#121212] border-t border-gray-700 sm:p-6">
  <div className="mx-auto max-w-6xl">
    <div className="md:flex md:justify-between">
      <div className="mb-6 md:mb-0">
        <Link href={"/"}>
        <img src="https://i.imgur.com/8Udniyn.png" className="h-11" alt="" />
        </Link>
        <p className="pt-2">کوردپیکسڵ یەکەمین و پڕبینەرترین ماڵپەڕی تایبەت بە فیلم و دراما کوردی و جیهانیەکان</p>
      </div>

      <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3 text-right">
        <div>
          <h2 className="mb-6 text-lg font-semibold text-violet-500 uppercase">
            فیلم
          </h2>
          <ul className="text-gray-300">
            <li className="mb-4">
             <Link href="/movies" className="hover:underline">
              فیلمەکان
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-6 text-lg font-semibold text-violet-500 uppercase">
            زنجیرە
          </h2>
          <ul className="text-gray-300">
            <li className="mb-4">
             <Link href="/movies" className="hover:underline">
              فیلمەکان
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-6 text-lg font-semibold text-violet-500 uppercase">
            دەربارە
          </h2>
          <ul className="text-gray-300">
            <li className="mb-4">
             <Link href="/staff" className="hover:underline">
              ستاف
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <hr className="my-6 border-violet-500 sm:mx-auto lg:my-8" />

    <div className="sm:flex sm:items-center sm:justify-between text-right">
      <span className="text-sm text-gray-600 sm:text-center">
        &copy; {new Date().getFullYear()} <span className="text-violet-500">KurdPixel</span> . هەموو مافەکان پارێزراون.
      </span>

      <div className="flex mt-4 space-x-6 space-x-reverse sm:justify-center sm:mt-0">
        <a href="https://discord.gg/VZHMZJDprW" target="_blank" className="text-gray-500 hover:text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.942 5.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.586 11.586 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3 17.392 17.392 0 0 0-2.868 11.662 15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.638 10.638 0 0 1-1.706-.83c.143-.106.283-.217.418-.331a11.664 11.664 0 0 0 10.118 0c.137.114.277.225.418.331-.544.328-1.116.606-1.71.832a12.58 12.58 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM8.678 14.813a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.929 1.929 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</footer>

  );
}