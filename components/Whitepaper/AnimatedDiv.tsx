import React from 'react'
import styles from './styles.module.css'
export default function AnimatedDiv() {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '300px',
            borderRadius: '12px',
            backgroundColor: '#222'
        }}>
            <div className="content" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                color: '#fff',
                padding: '1rem',
                boxSizing: 'border-box'
            }}></div>
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
                // viewBox="0 0 100 100"
                // preserveAspectRatio="none"
            >
                <rect
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    rx="12"
                    ry="12"
                    pathLength="1"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                    vectorEffect="non-scaling-stroke"
                >
                    <animate
                        attributeName="stroke-dashoffset"
                        from="1"
                        to="0"
                        dur="6s"
                        repeatCount="indefinite"
                    ></animate>
                </rect>
            </svg>
        </div>
    )
}