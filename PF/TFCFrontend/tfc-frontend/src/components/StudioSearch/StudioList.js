import './StudioList.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import SummaryCard from "../SummaryCard/SummaryCard";
import React from 'react';

const StudioList = ({loadMore, nextUrl, componentHeight, studiosArray, setChosen, chosen}) => {


    return (
        <InfiniteScroll
                className="summary-card-list"
                dataLength={studiosArray.length}
                next={loadMore}
                hasMore={nextUrl ? true : false}
                loader={<h4>Loading...</h4>}
                height={componentHeight}
                scrollThreshold={0.99}
                scrollableTarget="summary-card-list"
                >
                {studiosArray.map((studio) => {
                    return  <SummaryCard key={studio.name} active={studio===chosen} 
                    onClick={() => setChosen(studio)} 
                    title={studio.name} 
                    subtitles={[studio.address, studio.phone_num]} 
                    buttons={["Details"]}
                    links={["/studio/"+studio.name]}
                    />
                 })}
                </InfiniteScroll>
    )
}

export default StudioList