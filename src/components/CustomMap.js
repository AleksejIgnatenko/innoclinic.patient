import React, { useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import './../styles/CustomMap.css';

const CustomMap = ({ doctors, onClose }) => {
    const defaultCenter = [52.4368, 31.0164];

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    const osmProvider = (x, y, z) => {
        return `https://${(x + y) % 2 ? 'b' : 'a'}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
    };

    return (
        <div class="modal-overlay">
            <button class="close-button" onClick={onClose}>X</button>
            <Map center={defaultCenter} zoom={10} width="80%" height="400px" provider={osmProvider}>
                {doctors.map((doctor, index) => {
                    const anchor = [parseFloat(doctor.lat), parseFloat(doctor.lng)];

                    return (
                        <Marker key={index} anchor={anchor} payload={index}>
                            <div style={{ color: 'red', fontSize: '24px' }}>🏥</div>
                        </Marker>
                    );
                })}
            </Map>
        </div>
    );
};

export default CustomMap;