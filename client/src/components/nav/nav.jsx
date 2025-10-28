import { useTranslation } from 'react-i18next';
import { Menu } from 'antd';
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import MenuItem from 'antd/es/menu/MenuItem';


const Nav = () =>{
    const location = useLocation();
    const { t } = useTranslation();
    const items = [
        { key: "/home", label: <Link to="/home">{t('nav.buttons.dashboard')}</Link>, icon: <HomeOutlined /> },
        { key: "/people", label: <Link to="/people">{t('nav.buttons.scoreboard')}</Link>, icon: <TeamOutlined /> }
    ]
    
    return (
        <nav>
            <Menu mode="horizontal" items={items} selectedKeys={[location.pathname]}/>
        </nav>
    )
        
}

export default Nav