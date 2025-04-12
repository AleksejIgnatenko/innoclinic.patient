import React, { useEffect } from 'react';
import { Map, Marker } from 'pigeon-maps';
import '../../styles/organisms/CustomMap.css';
import { CloseButton } from '../atoms/CloseButton';

const CustomMap = ({ items, handleMarkerClick, onClose }) => {
    const defaultCenter = [52.4368, 31.0164];
    
    useEffect(() => {
        const removePigeonClickBlock = () => {
            const clickBlocks = document.querySelectorAll('.pigeon-click-block');
            clickBlocks.forEach(block => {
                block.style.pointerEvents = 'auto';
            });
        };

        removePigeonClickBlock();
    }, []);

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
        <>
            <div className="modal-overlay">
                <CloseButton onClick={onClose}/>
                {items.length < 1 ? (
                    <Map center={defaultCenter} zoom={10} width="800px" height="400px" provider={osmProvider}></Map>
                ) : (
                    <Map center={defaultCenter} zoom={10} width="800px" height="400px" provider={osmProvider}>
                        {items.map((item, index) => {
                            const anchor = [parseFloat(item.longitude), parseFloat(item.latitude)];
                            return (
                                <Marker
                                    key={index}
                                    anchor={anchor}
                                    payload={index}
                                    onClick={() => handleMarkerClick(item)}
                                >
                                    <div style={{ color: 'red', fontSize: '24px' }} className="pigeon-marker">🏥</div>
                                </Marker>
                            );
                        })}
                    </Map>
                )}
            </div>
        </>
    );
};

export default CustomMap;