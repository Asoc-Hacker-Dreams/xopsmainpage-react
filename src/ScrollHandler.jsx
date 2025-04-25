import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollHandler = () => {
    const location = useLocation();

    useEffect(() => {
        // Manejar el desplazamiento basado en el hash
        const hash = location.hash;
        const element = document.getElementById(hash.substring(1)); // Obtener el ID sin el '#'

        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }

    }, [location]);

    return null; // Este componente no necesita renderizar nada
};

export default ScrollHandler;