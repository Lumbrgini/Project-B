import { useTranslation } from 'react-i18next';
import { Menu } from 'antd';
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import UserDataOverlay from  '../userDataOverlay/userDataOverlay'
import AddDrinkOverlay from '../addDrinkOverlay/addDrinkOverlay';
import LogoutButton from '../logoutButton/logoutButton';

const handleDrinkAdded = () => {
    console.log("fetch drinks")
    //fetchDrinks(); // reload after modal submit
};

const Nav = () =>{
    const location = useLocation();
    const { t } = useTranslation();
    const items = [
        { key: "/home", label: <Link to="/home">{t('nav.buttons.dashboard')}</Link>, icon: <HomeOutlined /> },
        { key: "/people", label: <Link to="/people">{t('nav.buttons.scoreboard')}</Link>, icon: <TeamOutlined /> },
        { key: "/logout", label: <LogoutButton></LogoutButton>},
        { key: "/addDrink", label: <AddDrinkOverlay afterCloseHandler={handleDrinkAdded} />},
        { key: "/updateData", label: <UserDataOverlay />}
    ]

    
        
            
    
    return (
        <nav>
            <Menu mode="horizontal" items={items} selectedKeys={[location.pathname]}/>
        </nav>
    )
        
}

export default Nav