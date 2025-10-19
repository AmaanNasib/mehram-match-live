import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postDataWithFetchV2, fetchDataV2 } from '../../apiUtils'

const ProfileCardYLM = ({userId, name, age, city, activeUser, profile}) => {
    
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [userIdCurrent] = useState(localStorage.getItem("userId"));
    const [Error, setErrors] = useState("");
    const [message, setSuccessMessage] = useState();
    const [photoRequestStatus, setPhotoRequestStatus] = useState(null); // Track photo request status: 'pending', 'accepted', 'rejected', null
    const [loadingPhotoStatus, setLoadingPhotoStatus] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleMenuClick = (e) => {
        e.stopPropagation();
    };

    const requestPhoto = (targetUserId) => {
        const parameter = {
            url: `/api/user/photo-request/`,
            payload: {
                action_on_id: Number(targetUserId),
                status: 'Requested'
            },
            setErrors: (error) => {
                console.error('Photo request error:', error);
                
                // Check if it's a duplicate request error
                if (error && error.already_sent === true) {
                    console.log('Photo request already sent');
                    setSuccessMessage('Photo request already sent!');
                    setPhotoRequestStatus('pending');
                    // Refresh status to confirm
                    setTimeout(() => {
                        checkPhotoRequestStatus();
                    }, 1000);
                } else {
                    setErrors(error);
                }
            },
            setSuccessMessage: (message) => {
                console.log('Photo request success:', message);
                setSuccessMessage('Photo request sent successfully!');
                // Update status and refresh
                setPhotoRequestStatus('pending');
                setTimeout(() => {
                    checkPhotoRequestStatus();
                }, 1000);
            },
        };
        postDataWithFetchV2(parameter);
    };

    const reportUser = (targetUserId) => {
        // Temporary: Use blocking as reporting
        const parameter = {
            url: `/api/recieved/`,
            payload: {
                action_by_id: Number(userIdCurrent),
                action_on_id: Number(targetUserId),
                blocked: true,
                status: 'Reported'
            },
            setErrors: setErrors,
        };
        postDataWithFetchV2(parameter);
    };

    const shortlist = (interestedId) => {
        const parameter = {
            url: `/api/recieved/`,
            payload: {
                action_by_id: userIdCurrent,
                action_on_id: interestedId,
                shortlisted: true,
            },
            setErrors: setErrors,
        };
        postDataWithFetchV2(parameter);
    };

    const blocked = (interestedId) => {
        const parameter = {
            url: `/api/recieved/`,
            payload: {
                action_by_id: userIdCurrent,
                action_on_id: interestedId,
                blocked: true,
            },
            setErrors: setErrors,
        };
        postDataWithFetchV2(parameter);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && !event.target.closest('.menu-container')) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setSuccessMessage(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Check existing photo request status on component mount
    useEffect(() => {
        if (userId && userIdCurrent) {
            checkPhotoRequestStatus();
        }
    }, [userId, userIdCurrent]);

    // Function to check existing photo request status
    const checkPhotoRequestStatus = async () => {
        setLoadingPhotoStatus(true);
        try {
            const parameter = {
                url: `/api/user/photo-request/?user_id=${userId}`,
                setterFunction: (data) => {
                    console.log('=== Photo Request Status Check (ProfileCardYML) ===');
                    console.log('API Response:', data);
                    
                    if (data && data.length > 0) {
                        console.log('All requests data (ProfileCardYML):', data);
                        console.log('Looking for userIdCurrent:', userIdCurrent, typeof userIdCurrent);
                        
                        // Check if current user has sent a request to this profile
                        const userRequest = data.find(request => {
                            console.log('Checking request (ProfileCardYML):', request);
                            console.log('request.action_by:', request.action_by);
                            console.log('request.action_by.id:', request.action_by?.id, typeof request.action_by?.id);
                            console.log('userIdCurrent:', userIdCurrent, typeof userIdCurrent);
                            
                            return request.action_by && 
                                   request.action_by.id === Number(userIdCurrent);
                        });
                        
                        if (userRequest) {
                            console.log('Found user request (ProfileCardYML):', userRequest);
                            console.log('Status field:', userRequest.status);
                            
                            if (userRequest.status === 'Requested') {
                                console.log('✅ Photo request found (status=Requested) - setting status to pending');
                                setPhotoRequestStatus('pending');
                            } else if (userRequest.status === 'Accepted') {
                                console.log('✅ Photo request accepted - setting status to accepted');
                                setPhotoRequestStatus('accepted');
                            } else if (userRequest.status === 'Rejected') {
                                console.log('❌ Photo request rejected - setting status to rejected');
                                setPhotoRequestStatus('rejected');
                            }
                        } else {
                            console.log('❌ No photo request found by current user - setting status to null');
                            console.log('Available requests (ProfileCardYML):', data.map(r => ({ id: r.action_by?.id, status: r.status })));
                            setPhotoRequestStatus(null);
                        }
                    } else {
                        console.log('❌ No photo requests found for this user - setting status to null');
                        setPhotoRequestStatus(null);
                    }
                    console.log('=== Status Check Complete (ProfileCardYML) ===');
                    setLoadingPhotoStatus(false);
                },
                setErrors: setErrors,
            };
            fetchDataV2(parameter);
        } catch (error) {
            console.error('Error checking photo request status:', error);
            setLoadingPhotoStatus(false);
        }
    };

    return (
        <>
            {/* Success Message */}
            {message && (
                <div className="success-message" style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: '#4CAF50',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    zIndex: 9999,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    animation: 'slideInOut 3s ease-in-out forwards'
                }}>
                    {message}
                </div>
            )}
            <div className="bg-[#FFF3FA] min-w-[200px] min-h-auto rounded-[12px] p-4 flex border-[1px] border-[#FFCCEA] hover:bg-[#ffeff8] transition-all cursor-pointer relative">
                {/* Agent Verified Ribbon */}
                {profile?.agent_id && (
                    <div className="agent-verified-ribbon" style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4"/>
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                        Agent Verified
                    </div>
                )}
                
                {/* Three-dot menu button */}
                <div className="menu-container" style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
                    <button 
                        className="menu-button" 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu();
                        }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 1)';
                            e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="19" cy="12" r="1"/>
                            <circle cx="5" cy="12" r="1"/>
                        </svg>
                    </button>
                    
                    {/* Dropdown menu */}
                    {showMenu && (
                        <div 
                            className="menu-dropdown" 
                            onClick={handleMenuClick}
                            style={{
                                position: 'absolute',
                                top: '32px',
                                right: '0',
                                background: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                minWidth: '140px',
                                zIndex: 1000,
                                border: '1px solid #e5e7eb',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Common options for all users */}
                            <div
                                className="menu-item"
                                onClick={() => {
                                    setShowMenu(false);
                                    navigate(`/details/${userId}`);
                                }}
                                style={{
                                    padding: '10px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '13px',
                                    color: '#374151',
                                    transition: 'background-color 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = '#f3f4f6';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                                View Profile
                            </div>

                            {/* Conditional options based on user gender */}
                            {activeUser?.gender === 'male' && (
                                <>
                                    {/* Photo Request - only show if female profile has photo privacy set to "Yes" */}
                                    {profile?.photo_upload_privacy_option === 'Yes' && (
                                        <div
                                            className="menu-item"
                                            onClick={() => {
                                                setShowMenu(false);
                                                requestPhoto(userId);
                                            }}
                                            style={{
                                                padding: '10px 12px',
                                                cursor: photoRequestStatus === 'pending' ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '13px',
                                                color: photoRequestStatus === 'pending' ? '#9ca3af' : '#2563eb',
                                                transition: 'background-color 0.2s ease',
                                                opacity: photoRequestStatus === 'pending' ? 0.6 : 1,
                                            }}
                                            onMouseEnter={(e) => {
                                                if (photoRequestStatus !== 'pending') {
                                                    e.target.style.backgroundColor = '#eff6ff';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                                <polyline points="21,15 16,10 5,21"/>
                                            </svg>
                        {(() => {
                            console.log('Menu render - loadingPhotoStatus:', loadingPhotoStatus, 'photoRequestStatus:', photoRequestStatus);
                            if (loadingPhotoStatus) return 'Checking...';
                            if (photoRequestStatus === 'pending') return 'Request Sent ✓';
                            if (photoRequestStatus === 'accepted') return 'Request Accepted ✓';
                            if (photoRequestStatus === 'rejected') return 'Request Rejected ✗';
                            return 'Request Photo';
                        })()}
                                        </div>
                                    )}

                                    <div
                                        className="menu-item"
                                        onClick={() => {
                                            setShowMenu(false);
                                            shortlist(userId);
                                        }}
                                        style={{
                                            padding: '10px 12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '13px',
                                            color: '#374151',
                                            transition: 'background-color 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#f3f4f6';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 21 21" fill="none">
                                            <path
                                                d="M2.68945 3.62109V7.37109H6.43945V3.62109H2.68945ZM3.93945 4.87109H5.18945V6.12109H3.93945V4.87109ZM7.68945 4.87109V6.12109H17.0645V4.87109H7.68945ZM2.68945 8.62109V12.3711H6.43945V8.62109H2.68945ZM3.93945 9.87109H5.18945V11.1211H3.93945V9.87109ZM7.68945 9.87109V11.1211H17.0645V9.87109H7.68945ZM2.68945 13.6211V17.3711H6.43945V13.6211H2.68945ZM3.93945 14.8711H5.18945V16.1211H3.93945V14.8711ZM7.68945 14.8711V16.1211H17.0645V14.8711H7.68945Z"
                                                fill="#FD2C79"
                                            />
                                        </svg>
                                        Shortlist
                                    </div>

                                    <div
                                        className="menu-item"
                                        onClick={() => {
                                            setShowMenu(false);
                                            blocked(userId);
                                        }}
                                        style={{
                                            padding: '10px 12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '13px',
                                            color: '#dc2626',
                                            transition: 'background-color 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#fef2f2';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 21 20" fill="none">
                                            <path
                                                d="M10.2598 1.87109C8.78841 1.87109 7.42122 2.24219 6.1582 2.98438C4.93424 3.70052 3.96419 4.67057 3.24805 5.89453C2.50586 7.15755 2.13477 8.52474 2.13477 9.99609C2.13477 11.4674 2.50586 12.8346 3.24805 14.0977C3.96419 15.3216 4.93424 16.2917 6.1582 17.0078C7.42122 17.75 8.78841 18.1211 10.2598 18.1211C11.7311 18.1211 13.0983 17.75 14.3613 17.0078C15.5853 16.2917 16.5553 15.3216 17.2715 14.0977C18.0137 12.8346 18.3848 11.4674 18.3848 9.99609C18.3848 8.52474 18.0137 7.15755 17.2715 5.89453C16.5553 4.67057 15.5853 3.70052 14.3613 2.98438C13.0983 2.24219 11.7311 1.87109 10.2598 1.87109ZM10.2598 3.12109C11.5098 3.12109 12.6686 3.43359 13.7363 4.05859C14.765 4.67057 15.5853 5.49089 16.1973 6.51953C16.8223 7.58724 17.1348 8.74609 17.1348 9.99609C17.1348 10.8294 16.9915 11.6367 16.7051 12.418C16.4186 13.1602 16.015 13.8372 15.4941 14.4492L5.9043 4.66406C6.50326 4.16927 7.17383 3.78841 7.91602 3.52148C8.6582 3.25456 9.43945 3.12109 10.2598 3.12109ZM5.02539 5.54297L14.6152 15.3281C14.0163 15.8229 13.3457 16.2038 12.6035 16.4707C11.8613 16.7376 11.0801 16.8711 10.2598 16.8711C9.00977 16.8711 7.85091 16.5586 6.7832 15.9336C5.75456 15.3216 4.93424 14.5013 4.32227 13.4727C3.69727 12.4049 3.38477 11.2461 3.38477 9.99609C3.38477 9.16276 3.52799 8.35547 3.81445 7.57422C4.10091 6.83203 4.50456 6.15495 5.02539 5.54297Z"
                                                fill="#dc2626"
                                            />
                                        </svg>
                                        Block User
                                    </div>
                                </>
                            )}

                            {/* Female user options - only Block and Report */}
                            {activeUser?.gender === 'female' && (
                                <>
                                    <div
                                        className="menu-item"
                                        onClick={() => {
                                            setShowMenu(false);
                                            reportUser(userId);
                                        }}
                                        style={{
                                            padding: '10px 12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '13px',
                                            color: '#dc2626',
                                            transition: 'background-color 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#fef2f2';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                                            <line x1="4" y1="22" x2="4" y2="15"/>
                                        </svg>
                                        Report User
                                    </div>

                                    <div
                                        className="menu-item"
                                        onClick={() => {
                                            setShowMenu(false);
                                            blocked(userId);
                                        }}
                                        style={{
                                            padding: '10px 12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '13px',
                                            color: '#dc2626',
                                            transition: 'background-color 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#fef2f2';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 21 20" fill="none">
                                            <path
                                                d="M10.2598 1.87109C8.78841 1.87109 7.42122 2.24219 6.1582 2.98438C4.93424 3.70052 3.96419 4.67057 3.24805 5.89453C2.50586 7.15755 2.13477 8.52474 2.13477 9.99609C2.13477 11.4674 2.50586 12.8346 3.24805 14.0977C3.96419 15.3216 4.93424 16.2917 6.1582 17.0078C7.42122 17.75 8.78841 18.1211 10.2598 18.1211C11.7311 18.1211 13.0983 17.75 14.3613 17.0078C15.5853 16.2917 16.5553 15.3216 17.2715 14.0977C18.0137 12.8346 18.3848 11.4674 18.3848 9.99609C18.3848 8.52474 18.0137 7.15755 17.2715 5.89453C16.5553 4.67057 15.5853 3.70052 14.3613 2.98438C13.0983 2.24219 11.7311 1.87109 10.2598 1.87109ZM10.2598 3.12109C11.5098 3.12109 12.6686 3.43359 13.7363 4.05859C14.765 4.67057 15.5853 5.49089 16.1973 6.51953C16.8223 7.58724 17.1348 8.74609 17.1348 9.99609C17.1348 10.8294 16.9915 11.6367 16.7051 12.418C16.4186 13.1602 16.015 13.8372 15.4941 14.4492L5.9043 4.66406C6.50326 4.16927 7.17383 3.78841 7.91602 3.52148C8.6582 3.25456 9.43945 3.12109 10.2598 3.12109ZM5.02539 5.54297L14.6152 15.3281C14.0163 15.8229 13.3457 16.2038 12.6035 16.4707C11.8613 16.7376 11.0801 16.8711 10.2598 16.8711C9.00977 16.8711 7.85091 16.5586 6.7832 15.9336C5.75456 15.3216 4.93424 14.5013 4.32227 13.4727C3.69727 12.4049 3.38477 11.2461 3.38477 9.99609C3.38477 9.16276 3.52799 8.35547 3.81445 7.57422C4.10091 6.83203 4.50456 6.15495 5.02539 5.54297Z"
                                                fill="#dc2626"
                                            />
                                        </svg>
                                        Block User
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className=' w-[60px] h-[60px] rounded-full bg-[#fff] flex-shrink-0 '></div>
                <div className='flex flex-col w-full px-6' >
                    <h1 className=' text-lg font-medium white-space-nowrap '>{name ? name : "Not Mentioned"}</h1>
                    <div className=' grid grid-rows-2 grid-cols-2 w-full h-auto mt-2 ' >
                        <h4 className=' text-sm font-normal ' >{city? city : "Not Mentioned"}</h4>
                        <h4 className=' text-sm font-normal ' >{age ? age : "Not Mentioned"}</h4>
                        <h4 className=' text-sm font-normal ' >Fair</h4>
                        <h4 className=' text-sm font-normal ' >Single</h4>
                    </div>
                    <div className=' flex gap-4 w-full mt-3 ' >

                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.41333 13.8733C8.18666 13.9533 7.81333 13.9533 7.58667 13.8733C5.65333 13.2133 1.33333 10.46 1.33333 5.79332C1.33333 3.73332 2.99333 2.06665 5.04 2.06665C6.25333 2.06665 7.32667 2.65332 8 3.55998C8.67333 2.65332 9.75333 2.06665 10.96 2.06665C13.0067 2.06665 14.6667 3.73332 14.6667 5.79332C14.6667 10.46 10.3467 13.2133 8.41333 13.8733Z" stroke="#CB3B8B" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.3333 13.6667H4.66665C2.66665 13.6667 1.33331 12.6667 1.33331 10.3334V5.66671C1.33331 3.33337 2.66665 2.33337 4.66665 2.33337H11.3333C13.3333 2.33337 14.6666 3.33337 14.6666 5.66671V10.3334C14.6666 12.6667 13.3333 13.6667 11.3333 13.6667Z" stroke="#CB3B8B" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M11.3334 6L9.24668 7.66667C8.56002 8.21333 7.43335 8.21333 6.74668 7.66667L4.66669 6" stroke="#CB3B8B" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.66669 7.33337L14.1334 1.8667" stroke="#CB3B8B" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.6667 4.53337V1.33337H11.4667" stroke="#CB3B8B" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.33331 1.33337H5.99998C2.66665 1.33337 1.33331 2.66671 1.33331 6.00004V10C1.33331 13.3334 2.66665 14.6667 5.99998 14.6667H9.99998C13.3333 14.6667 14.6666 13.3334 14.6666 10V8.66671" stroke="#CB3B8B" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>





                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileCardYLM