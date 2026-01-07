import React from "react";

export default function StaffPage() {
  return (
    <section className="pt-28">
      <div className="kurdish-text py-8 px-4 mx-auto max-w-5xl text-center lg:py-16 lg:px-6">
        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
          <h2 className="kurdish-textmb-4 text-4xl tracking-tight font-extrabold text-white">ستافی <span className="text-violet-500">کوردپیکسڵ</span></h2>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">سایتەکەمان بە هاوکاری تیمێکی پسپۆڕ و دڵسۆز کاردەکات. هەر یەکێک لە ئەندامانی تیمەکەمان بەشدارن لە دروستکردنی باشترین ئەزموونی سینەمایی بۆ ئێوە.</p>
        </div>

        <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <img className="mx-auto mb-4 w-36 h-36 rounded-full" src="https://media.discordapp.net/attachments/1456019679486414891/1458066288629911592/Screenshot_2025-12-16_112551.png?ex=695e498c&is=695cf80c&hm=d66440ddf9bf64653983c24d6a21bc17f16431611fb30f643d3d06d9bd972042&=&format=webp&quality=lossless" alt="Bonnie Avatar" />
            <h3 className="mb-1 text-2xl font-bold tracking-tight text-white">
              <a href="#">Haryad</a>
            </h3>
            <p>Co-niggers</p>
          </div>

          {/* Repeat other team members - for brevity include a few examples */}
          <div className="text-center text-gray-500 dark:text-gray-400">
            <img className="mx-auto mb-4 w-36 h-36 rounded-full" src="https://media.discordapp.net/attachments/1112629062893056113/1455265869637746718/Screenshot_2025-12-29_212624.png?ex=695dfcb4&is=695cab34&hm=cf156a91bf34c5845011a079132d6931304aae1b2c6e8224fc04e0bff9c2421b&=&format=webp&quality=lossless" alt="Helene Avatar" />
            <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">Aland</a></h3>
            <p>Co-milker</p>
          </div>

          <div className="text-center text-gray-500 dark:text-gray-400">
            <img className="mx-auto mb-4 w-36 h-36 rounded-full" src="https://media.discordapp.net/attachments/1456019679486414891/1458068352508498125/image.png?ex=695e4b78&is=695cf9f8&hm=f3b62913e3fda54f9fa2feef0db85449d72629a243030c9df19b06e2718a905f&=&format=webp&quality=lossless" alt="Jese Avatar" />
            <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">Abdulrahman</a></h3>
            <p>Co-digger</p>
          </div>

          <div className="text-center text-gray-500 dark:text-gray-400">
            <img className="mx-auto mb-4 w-36 h-36 rounded-full" src="https://media.discordapp.net/attachments/1151107785740783706/1458069399285010565/sus.gif?ex=695e4c72&is=695cfaf2&hm=12366d64b62b3d62c0653ccfa5a2c06d60c314a59926e94903a89cb3136bc809&=" alt="Sofia Avatar" />
            <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="#">Ayad</a></h3>
            <p>Co-dicker</p>
          </div>
        </div>
      </div>
    </section>
  );
}