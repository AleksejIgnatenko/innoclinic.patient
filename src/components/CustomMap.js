import React, { useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import './../styles/CustomMap.css';

const CustomMap = ({ offices, onClose, setSelectedAddresses }) => {
    const defaultCenter = [52.4368, 31.0164];

    const handleMarkerClick = (office) => {
        setSelectedAddresses(office.address);
        console.log(office.address);
    };

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

    useEffect(() => {
        const removePigeonClickBlock = () => {
            const clickBlocks = document.querySelectorAll('.pigeon-click-block');
            clickBlocks.forEach(block => {
                block.style.pointerEvents = 'auto';
            });
        };

        removePigeonClickBlock();
    }, []);

    return (
        <div className="modal-overlay">
            <button className="close-button" onClick={onClose}>X</button>
            {offices.length < 1 ? (
                <div>No offices available</div>
            ) : (
                <Map center={defaultCenter} zoom={10} width="800px" height="400px" provider={osmProvider}>
                    {offices.map((office, index) => {
                        const anchor = [parseFloat(office.longitude), parseFloat(office.latitude)];
                        return (
                            <Marker 
                                key={index} 
                                anchor={anchor} 
                                payload={index} 
                                onClick={() => handleMarkerClick(office)}
                            >
                                <div style={{ color: 'red', fontSize: '24px' }} className="pigeon-marker">🏥</div>
                            </Marker>
                        );
                    })}
                </Map>
            )}
        </div>
    );
};

export default CustomMap;