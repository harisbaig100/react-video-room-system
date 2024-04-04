import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  width: 20%;
  margin: 0 auto;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff; /* Blue color */
  color: #fff; /* White color for text */
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0 auto; /* Center the button horizontally */
  display: block; /* Ensure it takes full width */
  
  &:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
`;

const Controls = styled.div`
  margin: 3px;
  padding: 5px;
  height: 27px;
  width: 98%;
  background-color: rgba(255, 226, 104, 0.1);
  margin-top: -8.5vh;
  filter: brightness(1);
  z-index: 1;
  border-radius: 6px;
`;

const ControlSmall = styled.div`
  margin: 3px;
  padding: 5px;
  height: 16px;
  width: 98%;
  margin-top: -6vh;
  filter: brightness(1);
  z-index: 1;
  border-radius: 6px;
  display: flex;
  justify-content: center;
`;

const ImgComponent = styled.img`
  cursor: pointer;
  height: 25px;
`;

const ImgComponentSmall = styled.img`
  height: 15px;
  text-align: left;
  opacity: 0.5;
`;

const StyledVideo = styled.video`
  width: 100%;
  position: static;
  border-radius: 10px;
  overflow: hidden;
  margin: 1px;
  border: 5px solid gray;
`;

export {
  Container,
  Controls,
  ControlSmall,
  ImgComponent,
  ImgComponentSmall,
  StyledVideo,
  StyledButton
};
