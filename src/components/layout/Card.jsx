import React from 'react'

import '../../styles/card.scss'
import DetailsCard from './DetailsCard'



const Card = ({icons}) => {

    return (
        <div className="card">
            <DetailsCard icons={icons} />
        </div>
    )
}

export default Card

