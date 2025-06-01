import React, { useEffect } from 'react';
import Sidebar from '../../DSidebar/Sidebar';
import TrendingProfiles from '../../TrendingProfiles/TrendingProfiles';
import RecommendedProfiles from '../../Recommended/RecommendedProfiles';
import './myinterest.css';
import Header from '../../header/Header';
import { useState } from 'react';
import { fetchDataV2 ,justUpdateDataV2, fetchDataWithTokenV2} from '../../../../apiUtils';
import AllUser from '../../AllUsers/AllUser';
import { useLocation } from 'react-router-dom';


const MyInterest = () => {

  const [apiData, setApiData] = useState([]);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState([]);
  const [interesteddata , setInteresteddata]= useState([])



  const location = useLocation();
    const lastSegment = location.pathname.split('/').pop(); 



 
  const [activeUser, setactiveUser] = useState();
  const [successMessage, setMessage] = useState(false);





  

const userData=localStorage.getItem("userId");
  useEffect(() => {
    const parameter = {
      url: `/api/user/${userData}/`,
      setterFunction: setactiveUser,
      setErrors : setErrors
    }
    fetchDataV2(parameter)
  }, [])




  const [isOpenWindow, setIsModalOpen] = useState(false);
  const closeWindow = () => {
    setIsModalOpen(false);
  };

  useEffect(()=>{
    if(activeUser?.update_later == false){
    if(activeUser?.profile_started == false || activeUser?.profile_completed == false){
      setIsModalOpen(true)
  }
}
  },[activeUser]);



useEffect (()=>{
  const parameter = {
        url: `/api/user/`,
        setterFunction: setUserDetail,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataV2(parameter);
},[])


useEffect (()=>{
  const parameter = {
        url: `/api/trending_profile/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter);
},[])


useEffect (()=>{
  setInteresteddata(apiData.filter(item => item.is_interested))
},[apiData])




  return (
    <div className="dashboard" >
       <Header subNavActive ={'myInterest'}/>
       <div className="dashboard-container">
        <div className="sidebarContainer"><Sidebar setApiData={setApiData}/></div>
        <div className="users">
      

<AllUser  setApiData={setApiData}
  profiles={ 
    Array.isArray(interesteddata) && interesteddata.every(item => typeof item === 'object' && item !== null)
      ? interesteddata
      : [] 
  }/>
        </div>
       </div>
    </div>
  );
};

export default MyInterest;
