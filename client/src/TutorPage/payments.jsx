
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { supabase } from '../supabaseClient';
import { Loader } from 'lucide-react';
import axios from 'axios'
import Modal from '../Modal'
import NavBar from '../NavBar'

function TutorPayments({ data }){
    const [thisMonth, setThisMonth] = useState([])

    var unpaidFetched = false;
    const [allUnpaid, setUnpaid] = useState([])
    const [shown, setShown] = useState("This Month")

    const [clients, setClients] = useState([])

    const [lessonsShown, setLessonsShown] = useState([])
    const [filtered, setFiltered] = useState([])
    const [showFilter, setShowFilter] = useState("all")

    const [showChooseClient, setChooseClient] = useState(false)
    const [chosenClient, setChosenClient] = useState(-1)

    const [showRangeChoice, setShowRangeChoice] = useState(false)
    const [rangeStart, setRangeStart] = useState('')
    const [rangeEnd, setRangeEnd] = useState('')

    const nav = useNavigate()
    const formatter = new Intl.NumberFormat('default', {style: 'currency', currency: 'GBP'});

    useEffect(()=>{
        setThisMonth(data.thisMonth)
        setLessonsShown(data.thisMonth)
        setFiltered(data.thisMonth)
        setClients(data.clients)
    },[data])

    async function handleSelectClient(){
        if (chosenClient===-1){
            alert("Please choose a client from the list")
        }
        else{
            const clientDesc = clients.filter((client)=>client.clientlink==chosenClient)[0].description

            const session = await supabase.auth.getSession()
            await axios.post(
                "http://localhost:443/tutor/payments/byclient",
                {headers:
                    {Authorization: `Bearer: ${session.data.session.access_token}`}, 
                    user: session.data.session.user.id,
                    clientlink: chosenClient}).
                then(res =>{
                    setLessonsShown(res.data)
                    setFiltered(res.data)
                    setShown(`For Client: ${clientDesc}`)
                    setShowFilter("all")
                    setChooseClient(false)
                    console.log(shown)
                    })
        }
    }

    async function handleGetRange(){
        const gap = (new Date(rangeEnd)) - (new Date(rangeStart))
        console.log(gap)
         if (gap>60*60*24*366*1000 || gap <0){
            alert("Please chose dates that are a maximum of one year apart, and check the start is before the end")
        }
        else{
            const session = await supabase.auth.getSession()
            await axios.post(
                "http://localhost:443/tutor/payments/byrange",
                {headers:
                    {Authorization: `Bearer: ${session.data.session.access_token}`}, 
                    user: session.data.session.user.id,
                    start: rangeStart,
                    end: rangeEnd}).
                then(res =>{
                    setLessonsShown(res.data)
                    setFiltered(res.data)
                    setShown(`In Range: ${(new Date(rangeStart).toUTCString().slice(4, -12))} to ${(new Date(rangeEnd).toUTCString().slice(4, -12))}`)
                    setShowFilter("all")
                    setShowRangeChoice(false)
                    console.log(shown)
                    })
        }

        console.log(rangeStart)
        console.log(rangeEnd)
    }

    async function getAllUnpaid(){
        try{
            const session = await supabase.auth.getSession()
            await axios.post(
                "http://localhost:443/tutor/payments/allunpaid",
                {headers:
                    {Authorization: `Bearer: ${session.data.session.access_token}`}, 
                    user: session.data.session.user.id,
                }).
                then(res =>{
                    setUnpaid(res.data.unpaid)
                    setLessonsShown(res.data.unpaid)
                    setFiltered(res.data.unpaid)
                    setShowFilter("all")
                    setShown("All Unpaid Lessons")
                    })
        }
        catch{
            console.log("error getting unpaid lessons")
        }
    }

    return(
        <>
        <div className='w-screen h-screen flex flex-col min-h-0 bg-gray-50'>

            <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-700">
            <NavBar />
            <div className='flex flex-row'>
            <div className='w-1/2'>
                <h1 className='text-5xl text-left pl-4'>Payments</h1>
            </div>
            <div className="px-6 pb-5 pt-2 flex flex-col w-1/2">
                    <span className="text-white text-lg font-semibold mb-3 text-right">{shown}</span>
                    <div className="flex flex-row flex-wrap gap-2 justify-end">
                    <button
                        onClick={() => {
                        setLessonsShown(thisMonth)
                        setFiltered(thisMonth)
                        setShowFilter("all")
                        setShown("This Month")
                        }}
                        className="px-8 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                    >
                        This month
                    </button>
                    <button
                        onClick={() => setChooseClient(true)}
                        className="px-8 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                    >
                        By client
                    </button>
                    <button
                        onClick={() => {
                        if (!unpaidFetched) {
                            setFiltered([])
                            getAllUnpaid();
                            unpaidFetched = true;
                        }
                        else{
                        setLessonsShown(allUnpaid)
                        setFiltered(allUnpaid)
                        setShowFilter("all")
                        setShown("All Unpaid Lessons")
                        }}}
                        className="px-8 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                    >
                        All unpaid
                    </button>
                    <button
                        onClick={() => setShowRangeChoice(true)}
                        className="px-8 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                    >
                        Date range
                    </button>
                    </div>
            </div>
            </div>
            </div>

            <div className="flex-1 min-h-0 p-6 bg-white">
            <div className='h-full flex flex-col'>
                <div className="flex flex-row items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex flex-row gap-6">
                    <div>
                    <span className="text-lg text-gray-500">Lessons: </span>
                    <span className="text-lg font-semibold text-gray-800">{filtered.length}</span>
                    </div>
                    <div>
                    
                    <span className="text-lg text-gray-500">Total: </span>
                    <span className="text-lg font-semibold text-gray-800">{formatter.format(filtered.reduce((acc, cur) => cur.price + acc, 0))}</span>
                    </div>
                </div>


                <div>
                <span className="text-xs text-gray-500">Press to filter paid, unpaid or all lessons </span>
                <button
                    onClick={() => {
                    if (showFilter === "all") {
                        setShowFilter("unpaid")
                        setFiltered(lessonsShown.filter((lesson) => !lesson.paid))
                    }
                    else if (showFilter === "unpaid") {
                        setShowFilter("paid")
                        setFiltered(lessonsShown.filter((lesson) => lesson.paid))
                    }
                    else {
                        setShowFilter("all")
                        setFiltered(lessonsShown)
                    }
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors capitalize
                    ${showFilter === "unpaid"
                        ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        : showFilter === "paid"
                        ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"}`}
                >
                    {showFilter}
                </button>
                </div>
                </div>

                <div className='flex-1 min-h-0 overflow-y-auto'>
                <table className="w-full text-sm text-left" style={{zIndex:0}}>
                <thead className="border-b border-gray-200 text-xs text-gray-500 uppercase top-0 bg-white">
                    <tr>
                    <th className="py-2 font-medium">Paid</th>
                    <th className="py-2 font-medium">Client</th>
                    <th className="py-2 font-medium">Lesson</th>
                    <th className="py-2 font-medium">Time</th>
                    <th className="py-2 font-medium text-right">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(({ clientlink, client_links, lessontime, price, title, lessonid, paid }) => (
                    <tr
                        key={lessonid}
                        onClick={() => nav(`/student/${clientlink}/lesson/${lessonid}`)}
                        className="cursor-pointer hover:bg-blue-50 border-b border-gray-50 transition-colors"
                    >
                        <td className="py-2.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            paid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                            {paid ? "Paid" : "Unpaid"}
                        </span>
                        </td>
                        <td className="py-2.5 text-gray-700">{client_links.description}</td>
                        <td className="py-2.5 text-gray-700">{title}</td>
                        <td className="py-2.5 text-gray-500">{(new Date(lessontime).toUTCString().slice(0, -7))}</td>
                        <td className="py-2.5 text-right font-medium text-gray-800">{formatter.format(price)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>

                {filtered.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-8">No lessons to show</p>
                )}
                </div>
            </div>
            </div>

            <Modal open={showChooseClient} onClose={() => setChooseClient(false)}>
            <div className="p-2 w-72">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Filter by client</h3>
                <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setChosenClient(e.target.value)}
                >
                <option value={-1}>Choose a client</option>
                {clients.map(({ clientlink, description }) => (
                    <option key={clientlink} value={clientlink}>{description}</option>
                ))}
                </select>
                <button
                onClick={handleSelectClient}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg shadow-sm"
                >
                Submit
                </button>
            </div>
            </Modal>

            <Modal open={showRangeChoice} onClose={() => setShowRangeChoice(false)}>
            <div className="p-2 w-72 space-y-3">
                <h3 className="text-base font-semibold text-gray-800 mb-1">Choose a date range</h3>

                <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start</label>
                <input
                    name="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="date"
                    value={rangeStart}
                    onChange={e => { setRangeStart(e.target.value); }}
                />
                </div>

                <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">End</label>
                <input
                    name="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="date"
                    value={rangeEnd}
                    onChange={e => { setRangeEnd(e.target.value); }}
                />
                </div>

                <button
                onClick={handleGetRange}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg shadow-sm"
                >
                Submit
                </button>
            </div>
            </Modal>

        </div>
        </>
    )

}
export default TutorPayments