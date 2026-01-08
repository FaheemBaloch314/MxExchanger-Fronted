import React from 'react'

const DetailsCard = ({ icons }) => {
    return (
        <div className="details">
            {icons.map((item, index) => (
                <div className="details-item" key={index}>
                    <div className="icons">
                        <p>{item.icon}</p>
                        <div></div>
                    </div>
                    <div className="information">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default DetailsCard


/*
<div className="icons">
<p>{icon}</p>
<div></div>
</div>
<div className="information">
<h4>{title}</h4>
<p>{description}</p>
</div>
*/