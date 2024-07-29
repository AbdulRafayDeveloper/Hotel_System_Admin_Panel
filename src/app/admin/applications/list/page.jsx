"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import ReactPaginate from 'react-paginate';
import axios from "axios"
import Swal from 'sweetalert2';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Loading from './loading';
import LinkingWithSidebar from '../../components/LinkingWithSidebar'
import { decodeJWT } from "../../components/DecodeJWT";
import { useRouter } from 'next/navigation';

function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [statusChange, setStatusChange] = useState(false);
    const [hotelApplications, setHotelApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Current page number
    const [filteredhotelApplications, setFilteredHotelApplications] = useState([]); // Initialize with an empty array
    const perPage = 12 // Number of items per page

    useEffect(() => {
        const decodedData = decodeJWT();
        console.log("decodedData: ", decodedData);
        if (!(decodedData && decodedData.token && (decodedData.role === "admin" || decodedData.role === "employee"))) {
            router.push("../../auth/login");
        }

        const fetchData = async () => {
            await axios.get(`http://localhost:5000/api/hotel`)
                .then((result) => {
                    if (Array.isArray(result.data.hotels)) {
                        console.log("result.data: ", result.data.hotels);
                        setHotelApplications(result.data.hotels);
                        setFilteredHotelApplications(result.data.hotels);
                    } else {
                        console.error("API response is not an array:", result.data.data);
                    }
                })
                .catch((error) => {
                    console.error("API error:", error);
                }).finally(() => {
                    setLoading(false); // Set loading to false after data is fetched
                });
        };
        fetchData();
    }, [statusChange]);

    const handleStatusChangeAllow = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to change the status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, change it!',
        }).then(async (result) => {
            console.log("Id in change status function: " + id);
            if (result.isConfirmed) {
                try {
                    console.log("Call the statuss change api");
                    const response = await axios.put(`http://localhost:5000/api/hotel/status/allow/${id}`);
                    if (response.data.status === 200) {
                        if (statusChange == true) {
                            setStatusChange(false);
                        }
                        else {
                            setStatusChange(true);
                        }
                    } else {
                        Swal.fire('Error!', response.data.message);
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Status is already allowed.');
                }
            }
        });
    };

    const handleStatusChangeReject = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to change the status.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, change it!',
        }).then(async (result) => {
            console.log("Id in change status function: " + id);
            if (result.isConfirmed) {
                try {
                    console.log("Call the statuss change api");
                    const response = await axios.put(`http://localhost:5000/api/hotel/status/reject/${id}`);
                    if (response.data.status === 200) {
                        if (statusChange == true) {
                            setStatusChange(false);
                        }
                        else {
                            setStatusChange(true);
                        }
                    } else {
                        Swal.fire('Error!', 'Status is already pending.');
                    }
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error!', 'Status is already pending.');
                }
            }
        });
    };

    // Function to handle page change
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    // Calculate the start and end index for the current page
    const startIndex = currentPage * perPage;
    const endIndex = startIndex + perPage;
    const displayedHotelApplications = filteredhotelApplications.slice(startIndex, endIndex);

    const handleFilter = (e) => {
        const searchText = e.target.value.toLowerCase();

        if (searchText.trim() === '') {
            setFilteredHotelApplications(hotelApplications); // Reset filtered data to all data
        } else {
            const filteredData = hotelApplications.filter((item) =>
                Object.values(item).some((value) =>
                    String(value).toLowerCase().includes(searchText)
                )
            );
            setFilteredHotelApplications(filteredData);
        }

        setCurrentPage(0);
    };

    if (loading) {
        return <Loading />; // Render the Loading component if data is still being fetched
    }

    return (
        <div className="flex flex-col md:flex-row h-screen">
            <LinkingWithSidebar />
            <div className="flex-1 overflow-auto bg-gray-100">
                <Header></Header>
                <div className='p-4 bg-white mx-5 mt-3 rounded-lg shadow-lg'>
                    <div>
                        <div className='flex justify-between items-center mb-4'>
                            <div className='flex'>
                                <h2 className="text-2xl font-medium text-black">Applications List</h2>
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
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "6%" }}>Sr#</th>
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "27%" }}>Hotel Name</th>
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "15%" }}>Hotel Type</th>
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "27%" }}>Address</th>
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "10%" }}>Status</th>
                                        <th className="p-2 border border-gray-300 text-white" style={{ width: "15%" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedHotelApplications && displayedHotelApplications.map((element, index) => (
                                        <tr className="hover:bg-gray-100">
                                            <td className="text-center border border-gray-300 text-gray-900 p-1">{index + 1}</td>
                                            <td className="text-center border border-gray-300 text-gray-900 p-1">{element.hotelTitle}</td>
                                            <td className="text-center border border-gray-300 text-gray-900 p-1">{element.hoteltypes}</td>
                                            <td className="text-center border border-gray-300 text-gray-900 p-1">{element.address.city}, {element.address.region}</td>
                                            <td className="text-center border border-gray-300 p-1">
                                                <div className='flex flex-row space-x-3 justify-center'>
                                                    {element.applyStatus === "pending" ? (
                                                        <span className={`px-2 py-1 rounded-md text-white bg-yellow-500`}>
                                                            {element.applyStatus}
                                                        </span>
                                                    ) : (
                                                        <span className={`px-2 py-1 rounded-md text-white bg-green-600`}>
                                                            {element.applyStatus}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-center border border-gray-300 p-1">
                                                <div className='flex flex-row space-x-1 justify-center'>
                                                    <button onClick={() => handleStatusChangeAllow(element._id)} className="text-white bg-red-500 p-1 rounded-md hover:text-red-800">
                                                        Allow
                                                    </button>
                                                    <button onClick={() => handleStatusChangeReject(element._id)} className="text-white bg-red-500 p-1 rounded-md hover:text-red-800">
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center mt-4">
                            <ReactPaginate
                                previousLabel={<FaChevronLeft className="text-blue-400 ml-2 mb-0" />}
                                nextLabel={<FaChevronRight className="text-blue-400 ml-2 mb-0" />}
                                breakLabel={<span className="text-white">...</span>}
                                pageCount={Math.ceil(hotelApplications.length / perPage)}
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
        </div >
    );
}

export default Page;