"use client"
import React, { useState, useEffect } from 'react'
import axios from "axios"
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { decodeJWT } from "../../admin/components/DecodeJWT";

function page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false); // State to handle loading
    const [formdata, setFormData] = useState({
        mail: "",
        password: ""
    });

    useEffect(() => {
        const decodedData = decodeJWT();
        if (decodedData && decodedData.token && (decodedData.role === "admin" || decodedData.role === "employee")) {
            router.push("../../admin/overview");
        }
    }, [])

    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            setLoading(true); // Set loading to true when form is submitted

            if (!formdata.mail || !formdata.password) {
                toast.error('Please fill all required fields');
                setLoading(false);
                return;
            }

            const response = await axios.post(`http://localhost:5000/api/employees/login`, formdata);

            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                }).then(() => {
                    localStorage.setItem('token', response.data.token);
                    const token = localStorage.getItem("token");
                    console.log("token: ", token);
                    router.push("../../admin/employees/list");
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
                <div className="relative z-10 max-w-lg mx-auto bg-black shadow-lg sm:rounded-lg p-6 sm:p-12 opacity-80">
                    <div className="mt-12 flex flex-col items-center">
                        <form onSubmit={handleLogin} className="opacity-100">
                            <h1 className="text-2xl xl:text-3xl font-extrabold text-center mb-6 text-white ">
                                Log In
                            </h1>
                            <div className="w-full flex-1 mt-8">
                                <div className="mx-auto max-w-xs">
                                    <input
                                        type="mail"
                                        name="mail"
                                        id="mail"
                                        onChange={(e) => setFormData({ ...formdata, mail: e.target.value })}
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                        placeholder="Enter your mail" />
                                    <input type="password"
                                        name="password"
                                        id="password"
                                        onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
                                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                        placeholder="Enter your password" />
                                    <div className="flex items-center justify-end mt-8">
                                        <button
                                            className={`bg-blue-600 w-full text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Loading...' : 'Login'}
                                        </button>
                                    </div>
                                    <p className="mt-6 text-xs text-gray-300 text-center">
                                        Don't have account? Please
                                        <Link href="../../auth/register" className="border-b border-gray-300 border-dotted text-white font-bold mx-2">
                                            Register
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