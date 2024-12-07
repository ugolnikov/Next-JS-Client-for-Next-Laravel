'use client'
import { useState } from 'react'
import Image from 'next/image'
import Loader from '@/components/Loader'

const ImageWithLoader = ({ src, alt, width, height, className }) => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="scale-50">
                        <Loader />
                    </div>
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                onLoad={() => setIsLoading(false)}
                priority={true}
            />
        </div>
    )
}

export default ImageWithLoader 