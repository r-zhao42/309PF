import './StudioList.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import SummaryCard from "../SummaryCard/SummaryCard"


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
                {studiosArray.map((studio) => { if (studio) {
                    return  <SummaryCard active={studio===chosen} 
                    onClick={() => setChosen(studio)} 
                    title={studio.name} 
                    subtitles={[studio.address, studio.phone_num]} 
                    buttons={["Details", "Class Schedule"]}
                    links={["/studio/"+studio.name, "/class-schedule-page"]}
                    />
                }
                 })}
                </InfiniteScroll>
    )
}

export default StudioList