'use client';

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 28.6139,
    lng: 77.2090 // New Delhi default
};

interface MapProps {
    lat?: number;
    lng?: number;
    onLocationSelect?: (lat: number, lng: number) => void;
    markers?: Array<{ lat: number, lng: number, title?: string }>;
}

export default function MapComponent({ lat, lng, onLocationSelect, markers }: MapProps) {
    const [center, setCenter] = useState(defaultCenter);

    useEffect(() => {
        if (lat && lng) {
            setCenter({ lat, lng });
        }
    }, [lat, lng]);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 border rounded">
                <p>Google Maps API Key not configured (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)</p>
            </div>
        );
    }

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onClick={(e) => {
                    if (onLocationSelect && e.latLng) {
                        onLocationSelect(e.latLng.lat(), e.latLng.lng());
                    }
                }}
            >
                {/* Single selected location marker */}
                {(lat && lng) && <Marker position={{ lat, lng }} />}

                {/* Multiple markers (for Admin Map) */}
                {markers && markers.map((m, i) => (
                    <Marker key={i} position={{ lat: m.lat, lng: m.lng }} title={m.title} />
                ))}
            </GoogleMap>
        </LoadScript>
    );
}
