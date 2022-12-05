import StudioMap from "./StudioMap"
import StudioList from "./StudioList"

const StudioSearch = () => {

    return (
        <>
            <StudioList studios={studiosArray}/>
            <StudioMap />
        </>
    )
}