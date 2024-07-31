"use client"
import React, { useState,useEffect } from 'react'
import Header from '@/app/admin/components/Header';
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {decodeJWT} from '../../components/DecodeJWT'
import LinkingWithSidebar from '../../components/secondLayer/LinkingWithSidebar'

function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [icon, setIcon] = useState(null);
	const [fileName, setFileName] = useState('');

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

        if (!icon) {
            toast.error('Please upload an icon image');
            setLoading(false);
            return;
        }

        // Create FormData object for file upload
        const uploadData = new FormData();
        uploadData.append('icon', icon);

        try {
            const response = await axios.post('http://localhost:5000/api/icons', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set Content-Type to multipart/form-data
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
                    router.push("./../../../../admin/iconspage/list");
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setIcon(file);
        setFileName(file ? file.name : '');
    };

    return (
        <>
            <ToastContainer />
            <div className="flex flex-col md:flex-row h-screen">
                <LinkingWithSidebar />
                <div className="flex-1 overflow-auto bg-gray-100">
                    <Header />
                    <div className='p-1'>
                        <div className='mx-auto max-w-[600px] mt-12'>
                            <form onSubmit={handleSubmit} name="iconForm" id="iconForm" className="bg-white shadow-md rounded px-12 pb-4 mb-4 py-2 mt-2" method="post">
                                <h1 className='text-2xl font-medium text-center pb-7 text-gray-800 pt-4'>Upload Icon</h1>
                                <div className='flex flex-col gap-4 mb-4'>
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-base font-semibold mb-2" htmlFor="icon">
                                        Icon Image
                                    </label>
                                    <div className='flex flex-row items-center space-x-2 mt-6'>
                                        <input
                                            type="file"
                                            className="block w-full flex-1"
                                            name="icon"
                                            id="icon"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            placeholder={icon}
                                        />
                                        <input
                                            type="text"
                                            className="block w-full text-gray-400 flex-1"
                                            value={fileName}
                                            readOnly
                                            placeholder="No file chosen"
                                        />
                                    </div>
                                </div>
                                </div>
                                <div className="flex items-center justify-end mt-8">
                                    <button
                                        className={`bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Upload Icon'}
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

export default Page;
