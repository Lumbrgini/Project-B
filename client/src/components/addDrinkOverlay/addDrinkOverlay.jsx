import './addDrinkOverlay.module.css'
import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';


const AddDrinkOverlay = () => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
     };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                add a drink
            </Button>
            <Modal
                title={t('add_drink.title')}
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            </Modal>
        </>
    );
};

export default AddDrinkOverlay