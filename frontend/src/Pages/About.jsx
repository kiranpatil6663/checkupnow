import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          About<span className="text-gray-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px] "
          src={assets.about_image}
          alt="Doctors consultation"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to CheckUpNow, your trusted platform for hassle-free doctor
            appointments.We understand how stressful it can be to book medical
            consultations, especially during emergencies or busy schedules.
            That’s why we built CheckUpNow – a smart, simple, and fast way to
            connect patients with doctors.
          </p>
          <p>
            Whether it's a routine check-up or a specialist consultation,
            CheckUpNow helps you:
          </p>

          <ul className="list-disc list-inside mb-4">
            <li>Browse available doctors</li>
            <li>Book appointments instantly</li>
            <li>Get reminders for upcoming visits</li>
            <li>Access your past appointment history</li>
          </ul>
          <b className="text-gray-800">Our Vision</b>
          <p>
            To simplify healthcare access through technology by making doctor
            appointments fast, reliable, and stress-free for everyone.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex-flex-col gap-5 text-[15px] hover:bg-primary hover:text-white tranistion-all duration-300 text-gray-600 cursor-pointer">
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into busy lifestyle.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex-flex-col gap-5 text-[15px] hover:bg-primary hover:text-white tranistion-all duration-300 text-gray-600 cursor-pointer">
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare proffessionals in your area.</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex-flex-col gap-5 text-[15px] hover:bg-primary hover:text-white tranistion-all duration-300 text-gray-600 cursor-pointer">
          <b>Personalization</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
