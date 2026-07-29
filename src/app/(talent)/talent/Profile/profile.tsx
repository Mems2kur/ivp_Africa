"use client";

import { useRef } from "react";
import { User, Mail, MapPin, Phone, Calendar, Camera } from "lucide-react";
import type { PersonalInfo } from "@/lib/types/Profile";

const inputClass =
  "w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-11 text-sm text-black placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5]";
const iconClass = "pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A38F5]";
const labelClass = "mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase";

interface PersonalInfoCardProps {
  value: PersonalInfo;
  onChange: (next: PersonalInfo) => void;
}

export function PersonalInfoCard({ value, onChange }: PersonalInfoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1_000_000) {
      alert("Please choose an image under 1MB — larger images can overflow local storage.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...value, avatarUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-[#8A38F5]/5 sm:p-6">
      <h2 className="text-lg font-bold text-black">Personal info</h2>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#EDE7F8] text-lg font-semibold text-[#8A38F5]">
            {value.avatarUrl ? (
              <img src={value.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              value.fullName?.[0]?.toUpperCase() ?? <User size={24} />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#8A38F5] text-white shadow-sm"
            aria-label="Change photo"
          >
            <Camera size={12} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Profile photo</p>
          <p className="text-xs text-gray-400">JPG or PNG, under 1MB</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full name</label>
          <div className="relative">
            <User className={iconClass} />
            <input
              type="text"
              placeholder="Amara Chukwu"
              value={value.fullName}
              onChange={(e) => onChange({ ...value, fullName: e.target.value })}
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
              value={value.email}
              placeholder="example@gmail.com"
              onChange={(e) => onChange({ ...value, email: e.target.value })}
              className={`${inputClass} bg-gray-50 text-gray-400`}
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
              value={value.location}
              onChange={(e) => onChange({ ...value, location: e.target.value })}
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
              value={value.whatsapp}
              onChange={(e) => onChange({ ...value, whatsapp: e.target.value })}
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
              value={value.age}
              onChange={(e) => onChange({ ...value, age: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}