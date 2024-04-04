import React from "react";
import { useNavigate } from "react-router-dom";
import { v1 as uuid } from "uuid";
import {StyledButton} from './RoomStyles'

const CreateRoom = () => {
    const navigate = useNavigate();

    const createRoom = () => {
        const roomId = uuid();
        navigate(`/room/${roomId}`);
    };

    return (
        <StyledButton onClick={createRoom}>Create Room</StyledButton>
    );
};

export default CreateRoom;
