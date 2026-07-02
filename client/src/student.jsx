import {BrowserRouter as Router, Link, Route, Routes, useParams} from "react-router-dom"

function Student(){
    const { id } = useParams();
    

    return (
        <>
            {id}
        </>
    )
}

export default Student