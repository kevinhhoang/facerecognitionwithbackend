import React from 'react';

const Rank = ({ name, entries }) => {
    return (
        <div>
            <div className=' pt2 white f4'>
                {`${name} , your current rank is...`}
            </div>
            <div className='white f2'>
                {entries}
            </div>
        </div>
    )
}

export default Rank;