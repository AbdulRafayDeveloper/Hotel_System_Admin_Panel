import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { FaUsers } from 'react-icons/fa';

function Sidebar({ overview, applications, hotelTypes, hotelBar, hotelInfrastructure, hotelNutrition,
    hotelService, hotelTransferServices, employees, roles, accessibleEnvironments, beautyAndHealth,
    childrenFacilities, conferenceFacilities, entertainmentAndSports, hotel_transport,
    roomAmenities, seaAndBeach, staff }) {
    return (
        <div className='my-1'>
            <nav className="bg-white text-black w-full lg:w-full md:w-full h-screen p-6 rounded-lg shadow-lg overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-xl font-semibold px-3 text-blue-600">Dashboard</div>
                    <Image src={`/next.svg`} alt="Logo" className="w-10 p-1 h-10 rounded-full bg-gray-300" width={40} height={40} />
                </div>
                <ul className="space-y-6 mt-16">
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={overview} className="hover:text-blue-500 text-lg font-light">Overview</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={applications} className="hover:text-blue-500 text-lg font-light">Applications</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={hotelTypes} className="hover:text-blue-500 text-lg font-light">Hotel Types</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={hotelBar} className="hover:text-blue-500 text-lg font-light">Hotel Bar</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={hotelInfrastructure} className="hover:text-blue-500 text-lg font-light">Hotel Infrastructure</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={hotelNutrition} className="hover:text-blue-500 text-lg font-light">Hotel Nutrition</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={hotelService} className="hover:text-blue-500 text-lg font-light">Hotel Service</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={hotelTransferServices} className="hover:text-blue-500 text-lg font-light">Hotel Transfer Services</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={employees} className="hover:text-blue-500 text-lg font-light">Employees</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={roles} className="hover:text-blue-500 text-lg font-light">Roles</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={accessibleEnvironments} className="hover:text-blue-500 text-lg font-light">Accessible Environments</Link>
                    </li>

                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={beautyAndHealth} className="hover:text-blue-500 text-lg font-light">Beauty And Health</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={childrenFacilities} className="hover:text-blue-500 text-lg font-light">Children Facilities</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={conferenceFacilities} className="hover:text-blue-500 text-lg font-light">Conference Facilities</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={entertainmentAndSports} className="hover:text-blue-500 text-lg font-light">Entertainment And Sports</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={hotel_transport} className="hover:text-blue-500 text-lg font-light">Hotel Transport</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={roomAmenities} className="hover:text-blue-500 text-lg font-light">Room Amenities</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-red-500" size={20} />
                        <Link href={seaAndBeach} className="hover:text-blue-500 text-lg font-light">Sea And Beach</Link>
                    </li>
                    <li className="flex items-center space-x-3">
                        <FaUsers className="text-yellow-400" size={20} />
                        <Link href={staff} className="hover:text-blue-500 text-lg font-light">Staff</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;