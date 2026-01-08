import React, { useEffect, useState } from 'react'
import '../../styles/admin/message.scss'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
const Messages = () => {

    const [data, setData] = useState([])
    const navigate = useNavigate('')

    useEffect(() => {
        const checkUserIsLogin = async () => {
            const response = await fetch('http://localhost:3000/api/v1/isAdmin', {
                method: 'get',
                credentials: 'include'
            })
            const result = await response.json()

            if (!result.success) {
                toast.error(result.error)
                navigate('/')
            }
        }
        checkUserIsLogin()
    }, [])

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch('http://localhost:3000/api/v1/admin/all/messages', {
                method: 'GET',
                credentials: 'include'
            })
            const result = await response.json()

            setData(result)

        }
        fetchMessages()
    }, [])
    return (
        <section className="allMessages">
            <h3>All Messages</h3>

            <div className="contant">
                {data.length === 0 ? (
                    <p>No Messages Found</p>
                ) : (

                    data.map((item, index) => (
                        <div className="card" key={index} >
                            <div className="persnalInfo">
                                <h3>{item.email}</h3>
                                <p>{item.name}</p>
                            </div>
                            <div className="message">
                                <h3>{item.message}</h3>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </section>
    );
}

export default Messages