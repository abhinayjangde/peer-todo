import {useParams} from "react-router"
export default function SearchParams(){
    const {userId} = useParams()
    return (
        <div>
            user is {userId}
        </div>
    )
}