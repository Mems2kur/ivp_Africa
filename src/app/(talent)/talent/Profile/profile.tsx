"use client";

import { useRef } from "react";
import { User, Mail, MapPin, Phone, Calendar, Camera, Briefcase } from "lucide-react";
import type { PersonalInfo } from "@/lib/types/Profile";

const inputClass =
  "w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pr-4 pl-11 text-sm text-black placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5]";
const iconClass = "pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A38F5]";
const labelClass = "mb-1.5 block text-xs font-semibold tracking-wider text-gray-500 uppercase";

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <span>
      {children} <span className="text-red-500">*</span>
    </span>
  );
}

interface PersonalInfoCardProps {
  value: PersonalInfo;
  onChange: (next: PersonalInfo) => void;
  onPhotoFileSelected: (file: File | null) => void;
}

export function PersonalInfoCard({ value, onChange,onPhotoFileSelected }: PersonalInfoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 1_000_000) {
    alert("Please choose an image under 1MB.");
    return;
  }
  onPhotoFileSelected(file); // new — raw file for the real upload

  const reader = new FileReader();
  reader.onload = () => onChange({ ...value, avatarUrl: reader.result as string }); // unchanged — local preview
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
          <label className={labelClass}><RequiredLabel>Full name</RequiredLabel></label>
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
          <label className={labelClass}><RequiredLabel>Professional title</RequiredLabel></label>
          <div className="relative">
            <Briefcase className={iconClass} />
            <input
              type="text"
              placeholder="Backend Engineer"
              value={value.professionalTitle}
              onChange={(e) => onChange({ ...value, professionalTitle: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}><RequiredLabel>Location</RequiredLabel></label>
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
      <label className={labelClass}><RequiredLabel>Phone number</RequiredLabel></label>
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

      <div className="mt-4">
        <label className={labelClass}>Bio</label>
        <textarea
          placeholder="Building scalable APIs with NestJS."
          value={value.bio}
          onChange={(e) => onChange({ ...value, bio: e.target.value })}
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-black placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#8A38F5]"
        />
      </div>
    </div>
  );
}