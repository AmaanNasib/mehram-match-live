import React from 'react'
// import "@dotlottie/player-component";

const RegSuccess = () => {
    return (
        <>
            <div className="bg-white text-gray-100 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    {/* Lottie animation container */}
                    <div
                        id="lottie-container"
                        className="mx-auto mb-6"
                        style={{ width: "300px", height: "300px" }}
                    >
                        <dotlottie-player
                            src="https://lottie.host/2eec0c36-4756-4506-8254-7db2fb860851/2fcvHUhwG6.json"
                            background="transparent"
                            speed="0.85"
                            style={{ width: "300px", height: "300px" }}
                            loop
                            autoplay
                        ></dotlottie-player>
                    </div>

                    {/* Success message */}
                    <h1 className="text-4xl font-bold mt-6 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
                        Your Profile Has Been Created
                    </h1>
                    <p className="mt-2 text-gray-300">
                        Thank you for registering. You can now log in and explore our
                        services.
                    </p>

                    {/* Link to the login page */}
                    <a
                        href="/login"
                        className="mt-6 inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        </>
    )
}

export default RegSuccess