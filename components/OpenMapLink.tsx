"use client";

type Props = {
    city: string;
    address: string;
};

export function OpenMapLink({ city, address }: Props) {
    const openMap = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${city}, ${address}`
        )}`;

        window.open(url, "_blank");
    };

    return (
        <p
            onClick={openMap}
            className="text-sm font-medium cursor-pointer hover:underline"
        >
            {city}, {address}
        </p>
    );
}
