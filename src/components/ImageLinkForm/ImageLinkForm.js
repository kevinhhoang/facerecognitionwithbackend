import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onPictureSubmit }) => {
    return (
        <div>
            <p className='f5 white'>
                {'The AI will detect faces in your picture.'}
            </p>
            <div className='center'>
                <div className='form center pa2 br3 shadow-5'>
                    <input className='f4 pa2 w-70' type='text' onChange={onInputChange}/>
                    <button 
                        className='w-30 grow f4 link ph3 pv2 dib black bg-washed-yellow'
                        onClick={onPictureSubmit}
                    >Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;