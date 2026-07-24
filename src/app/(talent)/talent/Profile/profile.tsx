"use client";

import { useState } from "react";
import { User, Mail, MapPin, Phone, Calendar } from "lucide-react";

interface PersonalInfo {
  fullName: string;
  email: string;
  location: string;
  whatsapp: string;
  age: string;
}

const inputClass =
  "w-full rounded-xl border border-gray-100 bg-white py-3 pr-4 pl-11 text-sm text-black placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5]";
const iconClass = "pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A38F5]";
const labelClass = "mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase";

export function PersonalInfoCard() {
  const [info, setInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "amara@example.com",
    location: "",
    whatsapp: "",
    age: "",
  });

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-[#8A38F5]/5 sm:p-6">
      <h2 className="text-lg font-bold text-black">Personal info</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full name</label>
          <div className="relative">
            <User className={iconClass} />
            <input
              type="text"
              placeholder="Amara Chukwu"
              value={info.fullName}
              onChange={(e) => setInfo({ ...info, fullName: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <div className="relative">
            <Mail className={iconClass} />
            <input
              type="email"
              value={info.email}
              disabled
              className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-400`}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <div className="relative">
            <MapPin className={iconClass} />
            <input
              type="text"
              placeholder="Lagos, Nigeria"
              value={info.location}
              onChange={(e) => setInfo({ ...info, location: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>WhatsApp number</label>
          <div className="relative">
            <Phone className={iconClass} />
            <input
              type="tel"
              placeholder="+234 801 234 5678"
              value={info.whatsapp}
              onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Age</label>
          <div className="relative">
            <Calendar className={iconClass} />
            <input
              type="number"
              placeholder="22"
              value={info.age}
              onChange={(e) => setInfo({ ...info, age: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-5 rounded-full bg-[#8A38F5] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0]"
      >
        Save changes
      </button>
    </div>
  );
}