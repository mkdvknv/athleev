import { useState } from "react";

import AccountPageShell from "./account/AccountPageShell";

const emptyAddress = {
  fullName: "",
  mobile: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

const readSavedAddress = () => {
  try {
    return JSON.parse(window.localStorage.getItem("athleevAddress") || "null") || emptyAddress;
  } catch {
    return emptyAddress;
  }
};

export default function MyAddress() {
  const [address, setAddress] = useState(readSavedAddress);
  const [message, setMessage] = useState("");

  const updateAddress = (field, value) => {
    setAddress((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const saveAddress = (event) => {
    event.preventDefault();
    window.localStorage.setItem("athleevAddress", JSON.stringify(address));
    setMessage("Address saved successfully.");
  };

  return (
    <AccountPageShell title="My Address">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="ath-premium-card border-[#c69a4b]/35 p-6 shadow-[#c69a4b]/10 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c69a4b]">
            Address Book
          </p>
          <h2 className="mt-3 text-3xl font-black">Delivery Details</h2>
          <p className="mt-4 leading-relaxed text-gray-400">
            Save the delivery information you use most often for Athleev orders.
          </p>
          <button type="button" className="ath-btn-outline mt-8 w-full px-6 py-4">
            Add New Address
          </button>
        </div>

        <form
          className="ath-premium-card grid gap-5 border-[#c69a4b]/45 p-6 shadow-[#c69a4b]/10 sm:p-8"
          onSubmit={saveAddress}
        >
          {[
            ["fullName", "Full Name", "Your full name"],
            ["mobile", "Mobile Number", "9876543210"],
            ["addressLine", "Address Line", "House, street, area"],
            ["city", "City", "City"],
            ["state", "State", "State"],
            ["pincode", "Pincode", "400001"],
          ].map(([field, label, placeholder]) => (
            <label key={field} htmlFor={`address-${field}`} className="block">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">
                {label}
              </span>
              <input
                id={`address-${field}`}
                type={field === "mobile" || field === "pincode" ? "tel" : "text"}
                value={address[field]}
                onChange={(event) => updateAddress(field, event.target.value)}
                placeholder={placeholder}
                className="mt-2 w-full rounded-full border border-gray-700 bg-black px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#c69a4b] focus:shadow-[0_0_24px_rgba(198,154,75,0.12)]"
              />
            </label>
          ))}
          <button type="submit" className="ath-btn-primary px-6 py-4">
            Save Address
          </button>
          {message && (
            <p className="rounded-2xl border border-[#c69a4b]/30 bg-[#17120a] p-4 text-sm font-semibold text-gray-200">
              {message}
            </p>
          )}
        </form>
      </div>
    </AccountPageShell>
  );
}
