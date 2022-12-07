import StudioSearch from '../../components/StudioSearch/StudioSearch';
import './StudioSearchPage.css';
import React, {useEffect, useState} from 'react';

const StudioSearchPage = () => {
    return (
        <>
            <h1 className='studio-search-title'>Find a Gym</h1>
            <div className='studio-separator'>
                <hr className='studio-separator-hr'/>
            </div>
            <div className='studio-search-description'>
                <p>Get started on your fitness journey at one of our 100+ locations across the globe!</p>
            </div>
            
            
            <StudioSearch/>
        
        </>
    )
}

export default StudioSearchPage