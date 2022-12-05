import StudioList from '../../components/StudioSearch/StudioList';
import StudioMap from '../../components/StudioSearch/StudioMap';
import StudioSearch from '../../components/StudioSearch/StudioSearch';
import './StudioSearchPage.css';
import React, {useEffect, useState} from 'react';


// need to make call to backend to get all studios and conver each to a Summary card
// use the useEffect for loading the page

const StudioSearchPage = () => {
    // const Studio = (studio_name, studio_images, studio_location, studio_address, studio_phone_num, studio_postal_code) => {
    //     const name = studio_name;
    //     const images = studio_images;
    //     const location = studio_location;
    //     const address = studio_address
    //     const phone_num = studio_phone_num
    //     const postal_code = studio_postal_code

    //     return {name, address, postal_code, location, phone_num, images}
    // }

  

    return (
        <>
            <h1>Find a Gym</h1>
            
            <StudioSearch/>
        
        </>
    )
}

export default StudioSearchPage