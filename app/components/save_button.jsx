import { useState, useRef } from "react";
import emailjs from "emailjs-com";
import { useCustomisation } from "@/contexts/customisation";
import { Save } from 'lucide-react';

export default function DownloadableButton({ name, alt = false }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isContactHover, setContactHover] = useState(false);
  const formRef = useRef(null);

  const {
    floor_material,
    wall_material,
    wall_shadow,
    handrail_model,
    handrail_colour,
    wallLighting,
    isDualEntry,
    door_model,
    door_colour,
    width,
    depth,
    travel,
  } = useCustomisation();

  // Function to handle input change and validation
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsEmailValid(inputEmail.includes("@"));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEmailValid) {
      // Change submit button state to 'Submitted'
      

      emailjs
          .send(
            "service_pf6g4p9", // Replace with your EmailJS service ID
            // "template_lw55d3m", //to customer
            "template_d3tc1ya", //not to customer
            { email: email, floor_material: floor_material.name, wall_material: wall_material.name, wall_shadow: wall_shadow.name, handrail_model: handrail_model, handrail_colour: handrail_colour.name, wallLighting: wallLighting, isDualEntry: isDualEntry, door_model: door_model.model, door_colour: door_colour.name, width: width, depth: depth, travel: travel },
            "nm5rIdi-7dndRFnZN" // Replace with your EmailJS user ID
          )
          .then(
            (response) => {
              console.log("SUCCESS!", response.status, response.text);
              setSubmitted(true);
              setTimeout(() => {
                setShowOverlay(false);
                setSubmitted(false);
                setEmail("");
              }, 3000);
            },
            (err) => {
              console.error("FAILED...", err);
              alert("Failed to send email. Please try again later.");
            }
          );
      
      // Open the PDF in a new tab
      //window.open(content, "_blank");

      // Close the overlay after 3 seconds
      
    } else {
      alert("Please enter a valid email address.");
    }
  };

  // Function to handle click outside of the form
  const handleOverlayClick = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setShowOverlay(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowOverlay(true)}
        className="hidden md:flex cursor-pointer z-50" onMouseEnter={(() => setContactHover(true))} onMouseLeave={(() => setContactHover(false))} >
          <div className={`flex items-center text-center shadow-[2px_2px_2px_rgba(256,256,256,0.5)] py-1 px-3 outline outline-2 ${isContactHover ? "outline-[#424757]" : "outline-brand-green"} hover:shadow-none transition-hover duration-500`}>
            
              <Save className={`mr-2 h-4 w-4 ${isContactHover ? "text-[#424757]" : "text-brand-green"} duration-500`} />
              {/* Contact Us text with drop shadow */}
              <div className={`uppercase font-bold text-sm ${isContactHover ? "text-[#424757]" : "text-brand-green"} whitespace-nowrap duration-500`}>
                SAVE
              </div>
              
          </div>
      </button>

      {showOverlay && (
        <div
          onClick={handleOverlayClick}
          className="z-50 fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
        >
          <div
            ref={formRef}
            className="relative bg-white p-8 rounded-lg w-80 text-center shadow-lg"
          >
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-2 right-2 text-brand-grey hover:text-brand-black"
            >
              &#x2715;
            </button>
            <h2 className="text-lg font-semibold mb-4">Enter your email</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-brand-green"
                required
              />
              <button
                type="submit"
                className="my-1 py-3 px-4 md:px-8 rounded-lg text-brand-white font-bold bg-brand-grey hover:bg-brand-black hover:text-brand-green transition duration-300 text-sm lg:text-md"
                disabled={submitted}
              >
                {submitted ? "Submitted" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
