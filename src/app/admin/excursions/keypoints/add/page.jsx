"use client"
import React, { useState, useEffect } from 'react'
import Header from '@/app/admin/components/Header';
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { decodeJWT } from '../../../components/DecodeJWT';
import LinkingWithSidebar from '../../../components/secondLayer/LinkingWithSidebar';
import { ChromePicker } from 'react-color';

function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formdata, setFormData] = useState({
        color: "#000000",
        label: ""
    });

    const handleColorChange = (color) => {
        setFormData({ ...formdata, color: color.hex });
    };

    useEffect(() => {
        const decodedData = decodeJWT();
        console.log("decodedData: ", decodedData);
        if (!(decodedData && decodedData.token && (decodedData.role === "admin" || decodedData.role === "employee"))) {
            router.push("../../auth/login");
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formdata.label) {
            toast.error('Please fill in label field');
            setLoading(false);
            return;
        }
        if (!formdata.color) {
            toast.error('Please fill in color field');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/excursions/keypoints', formdata, {
                headers: {
                    'Content-Type': 'application/json', // Set Content-Type to application/json
                },
            });

            console.log("response.data: ", response.data);
            console.log("response.status: ", response.status);

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.data.message,
                }).then(() => {
                    router.push("./../../../../admin/excursions/keypoints/list");
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
                text: error.response ? error.response.data.message : "An error occurred",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <ToastContainer />
            <div className="flex flex-col md:flex-row h-screen">
                <LinkingWithSidebar />
                <div className="flex-1 overflow-auto bg-gray-100">
                    <Header />
                    <div className='p-1'>
                        <div className='mx-auto max-w-[600px] mt-12'>
                            <form onSubmit={handleSubmit} name="employeeForm" id="employeeForm" className="bg-white shadow-md rounded px-12 pb-4 mb-4 py-2 mt-2" method="post">
                                <h1 className='text-2xl font-medium text-center pb-7 text-gray-800 pt-4'>Add Excursion Keypoints</h1>
                                <div className='flex flex-col gap-4 mb-4'>
                                    <div className="flex-1">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="label">
                                            Label
                                        </label>
                                        <input
                                            type="text"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            name="label"
                                            id="label"
                                            onChange={(e) => setFormData({ ...formdata, label: e.target.value })}
                                            placeholder="Enter label"
                                        />
                                    </div>
                                    <div className="flex-1 justify-center">
                                        <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="color">
                                            Color
                                        </label>
                                        <ChromePicker
                                            color={formdata.color}
                                            onChangeComplete={handleColorChange}
                                            className="text-center"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-end mt-8">
                                    <button
                                        className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Add Record'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page