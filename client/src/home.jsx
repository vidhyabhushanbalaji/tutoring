function Home(){
    const userID = localStorage.getItem(id)
    return(
        <>
            <p>
                {userID}
            </p>
        </>
    )
}

export default Home