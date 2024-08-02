"use client"
import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import axios from "axios"
import Swal from 'sweetalert2';
import { FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Loading from './loading';
import LinkingWithSidebar from '../../components/LinkingWithSidebar';
import Header from '../../components/Header'
import { useRouter } from 'next/navigation';
import { decodeJWT } from '../../components/DecodeJWT'

function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [statusChange, setStatusChange] = useState(false);
    const [excursion, setexcursion] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [filteredexcursion, setfilteredexcursion] = useState([]);
    const perPage = 12;

    useEffect(() => {
        const decodedData = decodeJWT();
        if (!(decodedData && decodedData.token && (decodedData.role === "admin" || decodedData.role === "employee"))) {
            router.push("../../auth/login");
        }

        const fetchData = async () => {
            await axios.get(`http://localhost:5000/api/excursions`)
                .then((result) => {
                    console.log("result.data.data: ", result.data.data);
                    if (Array.isArray(result.data.data)) {
                        setexcursion(result.data.data);
                        setfilteredexcursion(result.data.data);
                    } else {
                        console.error("API response is not an array:", result.data.data);
                    }
                })
                .catch((error) => {
                    console.error("API error:", error);
                }).finally(() => {
                    setLoading(false);
                });
        };
        fetchData();
    }, [statusChange]);

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this record permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            console.log("Id in delete function: " + id);
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://localhost:5000/api/excursions/${id}`);
                    if (response.data.status == 200) {
                        if (statusChange == true) {
                            setStatusChange(false);
                        }
                        else {
                            setStatusChange(true);
                        }
                    } else {
                        Swal.fire('Error!', 'Deletion failed.', 'error');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Deletion failed.', 'error');
                }
            }
        });
    };

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const startIndex = currentPage * perPage;
    const endIndex = startIndex + perPage;
    const displayedEmployee = Array.isArray(filteredexcursion) ? filteredexcursion.slice(startIndex, endIndex) : [];

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setfilteredexcursion(excursion);
        } else {
            const filteredData = excursion.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setfilteredexcursion(filteredData);
        }

        setCurrentPage(0);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <LinkingWithSidebar />
            <div className="flex-1 overflow-auto bg-gray-100">
                <Header></Header>
                <div className='p-4 bg-white mx-5 mt-3 rounded-lg shadow-lg'>
                    <div>
                        <h2 className="text-2xl font-medium mb-3 text-black">Excursions List</h2>
                        <div className='flex justify-between items-center mb-4'>
                            <div className='flex'>
                                <Link href="../../admin/excursions/add" className='text-sm w-28 h-8 flex items-center justify-center border border-blue-600 bg-white mr-3 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-sm' passHref>
                                    <span className='text-blue-600 font-medium'>Add New</span>
                                    <FaPlus className="text-blue-600 ml-2 mb-0" />
                                </Link>
                            </div>
                            <div className='flex'>
                                <input
                                    type="text"
                                    placeholder="Search Results"
                                    onChange={handleFilter}
                                    className="bg-white px-3 py-1 rounded-full w-52 border border-blue-600 text-gray-700"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                                <thead className="bg-blue-400">
                                    <tr>
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "10%" }}>Sr#</th>
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "30%" }}>Title</th>
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "50%" }}>Description</th>
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "10%" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedEmployee && displayedEmployee.length > 0 ? (
                                        displayedEmployee.map((element, index) => (
                                            <tr className="hover:bg-gray-100" key={index}>
                                                <td className="text-center border border-gray-300 text-gray-900 p-1">{index + 1}</td>
                                                <td className="text-center border border-gray-300 text-gray-900 p-1">{element.title}</td>
                                                <td className="text-center border border-gray-300 text-gray-900 p-1">{element.description}</td>
                                                <td className="text-center border border-gray-300 p-1">
                                                    <div className='flex flex-row space-x-3 justify-center'>
                                                        <button onClick={() => handleDelete(element._id)} className="text-red-600 hover:text-red-800">
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center border border-gray-300 text-gray-900 p-1">
                                                No records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
                            <ReactPaginate
                                previousLabel={<FaChevronLeft className="text-blue-400 ml-2 mb-0" />}
                                nextLabel={<FaChevronRight className="text-blue-400 ml-2 mb-0" />}
                                breakLabel={<span className="text-white">...</span>}
                                pageCount={Math.ceil(excursion.length / perPage)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={10}
                                onPageChange={handlePageChange}
                                containerClassName="pagination flex"
                                activeClassName="bg-blue-600 rounded-full text-white"
                                pageClassName="relative mx-1"
                                pageLinkClassName="block w-9 h-9 bg-blue-500 rounded-sm text-center text-white hover:bg-gray-200 focus:outline-none flex items-center justify-center"
                                previousClassName="relative mx-1"
                                nextClassName="relative mx-1"
                                previousLinkClassName="block p-2 mt-1 bg-blue-500 rounded-md text-white hover:bg-gray-200 focus:outline-none"
                                nextLinkClassName="block p-2 mt-1 bg-blue-500 rounded-md text-white hover:bg-gray-200 focus:outline-none"
                                breakClassName="relative mx-1"
                                breakLinkClassName="block py-2 px-3 bg-white rounded-full text-gray-700 hover:bg-gray-200 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;