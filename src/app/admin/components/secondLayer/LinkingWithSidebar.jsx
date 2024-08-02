import React from 'react'
import Sidebar from './../Sidebar';

function LinkingWithSidebar() {
    return (
        <div>
            <Sidebar
                overview="../../../admin/overview"
                applications="../../../admin/applications/list"
                hotelTypes="../../../admin/hotelTypes/list"
                hotelBar="../../../admin/hotelBar/list"
                hotelInfrastructure="../../../admin/hotelInfrastructure/list"
                hotelNutrition="../../../admin/hotelNutrition/list"
                hotelService="../../../admin/hotelService/list"
                hotelTransferServices="../../../admin/hotelTransferServices/list"
                employees="../../../admin/employees/list"
                roles="../../../admin/roles/list"
                accessibleEnvironments="../../../admin/accessibleEnvironments/list"
                beautyAndHealth="../../../admin/beautyAndHealth/list"
                childrenFacilities="../../../admin/childrenFacilities/list"
                conferenceFacilities="../../../admin/conferenceFacilities/list"
                entertainmentAndSports="../../../admin/entertainmentAndSports/list"
                hotel_transport="../../../admin/hotel_transport/list"
                roomAmenities="../../../admin/roomAmenities/list"
                seaAndBeach="../../../admin/seaAndBeach/list"
                staff="../../../admin/staff/list"
                excursion="../../../admin/excursions/list"
                excursionKeyPoints="../../../admin/excursions/keypoints/list"
                excursionCategories="../../../admin/excursions/category/list"
                icons="../../../admin/icons/list"
            ></Sidebar>
        </div >
    )
}

export default LinkingWithSidebar