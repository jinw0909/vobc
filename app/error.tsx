"use client";

import Link from "next/link";

export default function Error() {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "2rem" }}>
            <h2>Error has occurred</h2>

            <p style={{ color: "#666" }}>
                Can you please try to check back later
            </p>

            <a
                href="/"
                style={{
                    display: "inline-block",
                    padding: "0.75rem 1.25rem",
                    background: "#000",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                }}
            >
                Back to Home
            </a>
        </div>
    );
}
