"use client"
import React, { useState, useEffect } from 'react'
import axios from "axios"
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false); // State to handle loading
    const [formdata, setFormData] = useState({
        name: "",
        position: "",
        mail: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: "employee"
    });

    const handleRegister = async (e) => {
        try {
            e.preventDefault();

            setLoading(true); // Set loading to true when form is submitted

            if (!formdata.name || !formdata.position || !formdata.mail || !formdata.phoneNumber || !formdata.password || !formdata.role) {
                toast.error('Please fill all required fields');
                setLoading(false);
                return;
            }

            if (formdata.password !== formdata.confirmPassword) {
                toast.error('Password and Confirm Password not match');
                setLoading(false);
                return;
            }

            const formData = {
                name: formdata.name,
                position: formdata.position,
                mail: formdata.mail,
                phoneNumber: formdata.phoneNumber,
                password: formdata.password,
                role: formdata.role
            };

            console.log("formData: ", formData);
            const response = await axios.post(`http://localhost:5000/api/employees/signup`, formData);

            console.log("response: ", response);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                }).then(() => {
                    router.push("../../auth/login");
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response ? error.response.data.message : "Your Request has not been submitted. Try Again later!",
            });
        } finally {
            setLoading(false); // Reset loading when API call completes
        }
    }

    return (
        <>
            <ToastContainer></ToastContainer>
            <div className="bg-gray-100 text-gray-900 flex items-center justify-center min-h-screen relative overflow-hidden">
                <div className="relative z-10 max-w-lg mt-10 mx-auto bg-black shadow-lg sm:rounded-lg p-4 sm:p-12 opacity-80">
                    <div className="flex flex-col items-center">
                        <form onSubmit={handleRegister} className="opacity-100">
                            <h1 className="text-2xl xl:text-3xl font-extrabold text-center mb-1 text-white ">
                                Register
                            </h1>
                            <div className="w-full flex-1 mt-6">
                                <div className="mx-auto max-w-xs">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-5"
                                        placeholder="Enter your name" />
                                    <input
                                        type="text"
                                        name="position"
                                        id="position"
                                        onChange={(e) => setFormData({ ...formdata, position: e.target.value })}
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-5"
                                        placeholder="Enter your position" />
                                    <input
                                        type="email"
                                        name="mail"
                                        id="mail"
                                        onChange={(e) => setFormData({ ...formdata, mail: e.target.value })}
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-5"
                                        placeholder="Enter your email" />
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        onChange={(e) => setFormData({ ...formdata, phoneNumber: e.target.value })}
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-5"
                                        placeholder="Enter your phone number" />
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mb-5"
                                        placeholder="Enter your password" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        onChange={(e) => setFormData({ ...formdata, confirmPassword: e.target.value })}
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                        placeholder="Enter your confirm password" />
                                    <div className="flex items-center justify-end mt-8">
                                        <button
                                            className={`bg-blue-600 w-full text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Loading...' : 'Submit Request'}
                                        </button>
                                    </div>
                                    <p className="mt-6 text-xs text-gray-300 text-center">
                                        Already have account? Please
                                        <Link href="../../auth/login" className="border-b border-gray-300 border-dotted text-white font-bold mx-2">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page