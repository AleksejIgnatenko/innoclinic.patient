import React, { useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import './../styles/CustomMap.css';

const CustomMap = ({ offices, onClose }) => {
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
        <div className="modal-overlay">
            <button className="close-button" onClick={onClose}>X</button>
            <Map center={defaultCenter} zoom={10} width="80%" height="400px" provider={osmProvider}>
                {offices.map((office, index) => {
                    const anchor = [parseFloat(office.longitude), parseFloat(office.latitude)];
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