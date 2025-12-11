"use client";

import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send
} from "lucide-react";

export default function Page() {
  return (
    <div className="py-8 px-4 space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#3F458D]">ติดต่อเรา</h1>
        <p className="text-[#4A5565]">
          หากมีข้อสงสัยหรือต้องการสอบถามข้อมูลเพิ่มเติม สามารถติดต่อเราได้ตามช่องทางด้านล่าง <br />
          หรือส่งข้อความหาเราได้ทันที
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left */}
        <div className="space-y-4">

          {/* Address */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
            <div className="flex">
              <div className="bg-[#F06FAA1A] w-12 h-12 flex items-center justify-center rounded-full">
                <MapPin className="h-6 text-[#F06FAA]" />
              </div>
            </div>
            <h3 className="font-bold text-[#3F458D]">ที่อยู่</h3>
            <p className="text-[#4A5565]">
              ฝ่ายประชาสัมพันธ์และโสตทัศนูปกรณ์ <br />
              มหาวิทยาลัยราชภัฏสวนสุนันทา <br />
              1 ถ.อู่ทองนอก แขวงดุสิต เขตดุสิต <br />
              กรุงเทพมหานคร 10300
            </p>
          </div>

          {/* Phone */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
            <div className="flex">
              <div className="bg-[#F06FAA1A] w-12 h-12 flex items-center justify-center rounded-full">
                <Phone className="h-6 text-[#F06FAA]" />
              </div>
            </div>
            <h3 className="font-bold text-[#3F458D]">เบอร์โทรศัพท์</h3>
            <p className="text-[#4A5565]">
              02 160 1000 <br />
              094 498 5317
            </p>
          </div>

          {/* Email */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
            <div className="flex">
              <div className="bg-[#F06FAA1A] w-12 h-12 flex items-center justify-center rounded-full">
                <Mail className="h-6 text-[#F06FAA]" />
              </div>
            </div>
            <h3 className="font-bold text-[#3F458D]">อีเมล</h3>
            <p className="text-[#4A5565]">
              pr@ssru.ac.th <br />
              contact@kaewjaojom.com
            </p>
          </div>

          {/* Work Time */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-2">
            <div className="flex">
              <div className="bg-[#F06FAA1A] w-12 h-12 flex items-center justify-center rounded-full">
                <Clock className="h-6 text-[#F06FAA]" />
              </div>
            </div>
            <h3 className="font-bold text-[#3F458D]">เวลาทำการ</h3>
            <p className="text-[#4A5565]">
              จันทร์ - ศุกร์: 08:30 - 16:30 น. <br />
              ปิดทำการวันเสาร์ - อาทิตย์ และวันหยุดนักขัตฤกษ์
            </p>
          </div>

        </div>

        {/* Right Form */}
        <div className="col-span-2 border border-gray-100 rounded-2xl p-4 space-y-4">
          <h2 className="text-2xl font-bold text-[#3F458D]">ส่งข้อความถึงเรา</h2>

          <form className="space-y-4">

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col">
                <label htmlFor="">ชื่อ</label>
                <input
                  type="text"
                  className="bg-[#F3F3F5] py-1 px-3 rounded-lg h-12 outline-none border-0"
                  placeholder="ชื่อจริง"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label htmlFor="">นามสกุล</label>
                <input
                  type="text"
                  className="bg-[#F3F3F5] py-1 px-3 rounded-lg h-12 outline-none border-0"
                  placeholder="นามสกุล"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="">อีเมล</label>
              <input
                type="text"
                className="bg-[#F3F3F5] py-1 px-3 rounded-lg h-12 outline-none border-0"
                placeholder="your@email.com"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="">หัวข้อติดต่อ</label>
              <input
                type="text"
                className="bg-[#F3F3F5] py-1 px-3 rounded-lg h-12 outline-none border-0"
                placeholder="ระบุเรื่องที่ต้องการติดต่อ"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="">ข้อความ</label>
              <textarea
                rows="4"
                className="bg-[#F3F3F5] py-1 px-3 rounded-lg outline-none border-0"
                placeholder="รายละเอียดข้อความ..."
              ></textarea>
            </div>

            <button className="btn bg-[#3F458D] text-white flex items-center gap-2 px-4 py-2 rounded-lg">
              <Send className="h-[1em]" /> ส่งข้อความ
            </button>

          </form>
        </div>
      </div>

      {/* Google Map */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.0955996116104!2d100.5075044!3d13.7731081!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2995e778f8bfb%3A0xf9a7730535388e56!2sSuan%20Sunandha%20Rajabhat%20University!5e0!3m2!1sen!2sth!4v1764858074483!5m2!1sen!2sth"
        className="w-full rounded-2xl h-[400px] border border-[#F3F4F6] shadow"
        loading="lazy"
      />
    </div>
  );
}
