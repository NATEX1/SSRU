import { ImageUp, Pencil } from 'lucide-react'
import React from 'react'

export default function page() {
  return (
    <div>
        <div className="flex flex-col items-center justify-center">
            <div className='size-40 relative rounded-full border-4 border-white shadow my-3'>
                <img className="w-full h-full object-cover rounded-full" src={'/uploads/1766805910211-man.png'} alt="" />
                <button className='absolute bg-white size-8 bottom-0 right-0.5 rounded-full border flex items-center justify-center cursor-pointer'>
                    <Pencil className='size-4' />
                </button>
            </div>
            <span className="text-muted-foreground">
                เปลี่ยนรูปโปรไฟล์
            </span>
        </div>
    </div>
  )
}
