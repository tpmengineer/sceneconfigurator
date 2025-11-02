"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCustomisation } from "@/contexts/customisation";

export default function RequestQuoteModal({ open, onClose }) {
  const {
    floor_material,
    wall_material,
    ceiling_material,
    wall_shadow,
    ceiling_shadow,
    wallLighting,
    handrail_model,
    handrail_colour,
    door_model,
    door_colour,
    cop_colour,
  } = useCustomisation();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [contactBy, setContactBy] = useState("email");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [subscribe, setSubscribe] = useState(false);

  // Reset fields when opening/closing
  useEffect(() => {
    if (!open) return;
    setFullName("");
    setPhone("");
    setEmail("");
    setEmail2("");
    setCity("");
    setMessage("");
    setContactBy("email");
    setAgreeTerms(true);
    setSubscribe(false);
  }, [open]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape" && open) onClose?.();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const canSubmit = useMemo(() => {
    const requiredOk = fullName && email && email2 && email === email2 && agreeTerms;
    return !!requiredOk;
  }, [fullName, email, email2, agreeTerms]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const payload = {
      fullName,
      phone,
      email,
      city,
      message,
      contactBy,
      subscribe,
      // Selections snapshot
      selections: {
        floor: floor_material?.name,
        walls: wall_material?.name,
        ceiling: ceiling_material?.name,
        wallLight: wallLighting ? "Yes" : "No",
        wallShadowline: wall_shadow?.name,
        ceilingShadowline: ceiling_shadow?.name,
        handrail: `${handrail_model} / ${handrail_colour?.name}`,
        door: `${door_model} / ${door_colour?.name}`,
        cop: cop_colour?.name,
      },
    };

    // TODO: integrate with backend/email. For now, log and close.
    // eslint-disable-next-line no-console
    console.log("Quote request submitted:", payload);
    onClose?.();
  };

  if (!open) return null;

  // Render to body to avoid stacking context issues
  return createPortal(
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onClose?.()}
        aria-hidden
      />

      {/* Modal panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-white rounded-sm shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-wide">Request Quote</h2>
              <button
                aria-label="Close"
                onClick={() => onClose?.()}
                className="p-2 text-gray-500 hover:text-black"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Enter your details below to get a price estimate. You will receive an email with a link to this configuration.
            </p>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Left summary column */}
            <div className="md:col-span-1 p-6">
              <div className="border rounded-sm p-4">
                <div className="text-[11px] font-semibold tracking-wider text-gray-600 uppercase">CUSTOMIZATIONS</div>
                <div className="mt-2 h-px bg-gray-200" />

                <ul className="mt-4 space-y-3 text-sm">
                  <SummaryRow label="Lift Flooring" value={floor_material?.name} />
                  <SummaryRow label="Wall Panels" value={wall_material?.name} />
                  <SummaryRow label="Ceiling Panels" value={ceiling_material?.name} />
                  <SummaryRow label="Wall Light" value={wallLighting ? "Yes" : "No"} />
                  <SummaryRow label="Shadowline" value={wall_shadow?.name} />
                  <SummaryRow label="Handrail" value={`${handrail_model} / ${handrail_colour?.name}`} />
                  <SummaryRow label="COP Color" value={cop_colour?.name} />
                </ul>
              </div>
            </div>

            {/* Right form column */}
            <div className="md:col-span-2 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full name">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Phone number">
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email address">
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Repeat email address">
                    <input
                      type="email"
                      className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                        email2 && email2 !== email ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-black"
                      }`}
                      value={email2}
                      onChange={(e) => setEmail2(e.target.value)}
                      required
                    />
                  </Field>
                </div>

                <Field label="City of residence*">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </Field>

                <Field label="Message">
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-y"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter notes"
                  />
                </Field>

                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Contact me by</div>
                  <div className="flex items-center gap-6 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactBy"
                        className="accent-black"
                        checked={contactBy === "email"}
                        onChange={() => setContactBy("email")}
                      />
                      <span>Email</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="contactBy"
                        className="accent-black"
                        checked={contactBy === "phone"}
                        onChange={() => setContactBy("phone")}
                      />
                      <span>Phone</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 accent-black"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span className="text-gray-700">
                      I agree to the <a href="#" className="underline">terms and conditions</a> and <a href="#" className="underline">privacy policy</a>.
                    </span>
                  </label>
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      className="mt-1 accent-black"
                      checked={subscribe}
                      onChange={(e) => setSubscribe(e.target.checked)}
                    />
                    <span className="text-gray-700">Allow us to send you emails</span>
                  </label>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onClose?.()}
                    className="px-4 h-9 rounded-sm border border-gray-300 text-xs tracking-wide uppercase text-gray-800 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`px-4 h-9 rounded-sm text-xs tracking-wide uppercase text-white ${
                      canSubmit ? "bg-black hover:bg-black/90" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-gray-700 mb-1">{label}</div>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 text-right ml-4">{value || "—"}</span>
    </li>
  );
}
